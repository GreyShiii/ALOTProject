import { showToast } from "./employees";

const openLeaveButton = document.getElementById("open-leave-modal");

const leaveModal = document.getElementById("leave-request-modal");

const closeLeaveButton = document.getElementById("close-leave-modal");

const cancelLeaveButton = document.getElementById("cancel-leave-modal");

const leaveForm = document.getElementById("leave-request-form");

const leaveDetailsModal = document.getElementById("leave-details-modal");

const closeLeaveDetailsButton = document.getElementById(
    "close-leave-details-modal",
);

const closeLeaveDetailsFooter = document.getElementById(
    "close-leave-details-button",
);

const searchInput = document.getElementById("leave-search");

const statusFilter = document.getElementById("leave-status-filter");

const leaveTableBody = document.getElementById("leave-table-body");

const noFilteredResults = document.getElementById("no-filtered-leave-records");

const leavePagination = document.getElementById("leave-pagination");

const pendingCountElement = document.getElementById("pending-count");

const approvedCountElement = document.getElementById("approved-count");

const rejectedCountElement = document.getElementById("rejected-count");

const totalCountElement = document.getElementById("total-count");

const detailLeaveType = document.getElementById("detail-leave-type");

const detailStatus = document.getElementById("detail-status");

const detailStartDate = document.getElementById("detail-start-date");

const detailEndDate = document.getElementById("detail-end-date");

const detailDays = document.getElementById("detail-days");

const detailSubmitted = document.getElementById("detail-submitted");

const detailReason = document.getElementById("detail-reason");

const detailRejectionContainer = document.getElementById(
    "detail-rejection-container",
);

const detailRejectionReason = document.getElementById(
    "detail-rejection-reason",
);

const LEAVES_PER_PAGE = 10;

let leaveRequests = [];

let currentLeavePage = 1;

function openLeaveModal() {
    leaveModal?.classList.remove("hidden");

    leaveModal?.classList.add("flex");
}

function closeLeaveModal() {
    leaveModal?.classList.add("hidden");

    leaveModal?.classList.remove("flex");
}

function closeLeaveDetailsModal() {
    leaveDetailsModal?.classList.add("hidden");

    leaveDetailsModal?.classList.remove("flex");
}

openLeaveButton?.addEventListener("click", openLeaveModal);

closeLeaveButton?.addEventListener("click", closeLeaveModal);

cancelLeaveButton?.addEventListener("click", closeLeaveModal);

leaveModal?.addEventListener("click", (event) => {
    if (event.target === leaveModal) {
        closeLeaveModal();
    }
});

function normalizeStatus(status) {
    return String(status || "")
        .toLowerCase()
        .trim();
}

function formatDate(date) {
    if (!date) {
        return "—";
    }

    return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    });
}

