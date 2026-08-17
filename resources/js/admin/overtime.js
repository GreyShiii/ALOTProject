const searchInput =
    document.getElementById(
        "admin-overtime-search",
    )

const statusFilter =
    document.getElementById(
        "admin-overtime-status",
    )

const departmentFilter =
    document.getElementById(
        "admin-overtime-department",
    )

const dateFilter =
    document.getElementById(
        "admin-overtime-date",
    )


const tableBody =
    document.getElementById(
        "admin-overtime-table-body",
    )

const cardList =
    document.getElementById(
        "admin-overtime-card-list",
    )

const emptyMessage =
    document.getElementById(
        "admin-overtime-empty",
    )


const modal =
    document.getElementById(
        "admin-overtime-modal",
    )

const closeModalButton =
    document.getElementById(
        "close-admin-overtime-modal",
    )

const closeFooterButton =
    document.getElementById(
        "close-admin-overtime-footer",
    )


const detailEmployee =
    document.getElementById(
        "admin-detail-employee",
    )

const detailDepartment =
    document.getElementById(
        "admin-detail-department",
    )

const detailPosition =
    document.getElementById(
        "admin-detail-position",
    )

const detailDate =
    document.getElementById(
        "admin-detail-date",
    )

const detailHours =
    document.getElementById(
        "admin-detail-hours",
    )

const detailSubmitted =
    document.getElementById(
        "admin-detail-submitted",
    )

const detailStatus =
    document.getElementById(
        "admin-detail-status",
    )

const detailApprover =
    document.getElementById(
        "admin-detail-approver",
    )

const detailReason =
    document.getElementById(
        "admin-detail-reason",
    )

const detailRejectionContainer =
    document.getElementById(
        "admin-detail-rejection-container",
    )

const detailRejection =
    document.getElementById(
        "admin-detail-rejection",
    )


let overtimeRequests = []


// =====================================================
// LOAD DATA
// =====================================================

async function loadOvertimeRequests() {

    try {

        const response =
            await fetch(
                "/admin/overtime/data",
                {
                    headers: {
                        Accept:
                            "application/json",
                    },
                },
            )


        const data =
            await response.json()


        if (!response.ok) {

            console.error(data)

            return
        }


        overtimeRequests =
            data.overtimeRequests || []


        searchInput.value = ""

        statusFilter.value = ""

        departmentFilter.value = ""

        dateFilter.value = ""


        renderOvertimeRequests()

    } catch (error) {

        console.error(
            "LOAD ADMIN OVERTIME ERROR:",
            error,
        )
    }
}


// =====================================================
// HELPERS
// =====================================================

function normalizeStatus(status) {

    return String(
        status || "",
    )
        .toLowerCase()
        .trim()
}


function formatDate(date) {

    if (!date) {
        return "N/A"
    }


    return new Date(date)
        .toLocaleDateString(
            "en-US",
            {
                month: "short",
                day: "numeric",
                year: "numeric",
            },
        )
}


