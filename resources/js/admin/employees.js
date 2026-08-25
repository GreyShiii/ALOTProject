const addEmployeeButton = document.getElementById("add-employee-btn");

const addEmployeeModal = document.getElementById("add-employee-modal");

const addEmployeeForm = document.getElementById("add-employee-form");

const cancelAddEmployee = document.getElementById("cancel-add-employee");

const employeeTableBody = document.getElementById("employee-table-body");

const employeeError = document.getElementById("employee-error");

const employeeSearch = document.getElementById("employee-search");

const departmentFilter = document.getElementById("filter-department");

const managerFilter = document.getElementById("filter-manager");

const employeePagination = document.getElementById("employee-pagination");

const employeeCardList = document.getElementById("employee-card-list");

const EMPLOYEES_PER_PAGE = 10;

let currentEmployeePage = 1;

addEmployeeButton.addEventListener("click", () => {
    addEmployeeModal.classList.remove("hidden");
});

cancelAddEmployee.addEventListener("click", () => {
    addEmployeeModal.classList.add("hidden");

    addEmployeeForm.reset();

    employeeError.textContent = "";
});

addEmployeeForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    employeeError.textContent = "";

    try {
        const formData = new FormData(addEmployeeForm);

        const response = await fetch(addEmployeeForm.action, {
            method: "POST",
            body: formData,
            headers: {
                Accept: "application/json",
            },
        });

        const data = await response.json();

        if (!response.ok) {
            if (data.errors) {
                employeeError.textContent = Object.values(data.errors)[0][0];
            } else {
                employeeError.textContent =
                    data.message || "Something went wrong.";
            }

            return;
        }

        const noEmployees = document.getElementById("no-employees");

        if (noEmployees) {
            noEmployees.remove();
        }

        addEmployeeToTable(data.employee);

        updateManagerDropdown(data.employee);

        addEmployeeModal.classList.add("hidden");

        addEmployeeForm.reset();

        filterEmployees(currentEmployeePage);
    } catch (error) {
        console.error("ADD EMPLOYEE ERROR:", error);
    }
});

employeeTableBody.addEventListener("click", async (event) => {
    if (event.target.classList.contains("view-employee-btn")) {
        showViewEmployee(event.target);

        return;
    }

    if (event.target.classList.contains("edit-employee-btn")) {
        const id = event.target.getAttribute("data-id");

        try {
            const response = await fetch(`/admin/employees/${id}`, {
                headers: {
                    Accept: "application/json",
                },
            });

            const data = await response.json();

            if (!response.ok) {
                console.error(data);

                return;
            }

            populateEditForm(data.employee);

            const editModal = document.getElementById("edit-employee-modal");

            editModal.classList.remove("hidden");
        } catch (error) {
            console.error("GET EMPLOYEE ERROR:", error);
        }

        return;
    }

    if (event.target.classList.contains("delete-employee-btn")) {
        const id = event.target.getAttribute("data-id");

        const deleteModal = document.getElementById("delete-employee-modal");

        const deleteForm = document.getElementById("delete-employee-form");

        const deleteName = document.getElementById("delete-employee-name");

        deleteForm.action = `/admin/employees/${id}`;

        deleteForm.dataset.id = id;

        deleteName.textContent = `${event.target.dataset.firstName || ""} ${
            event.target.dataset.lastName || ""
        }`.trim();

        deleteModal.classList.remove("hidden");

        return;
    }
});

const editEmployeeModal = document.getElementById("edit-employee-modal");

const editEmployeeForm = document.getElementById("edit-employee-form");

const editEmployeeError = document.getElementById("edit-employee-error");

editEmployeeForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    editEmployeeError.textContent = "";
    editEmployeeError.classList.add("hidden");

    const password = editEmployeeForm.elements["password"].value;

    if (password !== "" && password.length < 8) {
        editEmployeeError.textContent =
            "Password must be at least 8 characters.";

        editEmployeeError.classList.remove("hidden");

        return;
    }

    try {
        const formData = new FormData(editEmployeeForm);

        const response = await fetch(editEmployeeForm.action, {
            method: "POST",
            body: formData,
            headers: {
                Accept: "application/json",
            },
        });

        const data = await response.json();

        if (!response.ok) {
            if (data.errors) {
                editEmployeeError.textContent =
                    Object.values(data.errors)[0][0];
            } else {
                editEmployeeError.textContent =
                    data.message || "Something went wrong.";
            }

            editEmployeeError.classList.remove("hidden");

            return;
        }

        updateEmployeeRow(data.employee);
        updateManagerDropdown(data.employee);

        editEmployeeModal.classList.add("hidden");

        editEmployeeError.textContent = "";
        editEmployeeError.classList.add("hidden");

        editEmployeeForm.reset();

        filterEmployees(currentEmployeePage);

    } catch (error) {
        console.error("EDIT EMPLOYEE ERROR:", error);

        editEmployeeError.textContent =
            "Something went wrong. Please try again.";

        editEmployeeError.classList.remove("hidden");
    }
});

document
    .getElementById("cancel-edit-employee")
    .addEventListener("click", () => {
        editEmployeeModal.classList.add("hidden");

        editEmployeeError.textContent = "";
        editEmployeeError.classList.add("hidden");
    });

const viewEmployeeModal = document.getElementById("view-employee-modal");

const closeViewEmployee = document.getElementById("close-view-employee");

const viewEmployeeName = document.getElementById("view-employee-name");

const viewEmployeeAccount = document.getElementById("view-employee-account");

const viewEmployeeEmail = document.getElementById("view-employee-email");

const viewEmployeeRole = document.getElementById("view-employee-role");

const viewEmployeePosition = document.getElementById("view-employee-position");

const viewEmployeeDepartment = document.getElementById(
    "view-employee-department",
);

const viewEmployeeManager = document.getElementById("view-employee-manager");

const viewEmployeeHireDate = document.getElementById("view-employee-hire-date");

const viewEmployeeStatus = document.getElementById("view-employee-status");

function showViewEmployee(button) {
    const firstName = button.dataset.firstName;

    const lastName = button.dataset.lastName;

    const employeeId = button.dataset.id;

    const email = button.dataset.email;

    const role = button.dataset.role;

    const status = button.dataset.status;

    const position = button.dataset.position;

    const department = button.dataset.department;

    const manager = button.dataset.manager;

    const hireDate = button.dataset.hireDate;

    viewEmployeeName.textContent = `${firstName} ${lastName}`;

    viewEmployeeAccount.textContent = `Employee record EMP-${String(
        employeeId,
    ).padStart(4, "0")}`;

    viewEmployeeEmail.textContent = email;

    viewEmployeeRole.textContent = role.charAt(0).toUpperCase() + role.slice(1);

    viewEmployeePosition.textContent = position || "—";

    viewEmployeeDepartment.textContent = department || "—";

    viewEmployeeManager.textContent = manager || "None";

    viewEmployeeHireDate.textContent = hireDate || "N/A";

    viewEmployeeStatus.textContent =
        status.charAt(0).toUpperCase() + status.slice(1);

    viewEmployeeModal.classList.remove("hidden");
}

closeViewEmployee.addEventListener("click", () => {
    viewEmployeeModal.classList.add("hidden");
});

const deleteEmployeeModal = document.getElementById("delete-employee-modal");

const deleteEmployeeForm = document.getElementById("delete-employee-form");

deleteEmployeeForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
        const id = deleteEmployeeForm.dataset.id;

        const formData = new FormData(deleteEmployeeForm);

        const response = await fetch(deleteEmployeeForm.action, {
            method: "POST",
            body: formData,
            headers: {
                Accept: "application/json",
            },
        });

        const data = await response.json();

        if (!response.ok) {
            console.error(data);

            return;
        }

        const row = document.getElementById(`employee-row-${id}`);

        if (row) {
            row.remove();
        }

        const card = document.getElementById(`employee-card-${id}`);

        if (card) {
            card.remove();
        }

        removeManagerFromDropdown(id);

        deleteEmployeeModal.classList.add("hidden");

        const remainingRows = employeeTableBody.querySelectorAll(
            "tr:not(#no-filter-results):not(#no-employees)",
        );

        if (remainingRows.length === 0) {
            employeeTableBody.innerHTML = `
                    <tr id="no-employees">
                        <td
                            colspan="9"
                            class="px-6 py-12 text-center text-sm text-gray-500"
                        >
                            No employees yet.
                        </td>
                    </tr>
                `;
        }

        filterEmployees(currentEmployeePage);
    } catch (error) {
        console.error("DELETE EMPLOYEE ERROR:", error);
    }
});