function calculateDays(startDate, endDate) {
    if (!startDate || !endDate) {
        return 0;
    }

    const start = new Date(startDate);

    const end = new Date(endDate);

    return Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
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

function createLeaveRow(leave) {
    const days = calculateDays(leave.start_date, leave.end_date);

    const startDate = formatDate(leave.start_date);

    const endDate = formatDate(leave.end_date);

    const submittedDate = formatDate(leave.created_at);

    const dateDisplay =
        startDate === endDate ? startDate : `${startDate} – ${endDate}`;

    const row = document.createElement("tr");

    row.className = "leave-row transition hover:bg-gray-50";

    row.dataset.search = `
            ${leave.leave_type || ""}
            ${leave.reason || ""}
        `.toLowerCase();

    row.dataset.status = normalizeStatus(leave.status);

    row.innerHTML = `
        <td class="px-4 py-3 text-sm font-medium text-gray-900 text-center">
            <div class="truncate">
                ${leave.leave_type || "—"}
            </div>
        </td>

        <td class="whitespace-nowrap px-4 py-3 text-sm text-gray-700 text-center">
            ${dateDisplay}
        </td>

        <td class="whitespace-nowrap px-4 py-3 text-sm text-gray-700 text-center">
            ${days} ${days === 1 ? "day" : "days"}
        </td>

        <td class="px-4 py-3 text-sm text-gray-700 text-center">
            <div class="truncate">
                ${leave.reason || "—"}
            </div>
        </td>

        <td class="whitespace-nowrap px-4 py-3 text-sm text-gray-500 text-center">
            ${submittedDate}
        </td>

        <td class="whitespace-nowrap px-4 py-3 text-center">
            ${statusBadge(leave.status)}
        </td>

        <td class="whitespace-nowrap px-4 py-3 text-center">
            <button
                type="button"
                class="view-leave-btn rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                data-id="${leave.id}"
            >
                View
            </button>
        </td>
    `;

    return row;
}

function getFilteredLeaves() {
    const searchValue = searchInput?.value.toLowerCase().trim() || "";

    const statusValue = normalizeStatus(statusFilter?.value);

    return leaveRequests.filter((leave) => {
        const searchText = `
                    ${leave.leave_type || ""}
                    ${leave.reason || ""}
                `.toLowerCase();

        const matchesSearch = searchText.includes(searchValue);

        const matchesStatus =
            statusValue === "" || normalizeStatus(leave.status) === statusValue;

        return matchesSearch && matchesStatus;
    });
}

function renderLeaveRequests(page = 1) {
    const filteredLeaves = getFilteredLeaves();

    const totalRequests = filteredLeaves.length;

    const totalPages = Math.ceil(totalRequests / LEAVES_PER_PAGE);

    if (totalPages === 0) {
        currentLeavePage = 1;
    } else if (page > totalPages) {
        currentLeavePage = totalPages;
    } else if (page < 1) {
        currentLeavePage = 1;
    } else {
        currentLeavePage = page;
    }

    const startIndex = (currentLeavePage - 1) * LEAVES_PER_PAGE;

    const endIndex = startIndex + LEAVES_PER_PAGE;

    const pageRequests = filteredLeaves.slice(startIndex, endIndex);

    leaveTableBody.innerHTML = "";

    if (pageRequests.length === 0) {
        noFilteredResults?.classList.remove("hidden");
    } else {
        noFilteredResults?.classList.add("hidden");

        pageRequests.forEach((leave) => {
            leaveTableBody.appendChild(createLeaveRow(leave));
        });
    }

    renderPagination(totalRequests, totalPages);
}

function renderPagination(totalRequests, totalPages) {
    leavePagination.innerHTML = "";

    if (totalRequests <= LEAVES_PER_PAGE) {
        leavePagination.classList.add("hidden");

        return;
    }

    leavePagination.classList.remove("hidden");

    const wrapper = document.createElement("div");

    wrapper.className =
        "flex min-h-[72px] w-full items-center justify-between px-5 py-3";

    const endRecord = Math.min(
        currentLeavePage * LEAVES_PER_PAGE,
        totalRequests,
    );

    const information = document.createElement("p");

    information.className = "text-xs text-gray-500";

    information.innerHTML = `
            Showing
            <span class="font-semibold text-gray-700">
                ${endRecord}
            </span>
            of
            <span class="font-semibold text-gray-700">
                ${totalRequests}
            </span>
            records
        `;

    const controls = document.createElement("div");

    controls.className = "flex items-center gap-1";

    const previousButton = document.createElement("button");

    previousButton.type = "button";

    previousButton.disabled = currentLeavePage <= 1;

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
        renderLeaveRequests(currentLeavePage - 1);
    });

    controls.appendChild(previousButton);

    for (let page = 1; page <= totalPages; page++) {
        const pageButton = document.createElement("button");

        pageButton.type = "button";

        pageButton.textContent = page;

        pageButton.className =
            "inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-2.5 text-xs font-medium transition";

        if (page === currentLeavePage) {
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
            renderLeaveRequests(page);
        });

        controls.appendChild(pageButton);
    }

    const nextButton = document.createElement("button");

    nextButton.type = "button";

    nextButton.disabled = currentLeavePage >= totalPages;

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
        renderLeaveRequests(currentLeavePage + 1);
    });

    controls.appendChild(nextButton);

    wrapper.appendChild(information);

    wrapper.appendChild(controls);

    leavePagination.appendChild(wrapper);
}

function updateCounts() {
    let pending = 0;

    let approved = 0;

    let rejected = 0;

    leaveRequests.forEach((leave) => {
        const status = normalizeStatus(leave.status);

        if (status === "pending") {
            pending++;
        }

        if (status === "approved") {
            approved++;
        }

        if (status === "rejected") {
            rejected++;
        }
    });

    if (pendingCountElement) {
        pendingCountElement.textContent = pending;
    }

    if (approvedCountElement) {
        approvedCountElement.textContent = approved;
    }

    if (rejectedCountElement) {
        rejectedCountElement.textContent = rejected;
    }

    if (totalCountElement) {
        totalCountElement.textContent = leaveRequests.length;
    }
}

