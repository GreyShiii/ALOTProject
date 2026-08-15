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

// =====================================================
// LEAVE REQUEST MODAL
// =====================================================

openLeaveButton?.addEventListener("click", () => {
    leaveModal?.classList.remove("hidden");
    leaveModal?.classList.add("flex");
});

const closeLeaveModal = () => {
    leaveModal?.classList.add("hidden");
    leaveModal?.classList.remove("flex");
};

closeLeaveButton?.addEventListener("click", closeLeaveModal);
cancelLeaveButton?.addEventListener("click", closeLeaveModal);

leaveModal?.addEventListener("click", (event) => {
    if (event.target === leaveModal) {
        closeLeaveModal();
    }
});

// =====================================================
// STATUS BADGE
// =====================================================

const updateStatusBadge = (element, status) => {
    if (!element) return;

    if (status === "Pending") {
        element.innerHTML = `
            <span class="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                <span class="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                Pending
            </span>
        `;
    } else if (status === "Approved") {
        element.innerHTML = `
            <span class="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                <span class="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                Approved
            </span>
        `;
    } else {
        element.innerHTML = `
            <span class="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
                <span class="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                Rejected
            </span>
        `;
    }
};

// =====================================================
// CREATE LEAVE ROW
// =====================================================

const createLeaveRow = (leave) => {
    const startDate = new Date(leave.start_date);
    const endDate = new Date(leave.end_date);
    const submittedDate = new Date(leave.created_at);

    const days = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

    const formattedStartDate = startDate.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    });

    const formattedEndDate = endDate.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    });

    const formattedSubmittedDate = submittedDate.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    });

    let dateDisplay = formattedStartDate;

    if (formattedStartDate !== formattedEndDate) {
        dateDisplay = `${formattedStartDate} &ndash; ${formattedEndDate}`;
    }

    let statusBadge = "";

    if (leave.status === "Pending") {
        statusBadge = `
            <span class="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                <span class="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                Pending
            </span>
        `;
    } else if (leave.status === "Approved") {
        statusBadge = `
            <span class="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                <span class="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                Approved
            </span>
        `;
    } else {
        statusBadge = `
            <span class="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
                <span class="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                Rejected
            </span>
        `;
    }

    const row = document.createElement("tr");

    row.className = "leave-row";
    row.dataset.search = `${leave.leave_type} ${
        leave.reason || ""
    }`.toLowerCase();
    row.dataset.status = leave.status;

    row.innerHTML = `
        <td class="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
            ${leave.leave_type}
        </td>

        <td class="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
            ${dateDisplay}
        </td>

        <td class="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
            ${days} ${days === 1 ? "day" : "days"}
        </td>

        <td class="max-w-xs px-4 py-3 text-sm text-gray-700">
            ${leave.reason || "—"}
        </td>

        <td class="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
            ${formattedSubmittedDate}
        </td>

        <td class="whitespace-nowrap px-4 py-3">
            ${statusBadge}
        </td>

        <td class="whitespace-nowrap px-4 py-3 text-right">
            <button
                type="button"
                class="view-leave-btn rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                data-leave-type="${leave.leave_type}"
                data-start-date="${formattedStartDate}"
                data-end-date="${formattedEndDate}"
                data-days="${days}"
                data-reason="${leave.reason || "—"}"
                data-submitted="${formattedSubmittedDate}"
                data-status="${leave.status}"
                data-rejection-reason="${leave.rejection_reason || ""}"
            >
                View
            </button>
        </td>
    `;

    return row;
};

// =====================================================
// LOAD LEAVES
// =====================================================

