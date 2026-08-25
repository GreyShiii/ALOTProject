import { showToast } from "./employees";

const searchInput = document.getElementById("overtime-search");

const statusFilter = document.getElementById("overtime-status-filter");

const overtimeTableBody = document.getElementById("overtime-table-body");

const noFilteredRecords = document.getElementById(
    "no-filtered-overtime-records",
);

const overtimePagination = document.getElementById("overtime-pagination");

const requestModal = document.getElementById("overtime-request-modal");

const openRequestButton = document.getElementById("open-overtime-modal");

const closeRequestButton = document.getElementById("close-overtime-modal");

const cancelRequestButton = document.getElementById("cancel-overtime-modal");

const requestForm = document.getElementById("overtime-request-form");

const detailsModal = document.getElementById("overtime-details-modal");

const closeDetailsButton = document.getElementById(
    "close-overtime-details-modal",
);

const closeDetailsFooterButton = document.getElementById(
    "close-overtime-details-button",
);

const detailDate = document.getElementById("detail-overtime-date");

const detailHours = document.getElementById("detail-overtime-hours");

const detailStatus = document.getElementById("detail-overtime-status");

const detailSubmitted = document.getElementById("detail-overtime-submitted");

const detailReason = document.getElementById("detail-overtime-reason");

const rejectionContainer = document.getElementById(
    "detail-overtime-rejection-container",
);

const rejectionReason = document.getElementById(
    "detail-overtime-rejection-reason",
);

const OVERTIME_PER_PAGE = 10;

let currentPage = 1;

let allOvertimeRequests = [];