async function loadLeaves() {
    try {
        leaveTableBody.innerHTML = `
                <tr>
                    <td
                        colspan="7"
                        class="px-4 py-10 text-center"
                    >
                        <p class="text-sm text-gray-500">
                            Loading leave requests...
                        </p>
                    </td>
                </tr>
            `;

        const response = await fetch("/employee/leave/data", {
            headers: {
                Accept: "application/json",

                "X-Requested-With": "XMLHttpRequest",
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        leaveRequests = data.leaves || [];

        updateCounts();

        renderLeaveRequests(1);
    } catch (error) {
        console.error("LOAD LEAVE ERROR:", error);

        leaveTableBody.innerHTML = `
                <tr>
                    <td
                        colspan="7"
                        class="px-4 py-10 text-center"
                    >
                        <p class="text-sm font-semibold text-red-600">
                            Failed to load leave requests.
                        </p>

                        <p class="mt-1 text-xs text-gray-500">
                            ${error.message}
                        </p>
                    </td>
                </tr>
            `;
    }
}

leaveForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
        const formData = new FormData(leaveForm);

        const response = await fetch(leaveForm.action, {
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
                alert(data?.message || "Unable to submit leave request.");
            }

            return;
        }

        const record = data?.data || data?.leave || data?.leaveRequest;

        if (record) {
            leaveRequests.unshift(record);

            updateCounts();

            renderLeaveRequests(1);
        } else {
            await loadLeaves();
        }

        closeLeaveModal();

        leaveForm.reset();

        if (typeof showToast === "function") {
            showToast(data?.message || "Leave request submitted successfully.");
        }
    } catch (error) {
        console.error("SUBMIT LEAVE ERROR:", error);

        alert("Something went wrong. Please try again.");
    }
});

function openLeaveDetails(leave) {
    if (detailLeaveType) {
        detailLeaveType.textContent = leave.leave_type || "—";
    }

    if (detailStartDate) {
        detailStartDate.textContent = formatDate(leave.start_date);
    }

    if (detailEndDate) {
        detailEndDate.textContent = formatDate(leave.end_date);
    }

    const days = calculateDays(leave.start_date, leave.end_date);

    if (detailDays) {
        detailDays.textContent = `${days} ${days === 1 ? "day" : "days"}`;
    }

    if (detailSubmitted) {
        detailSubmitted.textContent = formatDate(leave.created_at);
    }

    if (detailReason) {
        detailReason.textContent = leave.reason || "—";
    }

    if (detailStatus) {
        detailStatus.innerHTML = statusBadge(leave.status);
    }

    const normalized = normalizeStatus(leave.status);

    if (normalized === "rejected" && leave.rejection_reason) {
        detailRejectionContainer?.classList.remove("hidden");

        if (detailRejectionReason) {
            detailRejectionReason.textContent = leave.rejection_reason;
        }
    } else {
        detailRejectionContainer?.classList.add("hidden");

        if (detailRejectionReason) {
            detailRejectionReason.textContent = "";
        }
    }

    leaveDetailsModal?.classList.remove("hidden");

    leaveDetailsModal?.classList.add("flex");
}

document.addEventListener("click", (event) => {
    const button = event.target.closest(".view-leave-btn");

    if (!button) {
        return;
    }

    const leaveId = Number(button.dataset.id);

    const leave = leaveRequests.find((item) => Number(item.id) === leaveId);

    if (leave) {
        openLeaveDetails(leave);
    }
});

closeLeaveDetailsButton?.addEventListener("click", closeLeaveDetailsModal);

closeLeaveDetailsFooter?.addEventListener("click", closeLeaveDetailsModal);

leaveDetailsModal?.addEventListener("click", (event) => {
    if (event.target === leaveDetailsModal) {
        closeLeaveDetailsModal();
    }
});

searchInput?.addEventListener("input", () => {
    renderLeaveRequests(1);
});

statusFilter?.addEventListener("change", () => {
    renderLeaveRequests(1);
});

document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
        return;
    }

    closeLeaveModal();

    closeLeaveDetailsModal();
});

document.addEventListener("DOMContentLoaded", () => {
    loadLeaves();
});
