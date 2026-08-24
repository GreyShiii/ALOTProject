const leaveSearch =
    document.getElementById("leave-search")

const leaveStatusFilter =
    document.getElementById("leave-status-filter")

const leaveDepartmentFilter =
    document.getElementById("leave-department-filter")

const leaveDateFilter =
    document.getElementById("leave-date-filter")

const leaveTableBody =
    document.getElementById("leave-table-body")

const leaveCardList =
    document.getElementById("leave-card-list")

const noLeaveResults =
    document.getElementById("no-leave-results")

const leavePagination =
    document.getElementById("leave-pagination")

const leaveDetailsModal =
    document.getElementById("leave-details-modal")

const closeLeaveDetails =
    document.getElementById("close-leave-details")

const closeLeaveDetailsFooter =
    document.getElementById("close-leave-details-footer")

const detailEmployee =
    document.getElementById("detail-employee")

const detailDepartment =
    document.getElementById("detail-department")

const detailPosition =
    document.getElementById("detail-position")

const detailLeaveType =
    document.getElementById("detail-leave-type")

const detailStartDate =
    document.getElementById("detail-start-date")

const detailEndDate =
    document.getElementById("detail-end-date")

const detailDays =
    document.getElementById("detail-days")

const detailSubmitted =
    document.getElementById("detail-submitted")

const detailStatus =
    document.getElementById("detail-status")

const detailApprover =
    document.getElementById("detail-approver")

const detailReason =
    document.getElementById("detail-reason")

const detailRejectionContainer =
    document.getElementById("detail-rejection-container")

const detailRejection =
    document.getElementById("detail-rejection")

const LEAVE_PER_PAGE =
    10

let leaveRequests =
    []

let currentLeavePage =
    1


async function loadLeaveRequests() {

    try {

        const response =
            await fetch(
                "/admin/leave/data",
                {
                    headers: {
                        Accept:
                            "application/json",
                    },
                }
            )


        if (
            !response.ok
        ) {

            console.error(
                "LOAD LEAVE REQUESTS ERROR:",
                response.status
            )

            return
        }


        const data =
            await response.json()


        leaveRequests =
            data.leaveRequests || []


        renderLeaveRequests(
            1
        )

    } catch (
        error
    ) {

        console.error(
            "LOAD LEAVE REQUESTS ERROR:",
            error
        )
    }
}


function formatDate(
    date
) {

    if (
        !date
    ) {

        return "N/A"
    }


    return new Date(
        date
    ).toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric",
        }
    )
}


function calculateDays(
    startDate,
    endDate
) {

    if (
        !startDate ||
        !endDate
    ) {

        return 0
    }


    const start =
        new Date(
            startDate
        )

    const end =
        new Date(
            endDate
        )


    return Math.floor(
        (
            end - start
        ) /
            (1000 * 60 * 60 * 24)
    ) + 1
}


function normalizeStatus(
    status
) {

    return String(
        status || ""
    )
        .toLowerCase()
        .trim()
}


function statusBadge(
    status
) {

    const normalized =
        normalizeStatus(
            status
        )


    if (
        normalized ===
        "pending"
    ) {

        return `
            <span class="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                <span class="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                Pending
            </span>
        `
    }


    if (
        normalized ===
        "approved"
    ) {

        return `
            <span class="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                <span class="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                Approved
            </span>
        `
    }


    if (
        normalized ===
        "rejected"
    ) {

        return `
            <span class="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
                <span class="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                Rejected
            </span>
        `
    }


    return `
        <span class="inline-flex items-center whitespace-nowrap rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
            Unknown
        </span>
    `
}


