const tableBody = document.getElementById("manager-team-table-body");

const cardList = document.getElementById("manager-team-card-list");

const emptyMessage = document.getElementById("manager-team-empty");

const paginationContainer = document.getElementById("manager-team-pagination");

const TEAM_PER_PAGE = 10;

const employees = window.managerTeamEmployees || [];

let currentPage = 1;

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

function createStatusBadge(status) {
    if (status === "active") {
        return `
            <span class="inline-flex items-center rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                Active
            </span>
        `;
    }

    return `
        <span class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
            Inactive
        </span>
    `;
}

function createTableRow(employee) {
    const user = employee.user;

    const department = employee.department;

    const employeeName = user
        ? `${user.first_name} ${user.last_name}`
        : "Unknown Employee";

    const row = document.createElement("tr");

    row.className = "transition hover:bg-gray-50";

    row.innerHTML = `
        <td class="px-4 py-4 text-center">
            <p class="text-sm font-semibold text-gray-900">
                ${employeeName}
            </p>
        </td>

        <td class="px-4 py-4 text-center text-sm text-gray-700">
            ${employee.position || "—"}
        </td>

        <td class="px-4 py-4 text-center text-sm text-gray-700">
            ${department?.name || "—"}
        </td>

        <td class="px-4 py-4 text-center text-sm text-gray-700">
            <div class="truncate">
                ${user?.email || "—"}
            </div>
        </td>

        <td class="whitespace-nowrap px-4 py-4 text-center text-sm text-gray-700">
            ${formatDate(employee.hire_date)}
        </td>

        <td class="px-4 py-4 text-center">
            <div class="flex justify-center">
                ${createStatusBadge(user?.status)}
            </div>
        </td>
    `;

    return row;
}

function createMobileCard(employee) {
    const user = employee.user;

    const department = employee.department;

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
                    ${employee.position || "—"}
                </p>

            </div>

            ${createStatusBadge(user?.status)}

        </div>


        <div class="mt-3 grid grid-cols-2 gap-3 text-sm">

            <div>

                <p class="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Department
                </p>

                <p class="truncate text-gray-700">
                    ${department?.name || "—"}
                </p>

            </div>


            <div>

                <p class="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Hire Date
                </p>

                <p class="text-gray-700">
                    ${formatDate(employee.hire_date)}
                </p>

            </div>


            <div class="col-span-2">

                <p class="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Email
                </p>

                <p class="break-all text-gray-700">
                    ${user?.email || "—"}
                </p>

            </div>

        </div>
    `;

    return card;
}

function renderTeam(page = 1) {
    const totalEmployees = employees.length;

    const totalPages = Math.ceil(totalEmployees / TEAM_PER_PAGE);

    if (totalPages === 0) {
        currentPage = 1;
    } else if (page > totalPages) {
        currentPage = totalPages;
    } else if (page < 1) {
        currentPage = 1;
    } else {
        currentPage = page;
    }

    const startIndex = (currentPage - 1) * TEAM_PER_PAGE;

    const endIndex = startIndex + TEAM_PER_PAGE;

    const pageEmployees = employees.slice(startIndex, endIndex);

    tableBody.innerHTML = "";

    cardList.innerHTML = "";

    if (pageEmployees.length === 0) {
        emptyMessage.classList.remove("hidden");
    } else {
        emptyMessage.classList.add("hidden");

        pageEmployees.forEach((employee) => {
            tableBody.appendChild(createTableRow(employee));

            cardList.appendChild(createMobileCard(employee));
        });
    }

    renderPagination(totalEmployees, totalPages);
}

function renderPagination(totalEmployees, totalPages) {
    paginationContainer.innerHTML = "";

    if (totalEmployees <= TEAM_PER_PAGE) {
        paginationContainer.classList.add("hidden");

        return;
    }

    paginationContainer.classList.remove("hidden");

    const wrapper = document.createElement("div");

    wrapper.className =
        "flex min-h-[72px] w-full items-center justify-between px-5 py-3";

    const endRecord = Math.min(currentPage * TEAM_PER_PAGE, totalEmployees);

    const information = document.createElement("p");

    information.className = "text-xs text-gray-500";

    information.innerHTML = `
        Showing
        <span class="font-semibold text-gray-700">
            ${endRecord}
        </span>
        of
        <span class="font-semibold text-gray-700">
            ${totalEmployees}
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
        renderTeam(currentPage - 1);
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
            renderTeam(page);
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
        renderTeam(currentPage + 1);
    });

    controls.appendChild(nextButton);

    wrapper.appendChild(information);

    wrapper.appendChild(controls);

    paginationContainer.appendChild(wrapper);
}

renderTeam(1);
