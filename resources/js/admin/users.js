const editForms = document.querySelectorAll(".edit-user-form");
const deactivateForms = document.querySelectorAll(".deactivate-user-form");
const activateForms = document.querySelectorAll(".activate-user-form");


// =====================================================
// VIEW / EDIT / ACTIVATE / DEACTIVATE BUTTONS
// =====================================================

document.addEventListener("click", (event) => {

    const button = event.target;


    // =================================================
    // VIEW
    // =================================================

    if (button.classList.contains("view-user-btn")) {

        const userId = button.dataset.id;

        const modal = document.getElementById(
            `view-user-modal-${userId}`
        );

        if (modal) {
            modal.classList.remove("hidden");
        }

    }


    // =================================================
    // EDIT
    // =================================================

    if (button.classList.contains("edit-user-btn")) {

        const userId = button.dataset.id;

        const modal = document.getElementById(
            `edit-user-modal-${userId}`
        );

        if (modal) {
            modal.classList.remove("hidden");
        }

    }


    // =================================================
    // DEACTIVATE
    // =================================================

    if (button.classList.contains("deactivate-user-btn")) {

        const userId = button.dataset.id;

        const modal = document.getElementById(
            `deactivate-user-modal-${userId}`
        );

        if (modal) {
            modal.classList.remove("hidden");
        }

    }


    // =================================================
    // ACTIVATE
    // =================================================

    if (button.classList.contains("activate-user-btn")) {

        const userId = button.dataset.id;

        const modal = document.getElementById(
            `activate-user-modal-${userId}`
        );

        if (modal) {
            modal.classList.remove("hidden");
        }

    }

});


// =====================================================
// EDIT USER
// =====================================================

editForms.forEach((form) => {

    form.addEventListener("submit", async (event) => {

        event.preventDefault();

        try {

            const formData = new FormData(form);

            const response = await fetch(form.action, {
                method: "POST",
                body: formData,
                headers: {
                    Accept: "application/json",
                },
            });

            const data = await response.json();

            if (!response.ok) {

                console.error(
                    "UPDATE USER ERROR:",
                    data
                );

                return;
            }

            const user = data.user;

            updateUserRow(user);
            updateUserCard(user);

            const modal = document.getElementById(
                `edit-user-modal-${user.id}`
            );

            if (modal) {
                modal.classList.add("hidden");
            }

        } catch (error) {

            console.error(
                "EDIT USER ERROR:",
                error
            );

        }

    });

});


// =====================================================
// DEACTIVATE USER
// =====================================================

deactivateForms.forEach((form) => {

    form.addEventListener("submit", async (event) => {

        event.preventDefault();

        try {

            const formData = new FormData(form);

            const response = await fetch(form.action, {
                method: "POST",
                body: formData,
                headers: {
                    Accept: "application/json",
                },
            });

            const data = await response.json();

            const userId = form.id.replace(
                "deactivate-user-form-",
                ""
            );

            const errorMessage = document.getElementById(
                `deactivate-user-error-${userId}`
            );

            if (!response.ok) {

                if (errorMessage) {

                    errorMessage.textContent =
                        data.message ||
                        "Unable to deactivate user.";

                    errorMessage.classList.remove("hidden");
                }

                return;
            }

            const user = data.user;

            // Update desktop table
            updateUserRow(user);

            // Update mobile card
            updateUserCard(user);

            // Close deactivate modal
            const modal = document.getElementById(
                `deactivate-user-modal-${userId}`
            );

            if (modal) {
                modal.classList.add("hidden");
            }

            // Clear error
            if (errorMessage) {

                errorMessage.textContent = "";

                errorMessage.classList.add("hidden");
            }

        } catch (error) {

            console.error(
                "DEACTIVATE USER ERROR:",
                error
            );

        }

    });

});


// =====================================================
// ACTIVATE USER
// =====================================================

activateForms.forEach((form) => {

    form.addEventListener("submit", async (event) => {

        event.preventDefault();

        try {

            const formData = new FormData(form);

            const response = await fetch(form.action, {
                method: "POST",
                body: formData,
                headers: {
                    Accept: "application/json",
                },
            });

            const data = await response.json();

            const userId = form.id.replace(
                "activate-user-form-",
                ""
            );

            const errorMessage = document.getElementById(
                `activate-user-error-${userId}`
            );

            if (!response.ok) {

                if (errorMessage) {

                    errorMessage.textContent =
                        data.message ||
                        "Unable to activate user.";

                    errorMessage.classList.remove("hidden");
                }

                return;
            }

            const user = data.user;

            // Update desktop table
            updateUserRow(user);

            // Update mobile card
            updateUserCard(user);

            // Close activate modal
            const modal = document.getElementById(
                `activate-user-modal-${userId}`
            );

            if (modal) {
                modal.classList.add("hidden");
            }

            // Clear error
            if (errorMessage) {

                errorMessage.textContent = "";

                errorMessage.classList.add("hidden");
            }

        } catch (error) {

            console.error(
                "ACTIVATE USER ERROR:",
                error
            );

        }

    });

});


// =====================================================
// UPDATE DESKTOP ROW
// =====================================================