function getFilteredRequests() {

    const search =
        leaveSearch.value
            .toLowerCase()
            .trim()


    const selectedStatus =
        leaveStatusFilter.value
            .toLowerCase()
            .trim()


    const departmentId =
        leaveDepartmentFilter.value


    const selectedDate =
        leaveDateFilter.value


    return leaveRequests.filter(
        (
            leave
        ) => {

            const employee =
                leave.employee

            const user =
                employee?.user

            const department =
                employee?.department


            const employeeName =
                user
                    ? `${user.first_name} ${user.last_name}`
                    : ""


            const searchableText =
                `
                    ${employeeName}
                    ${user?.email || ""}
                    ${employee?.position || ""}
                    ${department?.name || ""}
                    ${leave.leave_type || ""}
                    ${leave.reason || ""}
                `
                    .toLowerCase()


            const matchesSearch =
                search === "" ||
                searchableText.includes(
                    search
                )


            const leaveStatus =
                normalizeStatus(
                    leave.status
                )


            const matchesStatus =
                selectedStatus === "" ||
                leaveStatus ===
                    selectedStatus


            const matchesDepartment =
                departmentId === "" ||
                String(
                    employee?.department_id
                ) ===
                    String(
                        departmentId
                    )


            const matchesDate =
                selectedDate === "" ||
                (
                    selectedDate >=
                        leave.start_date &&
                    selectedDate <=
                        leave.end_date
                )


            return (
                matchesSearch &&
                matchesStatus &&
                matchesDepartment &&
                matchesDate
            )
        }
    )
}


function createTableRow(
    leave
) {

    const employee =
        leave.employee

    const user =
        employee?.user

    const department =
        employee?.department


    const employeeName =
        user
            ? `${user.first_name} ${user.last_name}`
            : "Unknown Employee"


    const startDate =
        formatDate(
            leave.start_date
        )

    const endDate =
        formatDate(
            leave.end_date
        )


    const days =
        calculateDays(
            leave.start_date,
            leave.end_date
        )


    const dateDisplay =
        startDate ===
            endDate
            ? startDate
            : `${startDate} – ${endDate}`


    const row =
        document.createElement(
            "tr"
        )


    row.className =
        "transition hover:bg-gray-50"


    row.innerHTML = `
        <td class="align-middle break-words px-4 py-4">
            <p class="text-sm font-semibold text-gray-900">
                ${employeeName}
            </p>

            <p class="mt-1 break-all text-xs text-gray-500">
                ${user?.email || "—"}
            </p>
        </td>

        <td class="align-middle break-words px-4 py-4 text-sm text-gray-700">
            ${department?.name || "—"}
        </td>

        <td class="align-middle break-words px-4 py-4 text-sm font-medium text-gray-900">
            ${leave.leave_type || "—"}
        </td>

        <td class="align-middle whitespace-nowrap px-4 py-4 text-sm text-gray-700">
            ${dateDisplay}
        </td>

        <td class="align-middle whitespace-nowrap px-4 py-4 text-sm text-gray-700">
            ${days} ${days === 1 ? "day" : "days"}
        </td>

        <td class="align-middle whitespace-nowrap px-4 py-4 text-sm text-gray-500">
            ${formatDate(leave.created_at)}
        </td>

        <td class="align-middle px-4 py-4">
            ${statusBadge(leave.status)}
        </td>

        <td class="align-middle whitespace-nowrap px-4 py-4 text-right">
            <button
                type="button"
                class="view-leave-btn rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 hover:text-slate-900"
                data-id="${leave.id}"
            >
                View
            </button>
        </td>
    `


    return row
}


function createMobileCard(
    leave
) {

    const employee =
        leave.employee

    const user =
        employee?.user

    const department =
        employee?.department


    const employeeName =
        user
            ? `${user.first_name} ${user.last_name}`
            : "Unknown Employee"


    const startDate =
        formatDate(
            leave.start_date
        )

    const endDate =
        formatDate(
            leave.end_date
        )


    const days =
        calculateDays(
            leave.start_date,
            leave.end_date
        )


    const card =
        document.createElement(
            "div"
        )


    card.className =
        "px-4 py-4"


    card.innerHTML = `
        <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
                <p class="truncate text-sm font-semibold text-gray-900">
                    ${employeeName}
                </p>

                <p class="mt-1 truncate text-xs text-gray-500">
                    ${department?.name || "—"}
                </p>
            </div>

            ${statusBadge(leave.status)}
        </div>

        <div class="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div>
                <p class="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Leave Type
                </p>

                <p class="text-gray-700">
                    ${leave.leave_type || "—"}
                </p>
            </div>

            <div>
                <p class="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Days
                </p>

                <p class="text-gray-700">
                    ${days}
                </p>
            </div>

            <div>
                <p class="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Start
                </p>

                <p class="text-gray-700">
                    ${startDate}
                </p>
            </div>

            <div>
                <p class="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    End
                </p>

                <p class="text-gray-700">
                    ${endDate}
                </p>
            </div>
        </div>

        <button
            type="button"
            class="view-leave-btn mt-4 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
            data-id="${leave.id}"
        >
            View Details
        </button>
    `


    return card
}


