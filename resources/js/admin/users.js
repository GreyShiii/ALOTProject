const addUserButton = document.getElementById("add-user-btn");
const addUserModal = document.getElementById("add-user-modal");
const addUserForm = document.getElementById("add-user-form");
const userTableBody = document.getElementById("user-table-body");
const noUsers = document.getElementById("no-users");
const deleteForms = document.querySelectorAll(".delete-user-form");
const editForms = document.querySelectorAll(".edit-user-form");

addUserButton.addEventListener("click", () => {
    addUserModal.classList.remove("hidden");
});

userTableBody.addEventListener("click", (event) => {
    if (event.target.classList.contains("view-user-btn")) {
        const id = event.target.getAttribute("data-id");
        document.getElementById(`view-user-modal-${id}`).classList.remove("hidden");
    }

    if (event.target.classList.contains("edit-user-btn")) {
        const id = event.target.getAttribute("data-id");
        document.getElementById(`edit-user-modal-${id}`).classList.remove("hidden");
    }

    if (event.target.classList.contains("delete-user-btn")) {
        const id = event.target.getAttribute("data-id");
        document.getElementById(`delete-user-modal-${id}`).classList.remove("hidden");
    }
});

addUserForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    document.getElementById("first-name-error").textContent = "";
    document.getElementById("last-name-error").textContent = "";
    document.getElementById("email-error").textContent = "";
    document.getElementById("password-error").textContent = "";
    document.getElementById("role-error").textContent = "";
    document.getElementById("status-error").textContent = "";

    try {
        const formData = new FormData(event.target);
        const response = await fetch(event.target.action, {
            method: "POST",
            body: formData,
            headers: { "Accept": "application/json" },
        });

        const data = await response.json();

        if (!response.ok) {
            if (data.errors) {
                if (data.errors.first_name) {
                    document.getElementById("first-name-error").textContent = data.errors.first_name[0];
                }
                if (data.errors.last_name) {
                    document.getElementById("last-name-error").textContent = data.errors.last_name[0];
                }
                if (data.errors.email) {
                    document.getElementById("email-error").textContent = data.errors.email[0];
                }
                if (data.errors.password) {
                    document.getElementById("password-error").textContent = data.errors.password[0];
                }
                if (data.errors.role) {
                    document.getElementById("role-error").textContent = data.errors.role[0];
                }
                if (data.errors.status) {
                    document.getElementById("status-error").textContent = data.errors.status[0];
                }
            }
            return;
        }

        const user = data.user;
        const createdDate = new Date(user.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });

        const roleBadge = getRoleBadge(user.role);
        const statusBadge = getStatusBadge(user.status);

        const row = document.createElement("tr");
        row.id = `user-row-${user.id}`;
        row.className = "transition hover:bg-gray-50";
        row.innerHTML = `
            <td class="px-3 py-4 text-center text-sm font-semibold text-gray-900">${user.first_name} ${user.last_name}</td>
            <td class="px-3 py-4 text-center text-sm text-gray-700">${user.email}</td>
            <td class="px-3 py-4 text-center">${roleBadge}</td>
            <td class="whitespace-nowrap px-3 py-4 text-center text-sm text-gray-700">${createdDate}</td>
            <td class="px-3 py-4 text-center">${statusBadge}</td>
            <td class="whitespace-nowrap px-3 py-4 text-center">
                <div class="flex items-center justify-center gap-2">
                    <button type="button" data-id="${user.id}" class="view-user-btn rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 hover:text-slate-900">View</button>
                    <button type="button" data-id="${user.id}" class="edit-user-btn rounded-md border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-200">Edit</button>
                    <button type="button" data-id="${user.id}" class="delete-user-btn rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-red-700">Delete</button>
                </div>
            </td>
        `;

        noUsers?.remove();
        userTableBody.appendChild(row);

        addUserForm.reset();
        addUserModal.classList.add("hidden");
        window.location.reload();
    } catch (error) {
        console.error(error);
    }
});

editForms.forEach((form) => {
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

            if (!response.ok) {
                console.error(data);
                return;
            }

            const user = data.user;
            const createdDate = new Date(user.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            });

            const roleBadge = getRoleBadge(user.role);
            const statusBadge = getStatusBadge(user.status);

            const row = document.getElementById(`user-row-${user.id}`);
            if (row) {
                row.innerHTML = `
                    <td class="px-3 py-4 text-center text-sm font-semibold text-gray-900">${user.first_name} ${user.last_name}</td>
                    <td class="px-3 py-4 text-center text-sm text-gray-700">${user.email}</td>
                    <td class="px-3 py-4 text-center">${roleBadge}</td>
                    <td class="whitespace-nowrap px-3 py-4 text-center text-sm text-gray-700">${createdDate}</td>
                    <td class="px-3 py-4 text-center">${statusBadge}</td>
                    <td class="whitespace-nowrap px-3 py-4 text-center">
                        <div class="flex items-center justify-center gap-2">
                            <button type="button" data-id="${user.id}" class="view-user-btn rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 hover:text-slate-900">View</button>
                            <button type="button" data-id="${user.id}" class="edit-user-btn rounded-md border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-200">Edit</button>
                            <button type="button" data-id="${user.id}" class="delete-user-btn rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-red-700">Delete</button>
                        </div>
                    </td>
                `;
            }

            document.getElementById(`edit-user-modal-${user.id}`).classList.add("hidden");
            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    });
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
            const userId = event.target.id.replace("delete-user-form-", "");
            const errorMessage = document.getElementById(`delete-user-error-${userId}`);

            if (!response.ok) {
                errorMessage.textContent = data.message;
                errorMessage.classList.remove("hidden");
                return;
            }

            document.getElementById(`user-row-${userId}`)?.remove();
            document.getElementById(`user-card-${userId}`)?.remove();

            document.getElementById(`delete-user-modal-${userId}`).classList.add("hidden");
            errorMessage.classList.add("hidden");
            errorMessage.textContent = "";
        } catch (error) {
            console.error(error);
        }
    });
});

function getRoleBadge(role) {
    if (role === "admin") {
        return `<span class="inline-flex rounded-full bg-purple-100 px-2.5 py-1 text-xs font-semibold text-purple-700">Admin</span>`;
    }

    if (role === "manager") {
        return `<span class="inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">Manager</span>`;
    }

    return `<span class="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700">Employee</span>`;
}

function getStatusBadge(status) {
    if (status === "active") {
        return `<span class="inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">Active</span>`;
    }

    return `<span class="inline-flex rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">Inactive</span>`;
}
