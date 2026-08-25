const searchInput = document.getElementById("manager-leave-search");

const statusFilter = document.getElementById("manager-leave-status");

const dateFilter = document.getElementById("manager-leave-date");

const tableBody = document.getElementById("manager-leave-table-body");

const cardList = document.getElementById("manager-leave-card-list");

const emptyMessage = document.getElementById("manager-leave-empty");

const paginationContainer = document.getElementById("manager-leave-pagination");

const modal = document.getElementById("manager-leave-modal");

const closeModalButton = document.getElementById("close-manager-leave-modal");

const closeFooterButton = document.getElementById("close-manager-leave-footer");

const approveButton = document.getElementById("approve-leave-btn");

const rejectButton = document.getElementById("reject-leave-btn");

const confirmRejectButton = document.getElementById("confirm-reject-leave-btn");

const cancelRejectButton = document.getElementById("cancel-reject-leave-btn");

const rejectSection = document.getElementById("reject-section");

const rejectionReason = document.getElementById("rejection-reason");

const errorMessage = document.getElementById("manager-leave-error");

const reviewEmployee = document.getElementById("review-employee");

const reviewDepartment = document.getElementById("review-department");

const reviewPosition = document.getElementById("review-position");

const reviewLeaveType = document.getElementById("review-leave-type");

const reviewStartDate = document.getElementById("review-start-date");

const reviewEndDate = document.getElementById("review-end-date");

const reviewSubmitted = document.getElementById("review-submitted");

const reviewStatus = document.getElementById("review-status");

const reviewReason = document.getElementById("review-reason");

const LEAVE_PER_PAGE = 10;

let leaveRequests = [];

let selectedLeave = null;

let currentPage = 1;

async function loadLeaveRequests() {
    try {
        const response = await fetch("/manager/leave/data", {
            headers: {
                Accept: "application/json",
            },
        });

        const data = await response.json();

        if (!response.ok) {
            console.error(data);

            return;
        }

        leaveRequests = data.leaveRequests || [];

        renderLeaveRequests(1);
    } catch (error) {
        console.error("LOAD MANAGER LEAVE ERROR:", error);
    }
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
            <span class="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                <span class="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                Pending
            </span>
        `;
    }

    if (normalized === "approved") {
        return `
            <span class="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                <span class="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                Approved
            </span>
        `;
    }

    return `
        <span class="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
            <span class="h-1.5 w-1.5 rounded-full bg-red-500"></span>
            Rejected
        </span>
    `;
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

function getFilteredRequests() {
    const search = searchInput.value.toLowerCase().trim();

    const status = statusFilter.value.toLowerCase().trim();

    const selectedDate = dateFilter.value;

    return leaveRequests.filter((leave) => {
        const employee = leave.employee;

        const user = employee?.user;

        const employeeName = user ? `${user.first_name} ${user.last_name}` : "";

        const searchableText = `
                    ${employeeName}
                    ${user?.email || ""}
                    ${leave.leave_type || ""}
                    ${leave.reason || ""}
                `.toLowerCase();

        const matchesSearch = search === "" || searchableText.includes(search);

        const matchesStatus =
            status === "" || normalizeStatus(leave.status) === status;

        const matchesDate =
            selectedDate === "" ||
            (selectedDate >= leave.start_date &&
                selectedDate <= leave.end_date);

        return matchesSearch && matchesStatus && matchesDate;
    });
}

function createTableRow(leave) {
    const employee = leave.employee;

    const user = employee?.user;

    const department = employee?.department;

    const employeeName = user
        ? `${user.first_name} ${user.last_name}`
        : "Unknown Employee";

    const startDate = formatDate(leave.start_date);

    const endDate = formatDate(leave.end_date);

    const dateDisplay =
        startDate === endDate ? startDate : `${startDate} – ${endDate}`;

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

        <td class="px-4 py-4 text-center text-sm font-medium text-gray-900">
            ${leave.leave_type || "—"}
        </td>

        <td class="whitespace-nowrap px-4 py-4 text-center text-sm text-gray-700">
            ${dateDisplay}
        </td>

        <td class="whitespace-nowrap px-4 py-4 text-center text-sm text-gray-500">
            ${formatDate(leave.created_at)}
        </td>

        <td class="px-4 py-4 text-center">
            <div class="flex justify-center">
                ${statusBadge(leave.status)}
            </div>
        </td>

        <td class="px-4 py-4 text-center">
            <div class="flex justify-center">
                <button
                    type="button"
                    class="view-manager-leave-btn rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                    data-id="${leave.id}"
                >
                    Review
                </button>
            </div>
        </td>
    `;

    return row;
}

