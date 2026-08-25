const searchInput = document.getElementById("admin-overtime-search");

const statusFilter = document.getElementById("admin-overtime-status");

const departmentFilter = document.getElementById("admin-overtime-department");

const dateFilter = document.getElementById("admin-overtime-date");

const tableBody = document.getElementById("admin-overtime-table-body");

const cardList = document.getElementById("admin-overtime-card-list");

const emptyMessage = document.getElementById("admin-overtime-empty");

const paginationContainer = document.getElementById(
    "admin-overtime-pagination",
);

const modal = document.getElementById("admin-overtime-modal");

const closeModalButton = document.getElementById("close-admin-overtime-modal");

const closeFooterButton = document.getElementById(
    "close-admin-overtime-footer",
);

const detailEmployee = document.getElementById("admin-detail-employee");

const detailDepartment = document.getElementById("admin-detail-department");

const detailPosition = document.getElementById("admin-detail-position");

const detailDate = document.getElementById("admin-detail-date");

const detailHours = document.getElementById("admin-detail-hours");

const detailSubmitted = document.getElementById("admin-detail-submitted");

const detailStatus = document.getElementById("admin-detail-status");

const detailApprover = document.getElementById("admin-detail-approver");

const detailReason = document.getElementById("admin-detail-reason");

const detailRejectionContainer = document.getElementById(
    "admin-detail-rejection-container",
);

const detailRejection = document.getElementById("admin-detail-rejection");

const OVERTIME_PER_PAGE = 10;

let overtimeRequests = [];

let currentOvertimePage = 1;