function renderLeaveRequests(
    page = 1
) {

    const filteredRequests =
        getFilteredRequests()


    const totalRequests =
        filteredRequests.length


    const totalPages =
        Math.ceil(
            totalRequests /
                LEAVE_PER_PAGE
        )


    if (
        totalPages === 0
    ) {

        currentLeavePage =
            1

    } else if (
        page > totalPages
    ) {

        currentLeavePage =
            totalPages

    } else if (
        page < 1
    ) {

        currentLeavePage =
            1

    } else {

        currentLeavePage =
            page
    }


    const startIndex =
        (
            currentLeavePage -
            1
        ) *
            LEAVE_PER_PAGE


    const endIndex =
        startIndex +
        LEAVE_PER_PAGE


    const pageRequests =
        filteredRequests.slice(
            startIndex,
            endIndex
        )


    leaveTableBody.innerHTML =
        ""

    leaveCardList.innerHTML =
        ""


    if (
        pageRequests.length === 0
    ) {

        noLeaveResults.classList.remove(
            "hidden"
        )

    } else {

        noLeaveResults.classList.add(
            "hidden"
        )


        pageRequests.forEach(
            (
                leave
            ) => {

                leaveTableBody.appendChild(
                    createTableRow(
                        leave
                    )
                )

                leaveCardList.appendChild(
                    createMobileCard(
                        leave
                    )
                )
            }
        )
    }


    renderLeavePagination(
        totalRequests,
        totalPages
    )
}


function renderLeavePagination(
    totalRequests,
    totalPages
) {

    leavePagination.innerHTML =
        ""


    if (
        totalRequests <=
        LEAVE_PER_PAGE
    ) {

        leavePagination.classList.add(
            "hidden"
        )

        return
    }


    leavePagination.classList.remove(
        "hidden"
    )


    const wrapper =
        document.createElement(
            "div"
        )


    wrapper.className =
        "flex min-h-[72px] w-full items-center justify-between px-5 py-3"


    const endRecord =
        Math.min(
            currentLeavePage *
                LEAVE_PER_PAGE,
            totalRequests
        )


    const information =
        document.createElement(
            "p"
        )


    information.className =
        "text-xs text-gray-500"


    information.innerHTML =
        `
            Showing
            <span class="font-semibold text-gray-700">
                ${endRecord}
            </span>
            of
            <span class="font-semibold text-gray-700">
                ${totalRequests}
            </span>
            records
        `


    const controls =
        document.createElement(
            "div"
        )


    controls.className =
        "flex items-center gap-1"


    const previousButton =
        document.createElement(
            "button"
        )


    previousButton.type =
        "button"

    previousButton.disabled =
        currentLeavePage <= 1


    previousButton.className =
        "inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-500 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"


    previousButton.innerHTML =
        `
            <span class="text-base leading-none">
                ‹
            </span>

            <span>
                Previous
            </span>
        `


    previousButton.addEventListener(
        "click",
        () => {

            renderLeaveRequests(
                currentLeavePage -
                    1
            )
        }
    )


    controls.appendChild(
        previousButton
    )


    for (
        let page = 1;
        page <= totalPages;
        page++
    ) {

        const pageButton =
            document.createElement(
                "button"
            )


        pageButton.type =
            "button"

        pageButton.textContent =
            page


        pageButton.className =
            "inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-2.5 text-xs font-medium transition"


        if (
            page ===
            currentLeavePage
        ) {

            pageButton.classList.add(
                "border",
                "border-gray-200",
                "bg-gray-100",
                "text-gray-800",
                "shadow-sm"
            )

        } else {

            pageButton.classList.add(
                "text-gray-700",
                "hover:bg-gray-100"
            )
        }


        pageButton.addEventListener(
            "click",
            () => {

                renderLeaveRequests(
                    page
                )
            }
        )


        controls.appendChild(
            pageButton
        )
    }


    const nextButton =
        document.createElement(
            "button"
        )


    nextButton.type =
        "button"

    nextButton.disabled =
        currentLeavePage >=
        totalPages


    nextButton.className =
        "inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"


    nextButton.innerHTML =
        `
            <span>
                Next
            </span>

            <span class="text-base leading-none">
                ›
            </span>
        `


    nextButton.addEventListener(
        "click",
        () => {

            renderLeaveRequests(
                currentLeavePage +
                    1
            )
        }
    )


    controls.appendChild(
        nextButton
    )


    wrapper.appendChild(
        information
    )

    wrapper.appendChild(
        controls
    )


    leavePagination.appendChild(
        wrapper
    )
}


