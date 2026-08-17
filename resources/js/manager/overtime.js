const searchInput =
    document.getElementById("manager-overtime-search")

const statusFilter =
    document.getElementById("manager-overtime-status")

const dateFilter =
    document.getElementById("manager-overtime-date")

const tableBody =
    document.getElementById("manager-overtime-table-body")

const cardList =
    document.getElementById("manager-overtime-card-list")

const emptyMessage =
    document.getElementById("manager-overtime-empty")


const modal =
    document.getElementById("manager-overtime-modal")

const closeModalButton =
    document.getElementById("close-manager-overtime-modal")

const closeFooterButton =
    document.getElementById("close-manager-overtime-footer")


const approveButton =
    document.getElementById("approve-overtime-btn")

const rejectButton =
    document.getElementById("reject-overtime-btn")

const rejectSection =
    document.getElementById("overtime-reject-section")

const rejectionReason =
    document.getElementById("overtime-rejection-reason")

const errorMessage =
    document.getElementById("manager-overtime-error")


const reviewEmployee =
    document.getElementById("review-overtime-employee")

const reviewDepartment =
    document.getElementById("review-overtime-department")

const reviewPosition =
    document.getElementById("review-overtime-position")

const reviewDate =
    document.getElementById("review-overtime-date")

const reviewHours =
    document.getElementById("review-overtime-hours")

const reviewSubmitted =
    document.getElementById("review-overtime-submitted")

const reviewStatus =
    document.getElementById("review-overtime-status")

const reviewReason =
    document.getElementById("review-overtime-reason")


let overtimeRequests = []
let selectedOvertime = null


// =====================================================
// LOAD
// =====================================================

async function loadOvertimeRequests() {
    try {
        const response = await fetch(
            "/manager/overtime/data",
            {
                headers: {
                    Accept: "application/json",
                },
            },
        )

        const data = await response.json()

        if (!response.ok) {
            console.error(data)
            return
        }

        overtimeRequests =
            data.overtimeRequests || []

        renderOvertimeRequests()

    } catch (error) {
        console.error(
            "LOAD MANAGER OVERTIME ERROR:",
            error,
        )
    }
}


// =====================================================
// HELPERS
// =====================================================

function normalizeStatus(status) {
    return String(status || "")
        .toLowerCase()
        .trim()
}


function formatDate(date) {
    if (!date) {
        return "N/A"
    }

    return new Date(date)
        .toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        })
}