document
    .getElementById("cancel-delete-employee")
    .addEventListener("click", () => {
        deleteEmployeeModal.classList.add("hidden");
    });

function populateEditForm(employee) {
    const form = document.getElementById("edit-employee-form");

    form.action = `/admin/employees/${employee.id}`;

    form.elements["first_name"].value = employee.user.first_name;

    form.elements["last_name"].value = employee.user.last_name;

    form.elements["email"].value = employee.user.email;

    form.elements["password"].value = "";

    form.elements["role"].value = employee.user.role;

    form.elements["department_id"].value = employee.department_id;

    form.elements["position"].value = employee.position;

    form.elements["hire_date"].value = employee.hire_date
        ? employee.hire_date.substring(0, 10)
        : "";

    if (employee.manager) {
        const managerSelect = form.elements["manager_id"];

        let managerOption = managerSelect.querySelector(
            `option[value="${employee.manager.id}"]`,
        );

        if (!managerOption) {
            managerOption = document.createElement("option");

            managerOption.value = employee.manager.id;

            managerOption.textContent = `${employee.manager.user.first_name} ${employee.manager.user.last_name}`;

            managerSelect.appendChild(managerOption);
        }
    }

    form.elements["manager_id"].value = employee.manager_id ?? "";
}

function buildActionButtons(employee) {
    const user = employee.user;

    const department = employee.department;

    const manager = employee.manager;

    const managerName = manager
        ? `${manager.user.first_name} ${manager.user.last_name}`
        : "None";

    const hireDate = employee.hire_date
        ? new Date(employee.hire_date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
          })
        : "N/A";

    return `
        <div class="flex items-center justify-center gap-2">

            <button
                type="button"
                class="view-employee-btn rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300/60"
                data-id="${employee.id}"
                data-first-name="${user.first_name}"
                data-last-name="${user.last_name}"
                data-email="${user.email}"
                data-role="${user.role}"
                data-status="${user.status}"
                data-position="${employee.position}"
                data-department="${department.name}"
                data-manager="${managerName}"
                data-hire-date="${hireDate}"
            >
                View
            </button>

            <button
                type="button"
                class="edit-employee-btn rounded-md border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-300/60"
                data-id="${employee.id}"
            >
                Edit
            </button>

            <button
                type="button"
                class="delete-employee-btn rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/40"
                data-id="${employee.id}"
                data-first-name="${user.first_name}"
                data-last-name="${user.last_name}"
            >
                Delete
            </button>

        </div>
    `;
}

function buildEmployeeCells(employee) {
    const user = employee.user;

    const department = employee.department;

    const manager = employee.manager;

    const managerName = manager
        ? `${manager.user.first_name} ${manager.user.last_name}`
        : "None";

    const hireDate = employee.hire_date
        ? new Date(employee.hire_date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
          })
        : "N/A";

    const statusBadge =
        user.status === "active"
            ? `
                <span class="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                    Active
                </span>
            `
            : `
                <span class="inline-flex items-center rounded-full border border-gray-200 bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
                    Inactive
                </span>
            `;

    return `
        <td class="whitespace-nowrap px-3 py-4 text-center font-mono text-xs text-gray-500">
            EMP-${String(employee.id).padStart(2, "0")}
        </td>

        <td class="px-3 py-4 text-center text-sm font-semibold text-gray-900">
            ${user.first_name} ${user.last_name}
        </td>

        <td class="break-all px-3 py-4 text-center text-sm text-gray-500">
            ${user.email}
        </td>

        <td class="max-w-[160px] px-3 py-4 text-center text-sm text-gray-700">
            ${employee.position}
        </td>

        <td class="px-3 py-4 text-center text-sm text-gray-700">
            ${department.name}
        </td>

        <td class="px-3 py-4 text-center text-sm text-gray-700">
            ${manager ? managerName : `<span class="text-gray-400">None</span>`}
        </td>

        <td class="whitespace-nowrap px-3 py-4 text-center text-sm text-gray-700">
            ${hireDate}
        </td>

        <td class="whitespace-nowrap px-3 py-4 text-center">
            ${statusBadge}
        </td>

        <td class="whitespace-nowrap px-3 py-4 text-center">
            ${buildActionButtons(employee)}
        </td>
    `;
}