function formatDate(date) {
    if (!date) {
        return "—";
    }

    const formatted = new Date(date);

    if (isNaN(formatted.getTime())) {
        return date;
    }

    return formatted.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function normalizeStatus(status) {
    return String(status || "")
        .toLowerCase()
        .trim();
}

function statusBadge(status) {
    const normalized = normalizeStatus(status);

    if (normalized === "pending") {
        return `
            <span class="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                <span class="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                Pending
            </span>
        `;
    }

    if (normalized === "approved") {
        return `
            <span class="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                <span class="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                Approved
            </span>
        `;
    }

    return `
        <span class="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
            <span class="h-1.5 w-1.5 rounded-full bg-red-500"></span>
            Rejected
        </span>
    `;
}

function getFilteredOvertime() {
    const searchValue = searchInput?.value.toLowerCase().trim() || "";

    const statusValue = normalizeStatus(statusFilter?.value);

    return allOvertimeRequests.filter((overtime) => {
        const dateText = formatDate(overtime.date);

        const searchText = `
                    ${dateText}
                    ${overtime.hours || ""}
                    ${overtime.reason || ""}
                `.toLowerCase();

        const matchesSearch = searchText.includes(searchValue);

        const matchesStatus =
            statusValue === "" ||
            normalizeStatus(overtime.status) === statusValue;

        return matchesSearch && matchesStatus;
    });
}

function createOvertimeRow(overtime) {
    const formattedDate = formatDate(overtime.date);

    const formattedSubmitted = formatDate(overtime.created_at);

    const hours = Number(overtime.hours || 0);

    const row = document.createElement("tr");

    row.className = "overtime-row transition hover:bg-gray-50";

    row.innerHTML = `
        <td class="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900 text-center">
            ${formattedDate}
        </td>

        <td class="whitespace-nowrap px-4 py-3 text-sm text-gray-700 text-center">
            ${hours.toFixed(2)}
            ${hours === 1 ? "hour" : "hours"}
        </td>

        <td class="px-4 py-3 text-sm text-gray-700 text-center">
            <div class="truncate">
                ${overtime.reason || "—"}
            </div>
        </td>

        <td class="whitespace-nowrap px-4 py-3 text-sm text-gray-500 text-center">
            ${formattedSubmitted}
        </td>

        <td class="whitespace-nowrap px-4 py-3 text-center">
            ${statusBadge(overtime.status)}
        </td>

        <td class="whitespace-nowrap px-4 py-3 text-center">
            <button
                type="button"
                class="view-overtime-button rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                data-id="${overtime.id}"
            >
                View
            </button>
        </td>
    `;

    return row;
}

function renderOvertime(records) {
    overtimeTableBody.innerHTML = "";

    if (records.length === 0) {
        noFilteredRecords?.classList.remove("hidden");

        return;
    }

    noFilteredRecords?.classList.add("hidden");

    records.forEach((overtime) => {
        overtimeTableBody.appendChild(createOvertimeRow(overtime));
    });
}

function renderPagination(totalRecords, totalPages) {
    overtimePagination.innerHTML = "";

    if (totalRecords <= OVERTIME_PER_PAGE) {
        overtimePagination.classList.add("hidden");

        return;
    }

    overtimePagination.classList.remove("hidden");

    const wrapper = document.createElement("div");

    wrapper.className =
        "flex min-h-[72px] w-full items-center justify-between px-5 py-3";

    const endRecord = Math.min(currentPage * OVERTIME_PER_PAGE, totalRecords);

    const information = document.createElement("p");

    information.className = "text-xs text-gray-500";

    information.innerHTML = `
            Showing
            <span class="font-semibold text-gray-700">
                ${endRecord}
            </span>
            of
            <span class="font-semibold text-gray-700">
                ${totalRecords}
            </span>
            records
        `;

    const controls = document.createElement("div");

    controls.className = "flex items-center gap-1";

    const previousButton = document.createElement("button");

    previousButton.type = "button";

    previousButton.disabled = currentPage <= 1;

    previousButton.className =
        "inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-500 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50";

    previousButton.innerHTML = `
            <span class="text-base leading-none">
                ‹
            </span>

            <span>
                Previous
            </span>
        `;

    previousButton.addEventListener("click", () => {
        renderPage(currentPage - 1);
    });

    controls.appendChild(previousButton);

    for (let page = 1; page <= totalPages; page++) {
        const pageButton = document.createElement("button");

        pageButton.type = "button";

        pageButton.textContent = page;

        pageButton.className =
            "inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-2.5 text-xs font-medium transition";

        if (page === currentPage) {
            pageButton.classList.add(
                "border",
                "border-gray-200",
                "bg-gray-100",
                "text-gray-800",
                "shadow-sm",
            );
        } else {
            pageButton.classList.add("text-gray-700", "hover:bg-gray-100");
        }

        pageButton.addEventListener("click", () => {
            renderPage(page);
        });

        controls.appendChild(pageButton);
    }

    const nextButton = document.createElement("button");

    nextButton.type = "button";

    nextButton.disabled = currentPage >= totalPages;

    nextButton.className =
        "inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50";

    nextButton.innerHTML = `
            <span>
                Next
            </span>

            <span class="text-base leading-none">
                ›
            </span>
        `;

    nextButton.addEventListener("click", () => {
        renderPage(currentPage + 1);
    });

    controls.appendChild(nextButton);

    wrapper.appendChild(information);

    wrapper.appendChild(controls);

    overtimePagination.appendChild(wrapper);
}

function renderPage(page = 1) {
    const filtered = getFilteredOvertime();

    const totalRecords = filtered.length;

    const totalPages = Math.ceil(totalRecords / OVERTIME_PER_PAGE);

    if (totalPages === 0) {
        currentPage = 1;
    } else if (page > totalPages) {
        currentPage = totalPages;
    } else if (page < 1) {
        currentPage = 1;
    } else {
        currentPage = page;
    }

    const startIndex = (currentPage - 1) * OVERTIME_PER_PAGE;

    const endIndex = startIndex + OVERTIME_PER_PAGE;

    const pageRecords = filtered.slice(startIndex, endIndex);

    renderOvertime(pageRecords);

    renderPagination(totalRecords, totalPages);
}

async function loadOvertime() {
    try {
        overtimeTableBody.innerHTML = `
                <tr>
                    <td
                        colspan="6"
                        class="px-4 py-10 text-center"
                    >
                        <p class="text-sm text-gray-500">
                            Loading overtime requests...
                        </p>
                    </td>
                </tr>
            `;

        const response = await fetch("/employee/overtime/data", {
            headers: {
                Accept: "application/json",

                "X-Requested-With": "XMLHttpRequest",
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        allOvertimeRequests =
            data.overtimeRequests || data.overtimes || data.data || [];

        renderPage(1);
    } catch (error) {
        console.error("LOAD OVERTIME ERROR:", error);

        overtimeTableBody.innerHTML = `
                <tr>
                    <td
                        colspan="6"
                        class="px-4 py-10 text-center"
                    >
                        <p class="text-sm font-semibold text-red-600">
                            Failed to load overtime requests.
                        </p>

                        <p class="mt-1 text-xs text-gray-500">
                            ${error.message}
                        </p>
                    </td>
                </tr>
            `;
    }
}

openRequestButton?.addEventListener("click", () => {
    requestModal?.classList.remove("hidden");

    requestModal?.classList.add("flex");
});

function closeRequestModal() {
    requestModal?.classList.add("hidden");

    requestModal?.classList.remove("flex");
}

closeRequestButton?.addEventListener("click", closeRequestModal);

cancelRequestButton?.addEventListener("click", closeRequestModal);

requestModal?.addEventListener("click", (event) => {
    if (event.target === requestModal) {
        closeRequestModal();
    }
});

requestForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const hoursInput = document.getElementById("overtime_hours");
    const hoursValue = parseFloat(hoursInput?.value || 0);

    if (hoursValue > 6) {
        alert("Overtime hours cannot exceed 6 hours per request.");
        return;
    }

    const submitButton = requestForm.querySelector('button[type="submit"]');

    const formData = new FormData(requestForm);

    if (submitButton) {
        submitButton.disabled = true;

        submitButton.textContent = "Submitting...";
    }

    try {
        const response = await fetch(requestForm.action, {
            method: "POST",
            body: formData,
            headers: {
                "X-Requested-With": "XMLHttpRequest",

                Accept: "application/json",
            },
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            if (data?.errors) {
                const firstError = Object.values(data.errors)[0];

                alert(
                    Array.isArray(firstError)
                        ? firstError[0]
                        : "Please check your input.",
                );
            } else {
                alert(data?.message || "Unable to submit overtime request.");
            }

            return;
        }

        const record = data?.data || data?.overtime || data?.overtimeRequest;

        if (record) {
            allOvertimeRequests.unshift(record);
        } else {
            await loadOvertime();
        }

        renderPage(1);

        requestForm.reset();

        closeRequestModal();

        if (typeof showToast === "function") {
            showToast(
                data?.message || "Overtime request submitted successfully.",
            );
        }
    } catch (error) {
        console.error("OVERTIME REQUEST ERROR:", error);

        alert("Something went wrong. Please try again.");
    } finally {
        if (submitButton) {
            submitButton.disabled = false;

            submitButton.textContent = "Submit Overtime Request";
        }
    }
});

function openDetails(overtime) {
    const date = formatDate(overtime.date);

    const hours = Number(overtime.hours || 0);

    if (detailDate) {
        detailDate.textContent = date;
    }

    if (detailHours) {
        detailHours.textContent = `${hours.toFixed(2)} ${
            hours === 1 ? "hour" : "hours"
        }`;
    }

    if (detailSubmitted) {
        detailSubmitted.textContent = formatDate(overtime.created_at);
    }

    if (detailReason) {
        detailReason.textContent = overtime.reason || "—";
    }

    if (detailStatus) {
        detailStatus.innerHTML = statusBadge(overtime.status);
    }

    const normalized = normalizeStatus(overtime.status);

    if (normalized === "rejected" && overtime.rejection_reason) {
        rejectionContainer?.classList.remove("hidden");

        if (rejectionReason) {
            rejectionReason.textContent = overtime.rejection_reason;
        }
    } else {
        rejectionContainer?.classList.add("hidden");

        if (rejectionReason) {
            rejectionReason.textContent = "—";
        }
    }

    detailsModal?.classList.remove("hidden");

    detailsModal?.classList.add("flex");
}

document.addEventListener("click", (event) => {
    const button = event.target.closest(".view-overtime-button");

    if (!button) {
        return;
    }

    const overtimeId = Number(button.dataset.id);

    const overtime = allOvertimeRequests.find(
        (item) => Number(item.id) === overtimeId,
    );

    if (overtime) {
        openDetails(overtime);
    }
});

function closeDetails() {
    detailsModal?.classList.add("hidden");

    detailsModal?.classList.remove("flex");
}

closeDetailsButton?.addEventListener("click", closeDetails);

closeDetailsFooterButton?.addEventListener("click", closeDetails);

detailsModal?.addEventListener("click", (event) => {
    if (event.target === detailsModal) {
        closeDetails();
    }
});

searchInput?.addEventListener("input", () => {
    renderPage(1);
});

statusFilter?.addEventListener("change", () => {
    renderPage(1);
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeRequestModal();

        closeDetails();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    loadOvertime();
});
