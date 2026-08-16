const addDepartmentButton = document.getElementById("add-department-btn");
const addDepartmentModal = document.getElementById("add-department-modal");
const cancelAddDepartment = document.getElementById("cancel-add-department");
const addDepartmentForm = document.getElementById("add-department-form");
const nameError = document.getElementById("name-error");
const tbody = document.getElementById("department-table-body");
const noDepartments = document.getElementById("no-departments");
const deleteForms = document.querySelectorAll(".delete-department-form");

const actionsCell = (id) => `
    <div class="flex items-center justify-center gap-2">
        <button
            type="button"
            data-id="${id}"
            class="edit-department-btn rounded-md border border-gray-300 bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30">Edit</button>
        <button
            type="button"
            data-id="${id}"
            class="delete-department-btn rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/40">Delete</button>
    </div>
`;

const rowMarkup = (department, formattedDate, employeesCount = 0) => `
    <td class="whitespace-nowrap px-3 py-4 text-center font-mono text-xs text-gray-500">DEP-${String(department.id).padStart(2, "0")}</td>
    <td class="px-3 py-4 text-center text-sm font-semibold text-gray-900">${department.name}</td>
    <td class="px-3 py-4 text-center text-sm text-gray-700">${employeesCount}</td>
    <td class="whitespace-nowrap px-3 py-4 text-center text-sm text-gray-700">${formattedDate}</td>
    <td class="whitespace-nowrap px-3 py-4 text-center">${actionsCell(department.id)}</td>
`;

tbody.addEventListener("click", (event) => {
    if (event.target.classList.contains("edit-department-btn")) {
        const id = event.target.getAttribute("data-id");
        document.getElementById(`edit-department-modal-${id}`).classList.remove("hidden");
    }

    if (event.target.classList.contains("delete-department-btn")) {
        const id = event.target.getAttribute("data-id");
        document.getElementById(`delete-department-modal-${id}`).classList.remove("hidden");
    }
});

deleteForms.forEach((form) => {
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        try {
            const formData = new FormData(event.target);
            const response = await fetch(event.target.action, {
                method: "POST",
                body: formData,
                headers: { "Accept": "application/json" },
            });

            const data = await response.json();
            const departmentId = event.target.id.replace("delete-department-form-", "");
            const errorMessage = document.getElementById(`delete-department-error-${departmentId}`);

            if (!response.ok) {
                errorMessage.textContent = data.message;
                errorMessage.classList.remove("hidden");
                return;
            }

            document.getElementById(`department-row-${departmentId}`)?.remove();
            document.getElementById(`department-card-${departmentId}`)?.remove();

            document.getElementById(`delete-department-modal-${departmentId}`).classList.add("hidden");
            errorMessage.classList.add("hidden");
            errorMessage.textContent = "";
        } catch (error) {
            console.error(error);
        }
    });
});

const editForms = document.querySelectorAll(".edit-department-form");

editForms.forEach((form) => {
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const response = await fetch(event.target.action, {
            method: "POST",
            body: formData,
            headers: { "Accept": "application/json" },
        });

        const data = await response.json();
        const formattedDate = new Date(data.department.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });

        if (response.ok) {
            const row = document.getElementById(`department-row-${data.department.id}`);
            if (row) {
                row.innerHTML = rowMarkup(data.department, formattedDate);
            }
            document.getElementById(`edit-department-modal-${data.department.id}`).classList.add("hidden");
        }
    });
});

addDepartmentButton.addEventListener("click", () => {
    addDepartmentModal.classList.remove("hidden");
});

addDepartmentForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    nameError.textContent = "";

    try {
        const formData = new FormData(event.target);
        const response = await fetch(event.target.action, {
            method: "POST",
            body: formData,
            headers: { "Accept": "application/json" },
        });

        const data = await response.json();

        if (!response.ok) {
            nameError.textContent = data.errors.name[0];
            return;
        }

        const formattedDate = new Date(data.department.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });

        noDepartments?.remove();

        const row = document.createElement("tr");
        row.id = `department-row-${data.department.id}`;
        row.className = "transition hover:bg-gray-50";
        row.innerHTML = rowMarkup(data.department, formattedDate);
        tbody.appendChild(row);

        addDepartmentForm.reset();
        document.getElementById("add-department-modal").classList.add("hidden");
        window.location.reload();
    } catch (error) {
        console.error(error);
    }
});