function addEmployeeToTable(employee) {
    const department = employee.department;

    const manager = employee.manager;

    const managerName = manager
        ? `${manager.user.first_name} ${manager.user.last_name}`
        : "None";

    employeeTableBody.insertAdjacentHTML(
        "beforeend",
        `
            <tr
                id="employee-row-${employee.id}"
                class="transition hover:bg-gray-50"
                data-department="${department.name}"
                data-manager="${managerName === "None" ? "" : managerName}"
            >
                ${buildEmployeeCells(employee)}
            </tr>
        `,
    );
}

function updateEmployeeRow(employee) {
    const row = document.getElementById(`employee-row-${employee.id}`);

    if (!row) {
        return;
    }

    const department = employee.department;

    const manager = employee.manager;

    row.dataset.department = department.name;

    row.dataset.manager = manager
        ? `${manager.user.first_name} ${manager.user.last_name}`
        : "";

    row.innerHTML = buildEmployeeCells(employee);
}

function updateManagerDropdown(employee) {
    const managerSelects = document.querySelectorAll(
        'select[name="manager_id"]',
    );

    managerSelects.forEach((select) => {
        const existingOption = select.querySelector(
            `option[value="${employee.id}"]`,
        );

        if (employee.user.role === "manager") {
            if (!existingOption) {
                const option = document.createElement("option");

                option.value = employee.id;

                option.textContent = `${employee.user.first_name} ${employee.user.last_name}`;

                select.appendChild(option);
            }
        } else {
            if (existingOption) {
                existingOption.remove();
            }
        }
    });
}

function removeManagerFromDropdown(employeeId) {
    const managerSelects = document.querySelectorAll(
        'select[name="manager_id"]',
    );

    managerSelects.forEach((select) => {
        const option = select.querySelector(`option[value="${employeeId}"]`);

        if (option) {
            option.remove();
        }
    });
}