async function loadOvertimeRequests() {
    try {
        const response = await fetch("/admin/overtime/data", {
            headers: {
                Accept: "application/json",
            },
        });

        if (!response.ok) {
            console.error("LOAD ADMIN OVERTIME ERROR:", response.status);

            return;
        }

        const data = await response.json();

        overtimeRequests = data.overtimeRequests || [];

        renderOvertimeRequests(1);
    } catch (error) {
        console.error("LOAD ADMIN OVERTIME ERROR:", error);
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

    if (normalized === "rejected") {
        return `
            <span class="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
                <span class="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                Rejected
            </span>
        `;
    }

    return `
        <span class="inline-flex items-center whitespace-nowrap rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
            Unknown
        </span>
    `;
}

function getFilteredRequests() {
    const search = searchInput.value.toLowerCase().trim();

    const status = statusFilter.value.toLowerCase().trim();

    const departmentId = departmentFilter.value;

    const selectedDate = dateFilter.value;

    return overtimeRequests.filter((overtime) => {
        const employee = overtime.employee;

        const user = employee?.user;

        const department = employee?.department;

        const employeeName = user ? `${user.first_name} ${user.last_name}` : "";

        const searchableText = `
                    ${employeeName}
                    ${user?.email || ""}
                    ${employee?.position || ""}
                    ${department?.name || ""}
                    ${overtime.reason || ""}
                `.toLowerCase();

        const matchesSearch = search === "" || searchableText.includes(search);

        const matchesStatus =
            status === "" || normalizeStatus(overtime.status) === status;

        const matchesDepartment =
            departmentId === "" ||
            String(employee?.department_id) === String(departmentId);

        const matchesDate =
            selectedDate === "" || selectedDate === overtime.date;

        return (
            matchesSearch && matchesStatus && matchesDepartment && matchesDate
        );
    });
}

function createTableRow(overtime) {
    const employee = overtime.employee;

    const user = employee?.user;

    const department = employee?.department;

    const employeeName = user
        ? `${user.first_name} ${user.last_name}`
        : "Unknown Employee";

    const row = document.createElement("tr");

    row.className = "transition hover:bg-gray-50";

    row.innerHTML = `
        <td class="align-middle break-words px-4 py-4 text-center">
            <p class="text-sm font-semibold text-gray-900">
                ${employeeName}
            </p>

            <p class="mt-1 break-all text-xs text-gray-500 text-center">
                ${user?.email || "—"}
            </p>
        </td>

        <td class="align-middle break-words px-4 py-4 text-sm text-gray-700 text-center">
            ${department?.name || "—"}
        </td>

        <td class="align-middle whitespace-nowrap px-4 py-4 text-sm text-gray-700 text-center">
            ${formatDate(overtime.date)}
        </td>

        <td class="align-middle whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-900 text-center">
            ${overtime.hours} hrs
        </td>

        <td class="align-middle px-4 py-4 text-center">
            ${statusBadge(overtime.status)}
        </td>

        <td class="align-middle whitespace-nowrap px-4 py-4 text-center">
            <button
                type="button"
                class="view-admin-overtime-btn rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 hover:text-slate-900"
                data-id="${overtime.id}"
            >
                View
            </button>
        </td>
    `;

    return row;
}

function createMobileCard(overtime) {
    const employee = overtime.employee;

    const user = employee?.user;

    const department = employee?.department;

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
    `;

    return card;
}

function renderOvertimeRequests(page = 1) {
    const filtered = getFilteredRequests();

    const totalRequests = filtered.length;

    const totalPages = Math.ceil(totalRequests / OVERTIME_PER_PAGE);

    if (totalPages === 0) {
        currentOvertimePage = 1;
    } else if (page > totalPages) {
        currentOvertimePage = totalPages;
    } else if (page < 1) {
        currentOvertimePage = 1;
    } else {
        currentOvertimePage = page;
    }

    const startIndex = (currentOvertimePage - 1) * OVERTIME_PER_PAGE;

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

    renderOvertimePagination(totalRequests, totalPages);
}

function renderOvertimePagination(totalRequests, totalPages) {
    paginationContainer.innerHTML = "";

    if (totalRequests <= OVERTIME_PER_PAGE) {
        paginationContainer.classList.add("hidden");

        return;
    }

    paginationContainer.classList.remove("hidden");

    const wrapper = document.createElement("div");

    wrapper.className =
        "flex min-h-[72px] w-full items-center justify-between px-5 py-3";

    const endRecord = Math.min(
        currentOvertimePage * OVERTIME_PER_PAGE,
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

    previousButton.disabled = currentOvertimePage <= 1;

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
        renderOvertimeRequests(currentOvertimePage - 1);
    });

    controls.appendChild(previousButton);

    for (let page = 1; page <= totalPages; page++) {
        const pageButton = document.createElement("button");

        pageButton.type = "button";

        pageButton.textContent = page;

        pageButton.className =
            "inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-2.5 text-xs font-medium transition";

        if (page === currentOvertimePage) {
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

    nextButton.disabled = currentOvertimePage >= totalPages;

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
        renderOvertimeRequests(currentOvertimePage + 1);
    });

    controls.appendChild(nextButton);

    wrapper.appendChild(information);

    wrapper.appendChild(controls);

    paginationContainer.appendChild(wrapper);
}

function openOvertimeDetails(overtime) {
    const employee = overtime.employee;

    const user = employee?.user;

    const department = employee?.department;

    const employeeName = user
        ? `${user.first_name} ${user.last_name}`
        : "Unknown Employee";

    detailEmployee.textContent = employeeName;

    detailDepartment.textContent = department?.name || "—";

    detailPosition.textContent = employee?.position || "—";

    detailDate.textContent = formatDate(overtime.date);

    detailHours.textContent = `${overtime.hours} hours`;

    detailSubmitted.textContent = formatDate(overtime.created_at);

    detailStatus.innerHTML = statusBadge(overtime.status);

    if (overtime.approver) {
        detailApprover.textContent = `${overtime.approver.first_name} ${overtime.approver.last_name}`;
    } else {
        detailApprover.textContent = "Not reviewed";
    }

    detailReason.textContent = overtime.reason || "No reason provided.";

    const normalizedStatus = normalizeStatus(overtime.status);

    if (normalizedStatus === "rejected") {
        detailRejectionContainer.classList.remove("hidden");

        detailRejection.textContent =
            overtime.rejection_reason || "No rejection reason provided.";
    } else {
        detailRejectionContainer.classList.add("hidden");

        detailRejection.textContent = "";
    }

    modal.classList.remove("hidden");

    modal.classList.add("flex");
}

function closeOvertimeDetails() {
    modal.classList.add("hidden");

    modal.classList.remove("flex");
}

closeModalButton.addEventListener("click", closeOvertimeDetails);

closeFooterButton.addEventListener("click", closeOvertimeDetails);

modal.addEventListener("click", (event) => {
    if (event.target === modal) {
        closeOvertimeDetails();
    }
});

document.addEventListener("click", (event) => {
    const button = event.target.closest(".view-admin-overtime-btn");

    if (!button) {
        return;
    }

    const overtimeId = Number(button.dataset.id);

    const overtime = overtimeRequests.find(
        (item) => Number(item.id) === overtimeId,
    );

    if (overtime) {
        openOvertimeDetails(overtime);
    }
});

searchInput.addEventListener("input", () => {
    renderOvertimeRequests(1);
});

statusFilter.addEventListener("change", () => {
    renderOvertimeRequests(1);
});

departmentFilter.addEventListener("change", () => {
    renderOvertimeRequests(1);
});

dateFilter.addEventListener("change", () => {
    renderOvertimeRequests(1);
});

loadOvertimeRequests();