async function loadLeaves() {
    if (!leaveTableBody) return;

    leaveTableBody.innerHTML = `
        <tr>
            <td colspan="7" class="px-4 py-10 text-center">
                <p class="text-sm text-gray-500">
                    Loading leave requests...
                </p>
            </td>
        </tr>
    `;

    try {
        const response = await fetch("/employee/leave/data");

        if (!response.ok) {
            throw new Error(`HTTP Response status error: ${response.status}`);
        }

        const data = await response.json();

        console.log("Leave data:", data);

        if (pendingCountElement) {
            pendingCountElement.textContent = data.pendingCount ?? 0;
        }

        if (approvedCountElement) {
            approvedCountElement.textContent = data.approvedCount ?? 0;
        }

        if (rejectedCountElement) {
            rejectedCountElement.textContent = data.rejectedCount ?? 0;
        }

        if (totalCountElement) {
            totalCountElement.textContent = data.totalCount ?? 0;
        }

        leaveTableBody.innerHTML = "";

        if (!data.leaves || data.leaves.length === 0) {
            leaveTableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="px-4 py-10 text-center">
                        <p class="text-sm font-semibold text-gray-700">
                            No leave requests found.
                        </p>

                        <p class="mt-1 text-xs text-gray-500">
                            You have not submitted any leave requests yet.
                        </p>
                    </td>
                </tr>
            `;

            return;
        }

        data.leaves.forEach((leave) => {
            const row = createLeaveRow(leave);

            leaveTableBody.appendChild(row);
        });

        attachViewButtons();
        filterLeaves();
    } catch (error) {
        leaveTableBody.innerHTML = `
            <tr>
                <td colspan="7" class="px-4 py-10 text-center">
                    <p class="text-sm font-semibold text-red-600">
                        Failed to load leave requests.
                    </p>

                    <p class="mt-1 text-xs text-gray-500">
                        ${error.message}
                    </p>
                </td>
            </tr>
        `;

        console.error("Error:", error);
    }
}

// =====================================================
// SUBMIT LEAVE REQUEST
// =====================================================

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

        console.log("Response:", data);

        if (response.ok && data && (data.success || data.data)) {
            const record = data.data || data;

            showToast(data.message)

            // Remove empty-state row
            const noRecordsRow = leaveTableBody?.querySelector("tr");

            if (
                noRecordsRow &&
                noRecordsRow.textContent.includes("No leave requests found.")
            ) {
                noRecordsRow.remove();
            }

            // Create the new leave row
            const newRow = createLeaveRow(record);

            // Add it to the beginning of the table
            leaveTableBody?.prepend(newRow);

            // Update summary counts
            if (pendingCountElement) {
                pendingCountElement.textContent =
                    Number(pendingCountElement.textContent) + 1;
            }

            if (totalCountElement) {
                totalCountElement.textContent =
                    Number(totalCountElement.textContent) + 1;
            }

            // Add View button event to the new row
            const viewButton = newRow.querySelector(".view-leave-btn");

            if (viewButton) {
                viewButton.addEventListener("click", () => {
                    openLeaveDetails(viewButton);
                });
            }

            // Apply current filters
            filterLeaves();

            // Reset and close form
            closeLeaveModal();
            leaveForm.reset();
        }

        else if (data && data.errors) {
            const firstError = Object.values(data.errors)[0];

            alert(
                Array.isArray(firstError)
                    ? firstError[0]
                    : "Please check your input.",
            );
        }

        else {
            alert("Unable to submit leave request.");
        }
    } catch (error) {
        console.error("Leave request error:", error);
        alert("Something went wrong. Please try again.");
    }
});

const openLeaveDetails = (button) => {
    const status = button.dataset.status;
    const rejectionReason = button.dataset.rejectionReason || "";

    if (detailLeaveType) {
        detailLeaveType.textContent = button.dataset.leaveType || "—";
    }

    if (detailStartDate) {
        detailStartDate.textContent = button.dataset.startDate || "—";
    }

    if (detailEndDate) {
        detailEndDate.textContent = button.dataset.endDate || "—";
    }

    const days = button.dataset.days || "—";

    if (detailDays) {
        detailDays.textContent = `${days} ${days == 1 ? "day" : "days"}`;
    }

    if (detailSubmitted) {
        detailSubmitted.textContent = button.dataset.submitted || "—";
    }

    if (detailReason) {
        detailReason.textContent = button.dataset.reason || "—";
    }

    updateStatusBadge(detailStatus, status);

    if (status === "Rejected" && rejectionReason.trim() !== "") {
        detailRejectionContainer?.classList.remove("hidden");

        if (detailRejectionReason) {
            detailRejectionReason.textContent = rejectionReason;
        }
    } else {
        detailRejectionContainer?.classList.add("hidden");

        if (detailRejectionReason) {
            detailRejectionReason.textContent = "";
        }
    }

    leaveDetailsModal?.classList.remove("hidden");
    leaveDetailsModal?.classList.add("flex");
};

const attachViewButtons = () => {
    document.querySelectorAll(".view-leave-btn").forEach((button) => {
        button.addEventListener("click", () => {
            openLeaveDetails(button);
        });
    });
};

const closeLeaveDetailsModal = () => {
    leaveDetailsModal?.classList.add("hidden");
    leaveDetailsModal?.classList.remove("flex");
};

closeLeaveDetailsButton?.addEventListener("click", closeLeaveDetailsModal);

closeLeaveDetailsFooter?.addEventListener("click", closeLeaveDetailsModal);

leaveDetailsModal?.addEventListener("click", (event) => {
    if (event.target === leaveDetailsModal) {
        closeLeaveDetailsModal();
    }
});
const filterLeaves = () => {
    const searchValue = searchInput?.value.toLowerCase().trim() || "";

    const statusValue = statusFilter?.value.toLowerCase().trim() || "";

    const leaveRows = document.querySelectorAll(".leave-row");

    let visibleRows = 0;

    leaveRows.forEach((row) => {
        const searchText = (
            row.dataset.search || row.textContent
        ).toLowerCase();

        const rowStatus = (row.dataset.status || "").toLowerCase();

        const matchesSearch = searchText.includes(searchValue);

        const matchesStatus = statusValue === "" || rowStatus === statusValue;

        if (matchesSearch && matchesStatus) {
            row.classList.remove("hidden");
            visibleRows++;
        } else {
            row.classList.add("hidden");
        }
    });

    if (noFilteredResults) {
        noFilteredResults.classList.toggle("hidden", visibleRows !== 0);
    }
};

searchInput?.addEventListener("input", filterLeaves);
statusFilter?.addEventListener("change", filterLeaves);

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
