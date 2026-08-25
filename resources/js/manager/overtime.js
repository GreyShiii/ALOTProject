const searchInput = document.getElementById("manager-overtime-search");

const statusFilter = document.getElementById("manager-overtime-status");

const dateFilter = document.getElementById("manager-overtime-date");

const tableBody = document.getElementById("manager-overtime-table-body");

const cardList = document.getElementById("manager-overtime-card-list");

const emptyMessage = document.getElementById("manager-overtime-empty");

const paginationContainer = document.getElementById(
    "manager-overtime-pagination",
);

const modal = document.getElementById("manager-overtime-modal");

const closeModalButton = document.getElementById(
    "close-manager-overtime-modal",
);

const closeFooterButton = document.getElementById(
    "close-manager-overtime-footer",
);

const approveButton = document.getElementById("approve-overtime-btn");

const rejectButton = document.getElementById("reject-overtime-btn");

const confirmRejectButton = document.getElementById(
    "confirm-reject-overtime-btn",
);

const cancelRejectButton = document.getElementById(
    "cancel-reject-overtime-btn",
);

const rejectSection = document.getElementById("overtime-reject-section");

const rejectionReason = document.getElementById("overtime-rejection-reason");

const errorMessage = document.getElementById("manager-overtime-error");

const reviewEmployee = document.getElementById("review-overtime-employee");

const reviewDepartment = document.getElementById("review-overtime-department");

const reviewPosition = document.getElementById("review-overtime-position");

const reviewDate = document.getElementById("review-overtime-date");

const reviewHours = document.getElementById("review-overtime-hours");

const reviewSubmitted = document.getElementById("review-overtime-submitted");

const reviewStatus = document.getElementById("review-overtime-status");

const reviewReason = document.getElementById("review-overtime-reason");

const OVERTIME_PER_PAGE = 10;

let overtimeRequests = [];

let selectedOvertime = null;

let currentPage = 1;

async function loadOvertimeRequests() {
    try {
        const response = await fetch("/manager/overtime/data", {
            headers: {
                Accept: "application/json",
            },
        });

        const data = await response.json();

        if (!response.ok) {
            console.error(data);

            return;
        }

        overtimeRequests = data.overtimeRequests || [];

        renderOvertimeRequests(1);
    } catch (error) {
        console.error("LOAD MANAGER OVERTIME ERROR:", error);
    }
}

function normalizeStatus(status) {
    return String(status || "")
        .toLowerCase()
        .trim();
}

