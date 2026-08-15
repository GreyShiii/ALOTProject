import { showToast } from "./employees";

document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("overtime-search");
    const statusFilter = document.getElementById("overtime-status-filter");
    const noFilteredRecords = document.getElementById("no-filtered-overtime-records",);

    // Helper function to format dates as "Aug 19, 2026"
    function formatDate(dateString) {
        if (!dateString) return "—";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    }

    function filterOvertime() {
        if (!searchInput) return;

        const searchValue = searchInput.value.toLowerCase().trim();
        const statusValue = statusFilter ? statusFilter.value : "";
        const currentRows = document.querySelectorAll(".overtime-row");
        let visibleRows = 0;

        currentRows.forEach(function (row) {
            const searchText = (row.dataset.search || "").toLowerCase();
            const rowStatus = row.dataset.status || "";
            const matchesSearch = searchText.includes(searchValue);
            const matchesStatus =
                statusValue === "" || rowStatus === statusValue;

            if (matchesSearch && matchesStatus) {
                row.classList.remove("hidden");
                visibleRows++;
            } else {
                row.classList.add("hidden");
            }
        });

        if (noFilteredRecords) {
            noFilteredRecords.classList.toggle(
                "hidden",
                visibleRows !== 0 || currentRows.length === 0,
            );
        }
    }

    if (searchInput) {
        searchInput.addEventListener("input", filterOvertime);
    }

    if (statusFilter) {
        statusFilter.addEventListener("change", filterOvertime);
    }

    // Modal Request Handling
    const requestModal = document.getElementById("overtime-request-modal");
    const openRequestButton = document.getElementById("open-overtime-modal");
    const closeRequestButton = document.getElementById("close-overtime-modal");
    const cancelRequestButton = document.getElementById(
        "cancel-overtime-modal",
    );
    const requestForm = document.getElementById("overtime-request-form");

    function openRequestModal() {
        if (!requestModal) return;
        requestModal.classList.remove("hidden");
        requestModal.classList.add("flex");
    }

    function closeRequestModal() {
        if (!requestModal) return;
        requestModal.classList.add("hidden");
        requestModal.classList.remove("flex");
    }

    if (openRequestButton) {
        openRequestButton.addEventListener("click", openRequestModal);
    }

    if (closeRequestButton) {
        closeRequestButton.addEventListener("click", closeRequestModal);
    }

    if (cancelRequestButton) {
        cancelRequestButton.addEventListener("click", closeRequestModal);
    }

    if (requestModal) {
        requestModal.addEventListener("click", function (event) {
            if (event.target === requestModal) {
                closeRequestModal();
            }
        });
    }

    if (requestForm) {
        requestForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const submitButton = requestForm.querySelector('button[type="submit"]',);
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

                if (response.ok && data && (data.success || data.data)) {
                    showToast(data.message)
                    const record = data.data || data;


                    // 1. Remove empty state rows if present
                    const noRecordsRow = document.getElementById("no-overtime-records");
                    if (noRecordsRow) {
                        noRecordsRow.remove();
                    }

                    // 2. Format values for UI
                    const formattedDate = formatDate(record.date);
                    const formattedSubmitted = formatDate(record.created_at || new Date());
                    const searchableText = `${formattedDate} ${record.hours} ${record.reason || ""}`.toLowerCase();

                    // 3. Build 6-column HTML matching UI design
                    const newRowHtml = `
                        <tr class="overtime-row border-b border-gray-100 hover:bg-gray-50/50 transition"
                            data-search="${searchableText}"
                            data-status="${record.status}">
                            <td class="px-4 py-3 text-sm font-semibold text-gray-900">${formattedDate}</td>
                            <td class="px-4 py-3 text-sm text-gray-600">${record.hours} ${parseFloat(record.hours) === 1 ? 'hour' : 'hours'}</td>
                            <td class="px-4 py-3 text-sm text-gray-600">${record.reason || '—'}</td>
                            <td class="px-4 py-3 text-sm text-gray-600">${formattedSubmitted}</td>
                            <td class="px-4 py-3 text-sm">
                                <span class="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                                    <span class="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                                    ${record.status}
                                </span>
                            </td>
                            <td class="px-4 py-3 text-sm text-right">
                                <button type="button"
                                    class="view-overtime-button rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition"
                                    data-date="${formattedDate}"
                                    data-hours="${record.hours}"
                                    data-reason="${record.reason || ''}"
                                    data-submitted="${formattedSubmitted}"
                                    data-status="${record.status}"
                                    data-rejection-reason="">
                                    View
                                </button>
                            </td>
                        </tr>
                    `;

                    // 4. Insert row into <tbody>
                    const tableBody = document.getElementById("overtime-table-body") || document.querySelector("tbody");
                    if (tableBody) {
                        tableBody.insertAdjacentHTML("afterbegin", newRowHtml);
                    }

                    // 5. Reset form & close modal
                    requestForm.reset();
                    closeRequestModal();

                    // 6. Re-run search/status filter
                    filterOvertime();

                } else if (data && data.errors) {
                    const firstError = Object.values(data.errors)[0];
                    alert(
                        Array.isArray(firstError)
                            ? firstError[0]
                            : "Please check your input.",
                    );
                } else {
                    alert("Unable to submit overtime request.");
                }
            } catch (error) {
                console.error("Overtime request error:", error);
                alert("Something went wrong. Please try again.");
            } finally {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = "Submit Overtime Request";
                }
            }
        });
    }

    // Modal Details Handling (Using Event Delegation)
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
    const detailSubmitted = document.getElementById(
        "detail-overtime-submitted",
    );
    const detailReason = document.getElementById("detail-overtime-reason");
    const rejectionContainer = document.getElementById(
        "detail-overtime-rejection-container",
    );
    const rejectionReason = document.getElementById(
        "detail-overtime-rejection-reason",
    );

    document.addEventListener("click", function (event) {
        const button = event.target.closest(".view-overtime-button");
        if (!button) return;

        const date = button.dataset.date;
        const hours = button.dataset.hours;
        const reason = button.dataset.reason;
        const submitted = button.dataset.submitted;
        const status = button.dataset.status;
        const rejection = button.dataset.rejectionReason;

        if (detailDate) detailDate.textContent = date;

        if (detailHours) {
            detailHours.textContent = `${hours} ${
                parseFloat(hours) === 1 ? "hour" : "hours"
            }`;
        }

        if (detailSubmitted) detailSubmitted.textContent = submitted;
        if (detailReason) detailReason.textContent = reason || "—";

        if (detailStatus) {
            if (status === "Pending") {
                detailStatus.innerHTML = `
                    <span class="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                        <span class="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                        Pending
                    </span>
                `;
            } else if (status === "Approved") {
                detailStatus.innerHTML = `
                    <span class="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                        <span class="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                        Approved
                    </span>
                `;
            } else {
                detailStatus.innerHTML = `
                    <span class="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
                        <span class="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                        Rejected
                    </span>
                `;
            }
        }

        if (rejectionContainer && rejectionReason) {
            if (status === "Rejected" && rejection) {
                rejectionContainer.classList.remove("hidden");
                rejectionReason.textContent = rejection;
            } else {
                rejectionContainer.classList.add("hidden");
                rejectionReason.textContent = "—";
            }
        }

        if (detailsModal) {
            detailsModal.classList.remove("hidden");
            detailsModal.classList.add("flex");
        }
    });

    function closeDetailsModal() {
        if (!detailsModal) return;
        detailsModal.classList.add("hidden");
        detailsModal.classList.remove("flex");
    }

    if (closeDetailsButton) {
        closeDetailsButton.addEventListener("click", closeDetailsModal);
    }

    if (closeDetailsFooterButton) {
        closeDetailsFooterButton.addEventListener("click", closeDetailsModal);
    }

    if (detailsModal) {
        detailsModal.addEventListener("click", function (event) {
            if (event.target === detailsModal) {
                closeDetailsModal();
            }
        });
    }
});