function openLeaveDetails(
    leave
) {

    const employee =
        leave.employee

    const user =
        employee?.user

    const department =
        employee?.department


    const employeeName =
        user
            ? `${user.first_name} ${user.last_name}`
            : "Unknown Employee"


    detailEmployee.textContent =
        employeeName

    detailDepartment.textContent =
        department?.name ||
        "—"

    detailPosition.textContent =
        employee?.position ||
        "—"

    detailLeaveType.textContent =
        leave.leave_type ||
        "—"

    detailStartDate.textContent =
        formatDate(
            leave.start_date
        )

    detailEndDate.textContent =
        formatDate(
            leave.end_date
        )


    const days =
        calculateDays(
            leave.start_date,
            leave.end_date
        )


    detailDays.textContent =
        `${days} ${
            days === 1
                ? "day"
                : "days"
        }`


    detailSubmitted.textContent =
        formatDate(
            leave.created_at
        )


    detailStatus.innerHTML =
        statusBadge(
            leave.status
        )


    if (
        leave.approver
    ) {

        detailApprover.textContent =
            `${leave.approver.first_name} ${leave.approver.last_name}`

    } else {

        detailApprover.textContent =
            "Not reviewed"
    }


    detailReason.textContent =
        leave.reason ||
        "No reason provided."


    const normalizedStatus =
        normalizeStatus(
            leave.status
        )


    if (
        normalizedStatus ===
        "rejected"
    ) {

        detailRejectionContainer.classList.remove(
            "hidden"
        )

        detailRejection.textContent =
            leave.rejection_reason ||
            "No rejection reason provided."

    } else {

        detailRejectionContainer.classList.add(
            "hidden"
        )

        detailRejection.textContent =
            ""
    }


    leaveDetailsModal.classList.remove(
        "hidden"
    )

    leaveDetailsModal.classList.add(
        "flex"
    )
}


function closeDetailsModal() {

    leaveDetailsModal.classList.add(
        "hidden"
    )

    leaveDetailsModal.classList.remove(
        "flex"
    )
}


closeLeaveDetails.addEventListener(
    "click",
    closeDetailsModal
)

closeLeaveDetailsFooter.addEventListener(
    "click",
    closeDetailsModal
)


leaveDetailsModal.addEventListener(
    "click",
    (event) => {

        if (
            event.target ===
            leaveDetailsModal
        ) {

            closeDetailsModal()
        }
    }
)


document.addEventListener(
    "click",
    (event) => {

        const button =
            event.target.closest(
                ".view-leave-btn"
            )


        if (
            !button
        ) {

            return
        }


        const leaveId =
            Number(
                button.dataset.id
            )


        const leave =
            leaveRequests.find(
                (
                    item
                ) =>
                    Number(
                        item.id
                    ) ===
                    leaveId
            )


        if (
            leave
        ) {

            openLeaveDetails(
                leave
            )
        }
    }
)


leaveSearch.addEventListener(
    "input",
    () => {

        renderLeaveRequests(
            1
        )
    }
)

leaveStatusFilter.addEventListener(
    "change",
    () => {

        renderLeaveRequests(
            1
        )
    }
)

leaveDepartmentFilter.addEventListener(
    "change",
    () => {

        renderLeaveRequests(
            1
        )
    }
)

leaveDateFilter.addEventListener(
    "change",
    () => {

        renderLeaveRequests(
            1
        )
    }
)


loadLeaveRequests()