function formatDate(date) {
    if (!date) {
        return "N/A";
    }

    return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
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

function getFilteredRequests() {
    const search = searchInput.value.toLowerCase().trim();

    const status = statusFilter.value.toLowerCase().trim();

    const selectedDate = dateFilter.value;

    return overtimeRequests.filter((overtime) => {
        const employee = overtime.employee;

        const user = employee?.user;

        const employeeName = user ? `${user.first_name} ${user.last_name}` : "";

        const searchableText = `
                ${employeeName}
                ${user?.email || ""}
                ${employee?.position || ""}
                ${overtime.reason || ""}
            `.toLowerCase();

        const matchesSearch = search === "" || searchableText.includes(search);

        const matchesStatus =
            status === "" || normalizeStatus(overtime.status) === status;

        const overtimeDate = overtime.date
            ? String(overtime.date).substring(0, 10)
            : "";

        const matchesDate =
            selectedDate === "" || selectedDate === overtimeDate;

        return matchesSearch && matchesStatus && matchesDate;
    });
}

function createTableRow(overtime) {
    const employee = overtime.employee;

    const user = employee?.user;

    const employeeName = user
        ? `${user.first_name} ${user.last_name}`
        : "Unknown Employee";

    const row = document.createElement("tr");

    row.className = "transition hover:bg-gray-50";

    row.innerHTML = `
        <td class="px-4 py-4 text-center">
            <div>
                <p class="text-sm font-semibold text-gray-900">
                    ${employeeName}
                </p>

                <p class="mt-1 text-xs text-gray-500">
                    ${user?.email || "—"}
                </p>
            </div>
        </td>

        <td class="whitespace-nowrap px-4 py-4 text-center text-sm text-gray-700">
            ${formatDate(overtime.date)}
        </td>

        <td class="whitespace-nowrap px-4 py-4 text-center text-sm font-medium text-gray-900">
            ${overtime.hours} hrs
        </td>

        <td class="px-4 py-4 text-center text-sm text-gray-700">
            <div class="truncate">
                ${overtime.reason || "—"}
            </div>
        </td>

        <td class="px-4 py-4 text-center">
            <div class="flex justify-center">
                ${statusBadge(overtime.status)}
            </div>
        </td>

        <td class="px-4 py-4 text-center">
            <div class="flex justify-center">
                <button
                    type="button"
                    class="view-manager-overtime-btn rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                    data-id="${overtime.id}"
                >
                    Review
                </button>
            </div>
        </td>
    `;

    return row;
}

function createMobileCard(overtime) {
    const employee = overtime.employee;

    const user = employee?.user;

    const employeeName = user
        ? `${user.first_name} ${user.last_name}`
        : "Unknown Employee";

    const card = document.createElement("div");

    card.className = "px-4 py-4";

    card.innerHTML = `
        <div class="flex items-start justify-between gap-3">

            <div class="min-w-0">

                <p class="truncate text-sm font-semibold text-gray-900">
                    ${employeeName}
                </p>

                <p class="mt-1 text-xs text-gray-500">
                    ${formatDate(overtime.date)}
                </p>

            </div>

            ${statusBadge(overtime.status)}

        </div>

        <div class="mt-3 grid grid-cols-2 gap-4">

            <div>

                <p class="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Hours
                </p>

                <p class="text-sm text-gray-700">
                    ${overtime.hours} hrs
                </p>

            </div>

            <div>

                <p class="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Reason
                </p>

                <p class="truncate text-sm text-gray-700">
                    ${overtime.reason || "—"}
                </p>

            </div>

        </div>

        <button
            type="button"
            class="view-manager-overtime-btn mt-4 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
            data-id="${overtime.id}"
        >
            Review Request
        </button>
    `;

    return card;
}

function renderOvertimeRequests(page = 1) {
    const filtered = getFilteredRequests();

    const totalRequests = filtered.length;

    const totalPages = Math.ceil(totalRequests / OVERTIME_PER_PAGE);

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

    const pageRequests = filtered.slice(startIndex, endIndex);

    tableBody.innerHTML = "";

    cardList.innerHTML = "";

    if (pageRequests.length === 0) {
        emptyMessage.classList.remove("hidden");
    } else {
        emptyMessage.classList.add("hidden");

        pageRequests.forEach((overtime) => {
            tableBody.appendChild(createTableRow(overtime));

            cardList.appendChild(createMobileCard(overtime));
        });
    }

    renderPagination(totalRequests, totalPages);
}

function renderPagination(totalRequests, totalPages) {
    paginationContainer.innerHTML = "";

    if (totalRequests <= OVERTIME_PER_PAGE) {
        paginationContainer.classList.add("hidden");

        return;
    }

    paginationContainer.classList.remove("hidden");

    const wrapper = document.createElement("div");

    wrapper.className =
        "flex min-h-[72px] w-full items-center justify-between px-5 py-3";

    const endRecord = Math.min(currentPage * OVERTIME_PER_PAGE, totalRequests);

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
        renderOvertimeRequests(currentPage - 1);
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
            renderOvertimeRequests(page);
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
        renderOvertimeRequests(currentPage + 1);
    });

    controls.appendChild(nextButton);

    wrapper.appendChild(information);

    wrapper.appendChild(controls);

    paginationContainer.appendChild(wrapper);
}

function resetRejectionMode() {
    rejectSection.classList.add("hidden");

    approveButton.classList.remove("hidden");

    rejectButton.classList.remove("hidden");

    confirmRejectButton.classList.add("hidden");

    cancelRejectButton.classList.add("hidden");

    rejectionReason.value = "";

    errorMessage.textContent = "";

    errorMessage.classList.add("hidden");
}

function openReviewModal(overtime) {
    selectedOvertime = overtime;

    const employee = overtime.employee;

    const user = employee?.user;

    const department = employee?.department;

    reviewEmployee.textContent = user
        ? `${user.first_name} ${user.last_name}`
        : "Unknown Employee";

    reviewDepartment.textContent = department?.name || "—";

    reviewPosition.textContent = employee?.position || "—";

    reviewDate.textContent = formatDate(overtime.date);

    reviewHours.textContent = `${overtime.hours} hours`;

    reviewSubmitted.textContent = formatDate(overtime.created_at);

    reviewStatus.innerHTML = statusBadge(overtime.status);

    reviewReason.textContent = overtime.reason || "No reason provided.";

    resetRejectionMode();

    const isPending = normalizeStatus(overtime.status) === "pending";

    if (!isPending) {
        approveButton.classList.add("hidden");

        rejectButton.classList.add("hidden");
    }

    modal.classList.remove("hidden");

    modal.classList.add("flex");
}