function statusBadge(status) {
    const normalized =
        normalizeStatus(status)

    if (normalized === "pending") {
        return `
            <span class="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                <span class="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                Pending
            </span>
        `
    }

    if (normalized === "approved") {
        return `
            <span class="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                <span class="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                Approved
            </span>
        `
    }

    return `
        <span class="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
            <span class="h-1.5 w-1.5 rounded-full bg-red-500"></span>
            Rejected
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

    const selectedDate =
        dateFilter.value

    return overtimeRequests.filter(
        (overtime) => {

            const employee =
                overtime.employee

            const user =
                employee?.user

            const employeeName =
                user
                    ? `${user.first_name} ${user.last_name}`
                    : ""

            const searchableText = `
                ${employeeName}
                ${user?.email || ""}
                ${employee?.position || ""}
                ${overtime.reason || ""}
            `.toLowerCase()

            const matchesSearch =
                search === "" ||
                searchableText.includes(search)

            const matchesStatus =
                status === "" ||
                normalizeStatus(overtime.status) === status

            const matchesDate =
                selectedDate === "" ||
                selectedDate === overtime.date

            return (
                matchesSearch &&
                matchesStatus &&
                matchesDate
            )
        },
    )
}


// =====================================================
// TABLE ROW
// =====================================================

function createTableRow(overtime) {
    const employee =
        overtime.employee

    const user =
        employee?.user

    const employeeName =
        user
            ? `${user.first_name} ${user.last_name}`
            : "Unknown Employee"

    const row =
        document.createElement("tr")

    row.className =
        "transition hover:bg-gray-50"

    row.innerHTML = `
        <td class="px-4 py-4">
            <div>
                <p class="text-sm font-semibold text-gray-900">
                    ${employeeName}
                </p>

                <p class="mt-1 text-xs text-gray-500">
                    ${user?.email || "—"}
                </p>
            </div>
        </td>

        <td class="whitespace-nowrap px-4 py-4 text-sm text-gray-700">
            ${formatDate(overtime.date)}
        </td>

        <td class="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-900">
            ${overtime.hours} hrs
        </td>

        <td class="max-w-xs px-4 py-4 text-sm text-gray-700">
            ${overtime.reason || "—"}
        </td>

        <td class="px-4 py-4">
            ${statusBadge(overtime.status)}
        </td>

        <td class="px-4 py-4 text-right">
            <button
                type="button"
                class="view-manager-overtime-btn rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                data-id="${overtime.id}"
            >
                Review
            </button>
        </td>
    `

    return row
}


// =====================================================
// MOBILE CARD
// =====================================================

function createMobileCard(overtime) {
    const employee =
        overtime.employee

    const user =
        employee?.user

    const employeeName =
        user
            ? `${user.first_name} ${user.last_name}`
            : "Unknown Employee"

    const card =
        document.createElement("div")

    card.className =
        "px-4 py-4"

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

    if (filtered.length === 0) {
        emptyMessage.classList.remove("hidden")
        return
    }

    emptyMessage.classList.add("hidden")

    filtered.forEach((overtime) => {
        tableBody.appendChild(
            createTableRow(overtime),
        )

        cardList.appendChild(
            createMobileCard(overtime),
        )
    })
}


// =====================================================
// OPEN MODAL
// =====================================================

function openReviewModal(overtime) {
    selectedOvertime =
        overtime

    const employee =
        overtime.employee

    const user =
        employee?.user

    const department =
        employee?.department

    reviewEmployee.textContent =
        user
            ? `${user.first_name} ${user.last_name}`
            : "Unknown Employee"

    reviewDepartment.textContent =
        department?.name || "—"

    reviewPosition.textContent =
        employee?.position || "—"

    reviewDate.textContent =
        formatDate(overtime.date)

    reviewHours.textContent =
        `${overtime.hours} hours`

    reviewSubmitted.textContent =
        formatDate(overtime.created_at)

    reviewStatus.innerHTML =
        statusBadge(overtime.status)

    reviewReason.textContent =
        overtime.reason ||
        "No reason provided."

    rejectionReason.value = ""

    errorMessage.textContent = ""
    errorMessage.classList.add("hidden")

    rejectSection.classList.add("hidden")

    if (
        normalizeStatus(overtime.status) === "pending"
    ) {

        approveButton.classList.remove("hidden")
        rejectButton.classList.remove("hidden")

    } else {

        approveButton.classList.add("hidden")
        rejectButton.classList.add("hidden")
    }

    modal.classList.remove("hidden")
    modal.classList.add("flex")
}


// =====================================================
// CLOSE MODAL
// =====================================================

function closeReviewModal() {
    modal.classList.add("hidden")
    modal.classList.remove("flex")

    selectedOvertime = null
    rejectionReason.value = ""

    errorMessage.textContent = ""
    errorMessage.classList.add("hidden")

    rejectSection.classList.add("hidden")
}

closeModalButton.addEventListener(
    "click",
    closeReviewModal,
)

closeFooterButton.addEventListener(
    "click",
    closeReviewModal,
)


// =====================================================
// REVIEW BUTTON
// =====================================================

document.addEventListener(
    "click",
    (event) => {

        const button =
            event.target.closest(
                ".view-manager-overtime-btn",
            )

        if (!button) {
            return
        }

        const overtimeId =
            Number(button.dataset.id)

        const overtime =
            overtimeRequests.find(
                (item) =>
                    Number(item.id) ===
                    overtimeId,
            )

        if (overtime) {
            openReviewModal(overtime)
        }
    },
)


// =====================================================
// APPROVE
// =====================================================

approveButton.addEventListener(
    "click",
    async () => {

        if (!selectedOvertime) {
            return
        }

        try {

            const response =
                await fetch(
                    `/manager/overtime/${selectedOvertime.id}/approve`,
                    {
                        method: "POST",
                        headers: {
                            Accept:
                                "application/json",

                            "X-CSRF-TOKEN":
                                document
                                    .querySelector(
                                        'meta[name="csrf-token"]',
                                    )
                                    .getAttribute(
                                        "content",
                                    ),
                        },
                    },
                )

            const data =
                await response.json()

            if (!response.ok) {

                errorMessage.textContent =
                    data.message ||
                    "Unable to approve request."

                errorMessage.classList.remove(
                    "hidden",
                )

                return
            }

            const index =
                overtimeRequests.findIndex(
                    (item) =>
                        Number(item.id) ===
                        Number(
                            selectedOvertime.id,
                        ),
                )

            if (index !== -1) {
                overtimeRequests[index] =
                    data.overtimeRequest
            }

            closeReviewModal()
            renderOvertimeRequests()

        } catch (error) {

            console.error(
                "APPROVE OVERTIME ERROR:",
                error,
            )
        }
    },
)


// =====================================================
// SHOW REJECTION AREA
// =====================================================

rejectButton.addEventListener(
    "click",
    () => {

        rejectSection.classList.remove(
            "hidden",
        )

        rejectionReason.focus()
    },
)


// =====================================================
// SUBMIT REJECTION
// =====================================================

async function submitRejection() {

    if (!selectedOvertime) {
        return
    }

    const reason =
        rejectionReason.value.trim()

    if (reason === "") {

        errorMessage.textContent =
            "Please provide a rejection reason."

        errorMessage.classList.remove(
            "hidden",
        )

        return
    }

    try {

        const response =
            await fetch(
                `/manager/overtime/${selectedOvertime.id}/reject`,
                {
                    method: "POST",
                    headers: {
                        Accept:
                            "application/json",

                        "Content-Type":
                            "application/json",

                        "X-CSRF-TOKEN":
                            document
                                .querySelector(
                                    'meta[name="csrf-token"]',
                                )
                                .getAttribute(
                                    "content",
                                ),
                    },

                    body: JSON.stringify({
                        rejection_reason:
                            reason,
                    }),
                },
            )

        const data =
            await response.json()

        if (!response.ok) {

            if (data.errors) {

                errorMessage.textContent =
                    Object.values(
                        data.errors,
                    )[0][0]

            } else {

                errorMessage.textContent =
                    data.message ||
                    "Unable to reject request."
            }

            errorMessage.classList.remove(
                "hidden",
            )

            return
        }

        const index =
            overtimeRequests.findIndex(
                (item) =>
                    Number(item.id) ===
                    Number(
                        selectedOvertime.id,
                    ),
            )

        if (index !== -1) {
            overtimeRequests[index] =
                data.overtimeRequest
        }

        closeReviewModal()
        renderOvertimeRequests()

    } catch (error) {

        console.error(
            "REJECT OVERTIME ERROR:",
            error,
        )
    }
}


// =====================================================
// REJECTION TEXTAREA
// =====================================================

rejectionReason.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Enter" &&
            event.ctrlKey
        ) {
            submitRejection()
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

dateFilter.addEventListener(
    "change",
    renderOvertimeRequests,
)


// =====================================================
// INITIAL LOAD
// =====================================================

loadOvertimeRequests()