function filterEmployees(page = 1) {
    const searchValue = employeeSearch.value.toLowerCase().trim();

    const departmentValue = departmentFilter.value.toLowerCase().trim();

    const managerValue = managerFilter.value.toLowerCase().trim();

    const tableRows = employeeTableBody.querySelectorAll(
        "tr:not(#no-employees):not(#no-filter-results)",
    );

    const matchingTableRows = [];

    tableRows.forEach((row) => {
        const rowText = row.textContent.toLowerCase();

        const matchesSearch = rowText.includes(searchValue);

        const rowDepartment = (row.dataset.department || "")
            .toLowerCase()
            .trim();

        const matchesDepartment =
            departmentValue === "" || rowDepartment === departmentValue;

        const rowManager = (row.dataset.manager || "").toLowerCase().trim();

        const matchesManager =
            managerValue === "" || rowManager === managerValue;

        const shouldShow = matchesSearch && matchesDepartment && matchesManager;

        if (shouldShow) {
            matchingTableRows.push(row);
        } else {
            row.classList.add("hidden");
        }
    });

    const mobileCards = employeeCardList
        ? employeeCardList.querySelectorAll("[id^='employee-card-']")
        : [];

    const matchingMobileCards = [];

    mobileCards.forEach((card) => {
        const cardText = card.textContent.toLowerCase();

        const matchesSearch = cardText.includes(searchValue);

        const cardDepartment = (card.dataset.department || "")
            .toLowerCase()
            .trim();

        const matchesDepartment =
            departmentValue === "" || cardDepartment === departmentValue;

        const cardManager = (card.dataset.manager || "").toLowerCase().trim();

        const matchesManager =
            managerValue === "" || cardManager === managerValue;

        const shouldShow = matchesSearch && matchesDepartment && matchesManager;

        if (shouldShow) {
            matchingMobileCards.push(card);
        } else {
            card.classList.add("hidden");
        }
    });

    const totalEmployees = matchingTableRows.length;

    const totalPages = Math.ceil(totalEmployees / EMPLOYEES_PER_PAGE);

    if (totalPages === 0) {
        currentEmployeePage = 1;
    } else if (page > totalPages) {
        currentEmployeePage = totalPages;
    } else if (page < 1) {
        currentEmployeePage = 1;
    } else {
        currentEmployeePage = page;
    }

    const startIndex = (currentEmployeePage - 1) * EMPLOYEES_PER_PAGE;

    const endIndex = startIndex + EMPLOYEES_PER_PAGE;

    matchingTableRows.forEach((row, index) => {
        if (index >= startIndex && index < endIndex) {
            row.classList.remove("hidden");
        } else {
            row.classList.add("hidden");
        }
    });

    matchingMobileCards.forEach((card, index) => {
        if (index >= startIndex && index < endIndex) {
            card.classList.remove("hidden");
        } else {
            card.classList.add("hidden");
        }
    });

    let noResults = document.getElementById("no-filter-results");

    if (totalEmployees === 0 && tableRows.length > 0) {
        if (!noResults) {
            noResults = document.createElement("tr");

            noResults.id = "no-filter-results";

            noResults.innerHTML = `
                    <td
                        colspan="9"
                        class="px-6 py-12 text-center text-sm text-gray-500"
                    >
                        No employees match your filters.
                    </td>
                `;

            employeeTableBody.appendChild(noResults);
        }
    } else if (noResults) {
        noResults.remove();
    }

    renderEmployeePagination(totalEmployees, totalPages);
}

function renderEmployeePagination(totalEmployees, totalPages) {
    if (!employeePagination) {
        return;
    }

    employeePagination.innerHTML = "";

    if (totalEmployees <= EMPLOYEES_PER_PAGE) {
        employeePagination.classList.add("hidden");

        return;
    }

    employeePagination.classList.remove("hidden");

    const wrapper = document.createElement("div");

    wrapper.className =
        "flex min-h-[72px] w-full items-center justify-between px-5 py-3";

    const endRecord = Math.min(
        currentEmployeePage * EMPLOYEES_PER_PAGE,
        totalEmployees,
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
                ${totalEmployees}
            </span>
            records
        `;

    const controls = document.createElement("div");

    controls.className = "flex items-center gap-1";

    const previousButton = document.createElement("button");

    previousButton.type = "button";

    previousButton.disabled = currentEmployeePage <= 1;

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
        filterEmployees(currentEmployeePage - 1);
    });

    controls.appendChild(previousButton);

    for (let page = 1; page <= totalPages; page++) {
        const pageButton = document.createElement("button");

        pageButton.type = "button";

        pageButton.textContent = page;

        pageButton.className =
            "inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-2.5 text-xs font-medium transition";

        if (page === currentEmployeePage) {
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
            filterEmployees(page);
        });

        controls.appendChild(pageButton);
    }

    const nextButton = document.createElement("button");

    nextButton.type = "button";

    nextButton.disabled = currentEmployeePage >= totalPages;

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
        filterEmployees(currentEmployeePage + 1);
    });

    controls.appendChild(nextButton);

    wrapper.appendChild(information);

    wrapper.appendChild(controls);

    employeePagination.appendChild(wrapper);
}

employeeSearch.addEventListener("input", () => {
    filterEmployees(1);
});

departmentFilter.addEventListener("change", () => {
    filterEmployees(1);
});

managerFilter.addEventListener("change", () => {
    filterEmployees(1);
});

filterEmployees(1);