function closeReviewModal() {
    modal.classList.add("hidden");

    modal.classList.remove("flex");

    selectedOvertime = null;

    resetRejectionMode();
}

closeModalButton.addEventListener("click", closeReviewModal);

closeFooterButton.addEventListener("click", closeReviewModal);

document.addEventListener("click", (event) => {
    const button = event.target.closest(".view-manager-overtime-btn");

    if (!button) {
        return;
    }

    const overtimeId = Number(button.dataset.id);

    const overtime = overtimeRequests.find(
        (item) => Number(item.id) === overtimeId,
    );

    if (overtime) {
        openReviewModal(overtime);
    }
});

approveButton.addEventListener("click", async () => {
    if (!selectedOvertime) {
        return;
    }

    approveButton.disabled = true;

    approveButton.textContent = "Approving...";

    try {
        const response = await fetch(
            `/manager/overtime/${selectedOvertime.id}/approve`,
            {
                method: "POST",

                headers: {
                    Accept: "application/json",

                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                },
            },
        );

        const data = await response.json();

        if (!response.ok) {
            errorMessage.textContent =
                data.message || "Unable to approve request.";

            errorMessage.classList.remove("hidden");

            return;
        }

        const index = overtimeRequests.findIndex(
            (item) => Number(item.id) === Number(selectedOvertime.id),
        );

        if (index !== -1) {
            overtimeRequests[index] = data.overtimeRequest;
        }

        closeReviewModal();

        renderOvertimeRequests(currentPage);
    } catch (error) {
        console.error("APPROVE OVERTIME ERROR:", error);
    } finally {
        approveButton.disabled = false;

        approveButton.textContent = "Approve";
    }
});

rejectButton.addEventListener("click", () => {
    rejectSection.classList.remove("hidden");

    approveButton.classList.add("hidden");

    rejectButton.classList.add("hidden");

    confirmRejectButton.classList.remove("hidden");

    cancelRejectButton.classList.remove("hidden");

    errorMessage.textContent = "";

    errorMessage.classList.add("hidden");

    rejectionReason.focus();
});

cancelRejectButton.addEventListener("click", () => {
    resetRejectionMode();
});

confirmRejectButton.addEventListener("click", submitRejection);

rejectionReason.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && event.ctrlKey) {
        event.preventDefault();

        submitRejection();
    }
});

async function submitRejection() {
    if (!selectedOvertime) {
        return;
    }

    const reason = rejectionReason.value.trim();

    if (reason === "") {
        errorMessage.textContent = "Please provide a rejection reason.";

        errorMessage.classList.remove("hidden");

        rejectionReason.focus();

        return;
    }

    confirmRejectButton.disabled = true;

    confirmRejectButton.textContent = "Rejecting...";

    try {
        const response = await fetch(
            `/manager/overtime/${selectedOvertime.id}/reject`,
            {
                method: "POST",

                headers: {
                    Accept: "application/json",

                    "Content-Type": "application/json",

                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                },

                body: JSON.stringify({
                    rejection_reason: reason,
                }),
            },
        );

        const data = await response.json();

        if (!response.ok) {
            if (data.errors) {
                const firstError = Object.values(data.errors)[0];

                errorMessage.textContent =
                    firstError?.[0] || "Unable to reject request.";
            } else {
                errorMessage.textContent =
                    data.message || "Unable to reject request.";
            }

            errorMessage.classList.remove("hidden");

            return;
        }

        const index = overtimeRequests.findIndex(
            (item) => Number(item.id) === Number(selectedOvertime.id),
        );

        if (index !== -1) {
            overtimeRequests[index] = data.overtimeRequest;
        }

        closeReviewModal();

        renderOvertimeRequests(currentPage);
    } catch (error) {
        console.error("REJECT OVERTIME ERROR:", error);

        errorMessage.textContent =
            "Something went wrong while rejecting the request.";

        errorMessage.classList.remove("hidden");
    } finally {
        confirmRejectButton.disabled = false;

        confirmRejectButton.textContent = "Reject Request";
    }
}

searchInput.addEventListener("input", () => {
    renderOvertimeRequests(1);
});

statusFilter.addEventListener("change", () => {
    renderOvertimeRequests(1);
});

dateFilter.addEventListener("change", () => {
    renderOvertimeRequests(1);
});

loadOvertimeRequests();