function statusBadge(status) {

    const normalized =
        normalizeStatus(status)


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


// =====================================================
// FILTER
// =====================================================

function getFilteredRequests() {

    const search =
        searchInput.value
            .toLowerCase()
            .trim()


    const status =
        statusFilter.value
            .toLowerCase()
            .trim()


    const departmentId =
        departmentFilter.value


    const selectedDate =
        dateFilter.value


    return overtimeRequests.filter(
        (overtime) => {

            const employee =
                overtime.employee

            const user =
                employee?.user

            const department =
                employee?.department


            const employeeName =
                user
                    ? `${user.first_name} ${user.last_name}`
                    : ""


            const searchableText = `
                ${employeeName}
                ${user?.email || ""}
                ${employee?.position || ""}
                ${department?.name || ""}
                ${overtime.reason || ""}
            `.toLowerCase()


            const matchesSearch =
                search === "" ||
                searchableText.includes(
                    search,
                )


            const matchesStatus =
                status === "" ||
                normalizeStatus(
                    overtime.status,
                ) === status


            const matchesDepartment =
                departmentId === "" ||
                String(
                    employee?.department_id,
                ) ===
                    String(
                        departmentId,
                    )


            const matchesDate =
                selectedDate === "" ||
                selectedDate ===
                    overtime.date


            return (
                matchesSearch &&
                matchesStatus &&
                matchesDepartment &&
                matchesDate
            )
        },
    )
}


// =====================================================
// DESKTOP ROW
// =====================================================

function createTableRow(
    overtime,
) {

    const employee =
        overtime.employee

    const user =
        employee?.user

    const department =
        employee?.department


    const employeeName =
        user
            ? `${user.first_name} ${user.last_name}`
            : "Unknown Employee"


    const row =
        document.createElement(
            "tr",
        )


    row.className =
        "transition hover:bg-gray-50"


    row.innerHTML = `
        <td class="align-middle px-4 py-4 break-words">

            <div>

                <p class="text-sm font-semibold text-gray-900">
                    ${employeeName}
                </p>

                <p class="mt-1 break-all text-xs text-gray-500">
                    ${user?.email || "—"}
                </p>

            </div>

        </td>


        <td class="align-middle px-4 py-4 break-words text-sm text-gray-700">
            ${department?.name || "—"}
        </td>


        <td class="align-middle whitespace-nowrap px-4 py-4 text-sm text-gray-700">
            ${formatDate(overtime.date)}
        </td>


        <td class="align-middle whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-900">
            ${overtime.hours} hrs
        </td>


        <td class="align-middle px-4 py-4">
            ${statusBadge(overtime.status)}
        </td>


        <td class="align-middle whitespace-nowrap px-4 py-4 text-right">

            <button
                type="button"
                class="view-admin-overtime-btn rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 hover:text-slate-900"
                data-id="${overtime.id}"
            >
                View
            </button>

        </td>
    `


    return row
}


// =====================================================
// MOBILE CARD
// =====================================================

function createMobileCard(
    overtime,
) {

    const employee =
        overtime.employee

    const user =
        employee?.user

    const department =
        employee?.department


    const employeeName =
        user
            ? `${user.first_name} ${user.last_name}`
            : "Unknown Employee"


    const card =
        document.createElement(
            "div",
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


            ${statusBadge(overtime.status)}

        </div>


        <div class="mt-3 grid grid-cols-2 gap-4">

            <div>

                <p class="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Date
                </p>

                <p class="text-gray-700">
                    ${formatDate(overtime.date)}
                </p>

            </div>


            <div>

                <p class="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Hours
                </p>

                <p class="text-gray-700">
                    ${overtime.hours} hrs
                </p>

            </div>

        </div>


        <button
            type="button"
            class="view-admin-overtime-btn mt-4 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
            data-id="${overtime.id}"
        >
            View Details
        </button>
    `


    return card
}


// =====================================================
// RENDER
// =====================================================

function renderOvertimeRequests() {

    const filtered =
        getFilteredRequests()


    tableBody.innerHTML = ""

    cardList.innerHTML = ""


    if (
        filtered.length === 0
    ) {

        emptyMessage.classList.remove(
            "hidden",
        )

        return
    }


    emptyMessage.classList.add(
        "hidden",
    )


    filtered.forEach(
        (overtime) => {

            tableBody.appendChild(
                createTableRow(
                    overtime,
                ),
            )


            cardList.appendChild(
                createMobileCard(
                    overtime,
                ),
            )
        },
    )
}


// =====================================================
// OPEN DETAILS MODAL
// =====================================================

function openOvertimeDetails(
    overtime,
) {

    const employee =
        overtime.employee

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


    detailDate.textContent =
        formatDate(
            overtime.date,
        )


    detailHours.textContent =
        `${overtime.hours} hours`


    detailSubmitted.textContent =
        formatDate(
            overtime.created_at,
        )


    detailStatus.innerHTML =
        statusBadge(
            overtime.status,
        )


    if (
        overtime.approver
    ) {

        detailApprover.textContent =
            `${overtime.approver.first_name} ${overtime.approver.last_name}`

    } else {

        detailApprover.textContent =
            "Not reviewed"
    }


    detailReason.textContent =
        overtime.reason ||
        "No reason provided."


    const normalizedStatus =
        normalizeStatus(
            overtime.status,
        )


    if (
        normalizedStatus ===
        "rejected"
    ) {

        detailRejectionContainer.classList.remove(
            "hidden",
        )


        detailRejection.textContent =
            overtime.rejection_reason ||
            "No rejection reason provided."

    } else {

        detailRejectionContainer.classList.add(
            "hidden",
        )


        detailRejection.textContent =
            ""
    }


    modal.classList.remove(
        "hidden",
    )


    modal.classList.add(
        "flex",
    )
}


// =====================================================
// CLOSE MODAL
// =====================================================

function closeOvertimeDetails() {

    modal.classList.add(
        "hidden",
    )


    modal.classList.remove(
        "flex",
    )
}


closeModalButton.addEventListener(
    "click",
    closeOvertimeDetails,
)


closeFooterButton.addEventListener(
    "click",
    closeOvertimeDetails,
)


modal.addEventListener(
    "click",
    (event) => {

        if (
            event.target ===
            modal
        ) {

            closeOvertimeDetails()
        }

    },
)


// =====================================================
// VIEW BUTTONS
// =====================================================

document.addEventListener(
    "click",
    (event) => {

        const button =
            event.target.closest(
                ".view-admin-overtime-btn",
            )


        if (!button) {
            return
        }


        const overtimeId =
            Number(
                button.dataset.id,
            )


        const overtime =
            overtimeRequests.find(
                (item) =>
                    Number(item.id) ===
                    overtimeId,
            )


        if (overtime) {

            openOvertimeDetails(
                overtime,
            )
        }
    },
)


// =====================================================
// FILTER EVENTS
// =====================================================

searchInput.addEventListener(
    "input",
    renderOvertimeRequests,
)

statusFilter.addEventListener(
    "change",
    renderOvertimeRequests,
)

departmentFilter.addEventListener(
    "change",
    renderOvertimeRequests,
)

dateFilter.addEventListener(
    "change",
    renderOvertimeRequests,
)


// =====================================================
// INITIAL LOAD
// =====================================================

loadOvertimeRequests()