function updateUserRow(user) {

    const row = document.getElementById(
        `user-row-${user.id}`
    );

    if (!row) {
        return;
    }


    // Name
    row.children[0].textContent =
        `${user.first_name} ${user.last_name}`;


    // Email
    row.children[1].textContent =
        user.email;


    // Role
    updateRoleBadge(
        row.children[2],
        user.role
    );


    // Created date
    row.children[3].textContent =
        formatDate(user.created_at);


    // Status
    updateStatusBadge(
        row.children[4],
        user.status
    );


    // Action button
    updateActionButton(
        row.children[5],
        user
    );

}


// =====================================================
// UPDATE MOBILE CARD
// =====================================================

function updateUserCard(user) {

    const card = document.getElementById(
        `user-card-${user.id}`
    );

    if (!card) {
        return;
    }


    // Name
    const nameElement = card.querySelector(
        "[data-user-name]"
    );

    if (nameElement) {

        nameElement.textContent =
            `${user.first_name} ${user.last_name}`;

    }


    // Email
    const emailElement = card.querySelector(
        "[data-user-email]"
    );

    if (emailElement) {

        emailElement.textContent =
            user.email;

    }


    // Role
    const roleElement = card.querySelector(
        "[data-user-role]"
    );

    if (roleElement) {

        updateRoleElement(
            roleElement,
            user.role
        );

    }


    // Status
    const statusElement = card.querySelector(
        "[data-user-status]"
    );

    if (statusElement) {

        updateStatusElement(
            statusElement,
            user.status
        );

    }


    // Action button
    updateMobileActionButton(
        card,
        user
    );

}


// =====================================================
// UPDATE ROLE BADGE
// =====================================================

function updateRoleBadge(cell, role) {

    const badge = cell.querySelector(
        "[data-user-role]"
    );

    if (!badge) {
        return;
    }

    updateRoleElement(
        badge,
        role
    );

}


// =====================================================
// UPDATE ROLE
// =====================================================

function updateRoleElement(element, role) {

    element.textContent =
        capitalize(role);


    element.classList.remove(
        "bg-purple-100",
        "text-purple-700",
        "bg-blue-100",
        "text-blue-700",
        "bg-gray-100",
        "text-gray-700"
    );


    if (role === "admin") {

        element.classList.add(
            "bg-purple-100",
            "text-purple-700"
        );

    } else if (role === "manager") {

        element.classList.add(
            "bg-blue-100",
            "text-blue-700"
        );

    } else {

        element.classList.add(
            "bg-gray-100",
            "text-gray-700"
        );

    }

}


// =====================================================
// UPDATE STATUS BADGE
// =====================================================

function updateStatusBadge(cell, status) {

    const badge = cell.querySelector(
        "[data-user-status]"
    );

    if (!badge) {
        return;
    }

    updateStatusElement(
        badge,
        status
    );

}


// =====================================================
// UPDATE STATUS
// =====================================================

function updateStatusElement(element, status) {

    element.textContent =
        capitalize(status);


    element.classList.remove(
        "bg-green-100",
        "text-green-700",
        "bg-red-100",
        "text-red-700"
    );


    if (status === "active") {

        element.classList.add(
            "bg-green-100",
            "text-green-700"
        );

    } else {

        element.classList.add(
            "bg-red-100",
            "text-red-700"
        );

    }

}


// =====================================================
// UPDATE DESKTOP ACTION BUTTON
// =====================================================

function updateActionButton(cell, user) {

    const oldButton = cell.querySelector(
        ".activate-user-btn, .deactivate-user-btn"
    );

    if (!oldButton) {
        return;
    }


    const newButton =
        document.createElement("button");


    newButton.type = "button";

    newButton.dataset.id =
        user.id;


    if (user.status === "active") {

        newButton.className =
            "deactivate-user-btn w-[84px] rounded-md bg-amber-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-amber-700"

        newButton.textContent =
            "Deactivate";

    } else {

        newButton.className =
            "activate-user-btn w-[84px] rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-green-700";

        newButton.textContent =
            "Activate";

    }


    oldButton.replaceWith(
        newButton
    );

}


// =====================================================
// UPDATE MOBILE ACTION BUTTON
// =====================================================

function updateMobileActionButton(card, user) {

    const oldButton = card.querySelector(
        ".activate-user-btn, .deactivate-user-btn"
    );

    if (!oldButton) {
        return;
    }


    const newButton =
        document.createElement("button");


    newButton.type = "button";

    newButton.dataset.id =
        user.id;


    if (user.status === "active") {

        newButton.className =
            "deactivate-user-btn flex-1 rounded-md bg-amber-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-amber-700";

        newButton.textContent =
            "Deactivate";

    } else {

        newButton.className =
            "activate-user-btn flex-1 rounded-md bg-green-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-green-700";

        newButton.textContent =
            "Activate";

    }


    oldButton.replaceWith(
        newButton
    );

}


// =====================================================
// DATE FORMAT
// =====================================================

function formatDate(date) {

    return new Date(date).toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric",
        }
    );

}


// =====================================================
// CAPITALIZE
// =====================================================

function capitalize(value) {

    return value.charAt(0).toUpperCase()
        + value.slice(1);

}