function createMobileCard(leave) {
    const employee = leave.employee;

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
                    ${leave.leave_type || "—"}
                </p>

            </div>

            ${statusBadge(leave.status)}

        </div>


        <div class="mt-3 text-sm">

            <p class="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Date
            </p>

            <p class="text-gray-700">
                ${formatDate(leave.start_date)}
                –
                ${formatDate(leave.end_date)}
            </p>

        </div>


        <button
            type="button"
            class="view-manager-leave-btn mt-4 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
            data-id="${leave.id}"
        >
            Review Request
        </button>
    `;

    return card;
}

function renderLeaveRequests(page = 1) {
    const filtered = getFilteredRequests();

    const totalRequests = filtered.length;

    const totalPages = Math.ceil(totalRequests / LEAVE_PER_PAGE);

    if (totalPages === 0) {
        currentPage = 1;
    } else if (page > totalPages) {
        currentPage = totalPages;
    } else if (page < 1) {
        currentPage = 1;
    } else {
        currentPage = page;
    }

    const startIndex = (currentPage - 1) * LEAVE_PER_PAGE;

    const endIndex = startIndex + LEAVE_PER_PAGE;

    const pageRequests = filtered.slice(startIndex, endIndex);

    tableBody.innerHTML = "";

    cardList.innerHTML = "";

    if (pageRequests.length === 0) {
        emptyMessage.classList.remove("hidden");
    } else {
        emptyMessage.classList.add("hidden");

        pageRequests.forEach((leave) => {
            tableBody.appendChild(createTableRow(leave));

            cardList.appendChild(createMobileCard(leave));
        });
    }

    renderPagination(totalRequests, totalPages);
}

function renderPagination(totalRequests, totalPages) {
    paginationContainer.innerHTML = "";

    if (totalRequests <= LEAVE_PER_PAGE) {
        paginationContainer.classList.add("hidden");

        return;
    }

    paginationContainer.classList.remove("hidden");

    const wrapper = document.createElement("div");

    wrapper.className =
        "flex min-h-[72px] w-full items-center justify-between px-5 py-3";

    const endRecord = Math.min(currentPage * LEAVE_PER_PAGE, totalRequests);

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
        renderLeaveRequests(currentPage - 1);
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
            renderLeaveRequests(page);
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
        renderLeaveRequests(currentPage + 1);
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

function openReviewModal(leave) {
    selectedLeave = leave;

    const employee = leave.employee;

    const user = employee?.user;

    const department = employee?.department;

    reviewEmployee.textContent = user
        ? `${user.first_name} ${user.last_name}`
        : "Unknown Employee";

    reviewDepartment.textContent = department?.name || "—";

    reviewPosition.textContent = employee?.position || "—";

    reviewLeaveType.textContent = leave.leave_type || "—";

    reviewStartDate.textContent = formatDate(leave.start_date);

    reviewEndDate.textContent = formatDate(leave.end_date);

    reviewSubmitted.textContent = formatDate(leave.created_at);

    reviewStatus.innerHTML = statusBadge(leave.status);

    reviewReason.textContent = leave.reason || "No reason provided.";

    resetRejectionMode();

    const isPending = normalizeStatus(leave.status) === "pending";

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

    selectedLeave = null;

    resetRejectionMode();
}

closeModalButton.addEventListener("click", closeReviewModal);

closeFooterButton.addEventListener("click", closeReviewModal);

document.addEventListener("click", (event) => {
    const button = event.target.closest(".view-manager-leave-btn");

    if (!button) {
        return;
    }

    const leaveId = Number(button.dataset.id);

    const leave = leaveRequests.find((item) => Number(item.id) === leaveId);

    if (leave) {
        openReviewModal(leave);
    }
});

approveButton.addEventListener("click", async () => {
    if (!selectedLeave) {
        return;
    }

    try {
        const response = await fetch(
            `/manager/leave/${selectedLeave.id}/approve`,
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

        const index = leaveRequests.findIndex(
            (item) => Number(item.id) === Number(selectedLeave.id),
        );

        if (index !== -1) {
            leaveRequests[index] = data.leaveRequest;
        }

        closeReviewModal();

        renderLeaveRequests(currentPage);
    } catch (error) {
        console.error("APPROVE LEAVE ERROR:", error);
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
    if (!selectedLeave) {
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
            `/manager/leave/${selectedLeave.id}/reject`,
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

        const index = leaveRequests.findIndex(
            (item) => Number(item.id) === Number(selectedLeave.id),
        );

        if (index !== -1) {
            leaveRequests[index] = data.leaveRequest;
        }

        closeReviewModal();

        renderLeaveRequests(currentPage);
    } catch (error) {
        console.error("REJECT LEAVE ERROR:", error);

        errorMessage.textContent =
            "Something went wrong while rejecting the request.";

        errorMessage.classList.remove("hidden");
    } finally {
        confirmRejectButton.disabled = false;

        confirmRejectButton.textContent = "Reject Request";
    }
}

searchInput.addEventListener("input", () => {
    renderLeaveRequests(1);
});

statusFilter.addEventListener("change", () => {
    renderLeaveRequests(1);
});

dateFilter.addEventListener("change", () => {
    renderLeaveRequests(1);
});

loadLeaveRequests();
