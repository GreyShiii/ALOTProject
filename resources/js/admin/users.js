const editForms =
    document.querySelectorAll(".edit-user-form")

const deactivateForms =
    document.querySelectorAll(".deactivate-user-form")

const activateForms =
    document.querySelectorAll(".activate-user-form")

const userTableBody =
    document.getElementById("user-table-body")

const userCardList =
    document.getElementById("user-card-list")

const userSearch =
    document.getElementById("user-search")

const roleFilter =
    document.getElementById("filter-role")

const statusFilter =
    document.getElementById("filter-status")

const userPagination =
    document.getElementById("user-pagination")

const USERS_PER_PAGE =
    10

let currentUserPage =
    1


document.addEventListener(
    "click",
    (event) => {

        const button =
            event.target.closest("button")

        if (
            !button
        ) {

            return
        }


        if (
            button.classList.contains(
                "view-user-btn"
            )
        ) {

            const userId =
                button.dataset.id

            const modal =
                document.getElementById(
                    `view-user-modal-${userId}`
                )

            if (
                modal
            ) {

                modal.classList.remove(
                    "hidden"
                )
            }
        }


        if (
            button.classList.contains(
                "edit-user-btn"
            )
        ) {

            const userId =
                button.dataset.id

            const modal =
                document.getElementById(
                    `edit-user-modal-${userId}`
                )

            if (
                modal
            ) {

                modal.classList.remove(
                    "hidden"
                )
            }
        }


        if (
            button.classList.contains(
                "deactivate-user-btn"
            )
        ) {

            const userId =
                button.dataset.id

            const modal =
                document.getElementById(
                    `deactivate-user-modal-${userId}`
                )

            if (
                modal
            ) {

                modal.classList.remove(
                    "hidden"
                )
            }
        }


        if (
            button.classList.contains(
                "activate-user-btn"
            )
        ) {

            const userId =
                button.dataset.id

            const modal =
                document.getElementById(
                    `activate-user-modal-${userId}`
                )

            if (
                modal
            ) {

                modal.classList.remove(
                    "hidden"
                )
            }
        }
    }
)


editForms.forEach(
    (form) => {

        form.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault()


                try {

                    const formData =
                        new FormData(
                            form
                        )


                    const response =
                        await fetch(
                            form.action,
                            {
                                method: "POST",
                                body: formData,
                                headers: {
                                    Accept:
                                        "application/json",
                                },
                            }
                        )


                    const data =
                        await response.json()


                    if (
                        !response.ok
                    ) {

                        console.error(
                            "UPDATE USER ERROR:",
                            data
                        )

                        return
                    }


                    const user =
                        data.user


                    updateUserRow(
                        user
                    )

                    updateUserCard(
                        user
                    )


                    const modal =
                        document.getElementById(
                            `edit-user-modal-${user.id}`
                        )


                    if (
                        modal
                    ) {

                        modal.classList.add(
                            "hidden"
                        )
                    }


                    filterUsers(
                        currentUserPage
                    )

                } catch (
                    error
                ) {

                    console.error(
                        "EDIT USER ERROR:",
                        error
                    )
                }
            }
        )
    }
)


deactivateForms.forEach(
    (form) => {

        form.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault()


                try {

                    const formData =
                        new FormData(
                            form
                        )


                    const response =
                        await fetch(
                            form.action,
                            {
                                method: "POST",
                                body: formData,
                                headers: {
                                    Accept:
                                        "application/json",
                                },
                            }
                        )


                    const data =
                        await response.json()


                    const userId =
                        form.id.replace(
                            "deactivate-user-form-",
                            ""
                        )


                    const errorMessage =
                        document.getElementById(
                            `deactivate-user-error-${userId}`
                        )


                    if (
                        !response.ok
                    ) {

                        if (
                            errorMessage
                        ) {

                            errorMessage.textContent =
                                data.message ||
                                "Unable to deactivate user."

                            errorMessage.classList.remove(
                                "hidden"
                            )
                        }

                        return
                    }


                    const user =
                        data.user


                    updateUserRow(
                        user
                    )

                    updateUserCard(
                        user
                    )


                    const modal =
                        document.getElementById(
                            `deactivate-user-modal-${userId}`
                        )


                    if (
                        modal
                    ) {

                        modal.classList.add(
                            "hidden"
                        )
                    }


                    if (
                        errorMessage
                    ) {

                        errorMessage.textContent =
                            ""

                        errorMessage.classList.add(
                            "hidden"
                        )
                    }


                    filterUsers(
                        currentUserPage
                    )

                } catch (
                    error
                ) {

                    console.error(
                        "DEACTIVATE USER ERROR:",
                        error
                    )
                }
            }
        )
    }
)


activateForms.forEach(
    (form) => {

        form.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault()


                try {

                    const formData =
                        new FormData(
                            form
                        )


                    const response =
                        await fetch(
                            form.action,
                            {
                                method: "POST",
                                body: formData,
                                headers: {
                                    Accept:
                                        "application/json",
                                },
                            }
                        )


                    const data =
                        await response.json()


                    const userId =
                        form.id.replace(
                            "activate-user-form-",
                            ""
                        )


                    const errorMessage =
                        document.getElementById(
                            `activate-user-error-${userId}`
                        )


                    if (
                        !response.ok
                    ) {

                        if (
                            errorMessage
                        ) {

                            errorMessage.textContent =
                                data.message ||
                                "Unable to activate user."

                            errorMessage.classList.remove(
                                "hidden"
                            )
                        }

                        return
                    }


                    const user =
                        data.user


                    updateUserRow(
                        user
                    )

                    updateUserCard(
                        user
                    )


                    const modal =
                        document.getElementById(
                            `activate-user-modal-${userId}`
                        )


                    if (
                        modal
                    ) {

                        modal.classList.add(
                            "hidden"
                        )
                    }


                    if (
                        errorMessage
                    ) {

                        errorMessage.textContent =
                            ""

                        errorMessage.classList.add(
                            "hidden"
                        )
                    }


                    filterUsers(
                        currentUserPage
                    )

                } catch (
                    error
                ) {

                    console.error(
                        "ACTIVATE USER ERROR:",
                        error
                    )
                }
            }
        )
    }
)


function updateUserRow(
    user
) {

    const row =
        document.getElementById(
            `user-row-${user.id}`
        )


    if (
        !row
    ) {

        return
    }


    row.dataset.role =
        user.role

    row.dataset.status =
        user.status


    row.children[0].textContent =
        `${user.first_name} ${user.last_name}`

    row.children[1].textContent =
        user.email


    updateRoleBadge(
        row.children[2],
        user.role
    )


    row.children[3].textContent =
        formatDate(
            user.created_at
        )


    updateStatusBadge(
        row.children[4],
        user.status
    )


    updateActionButton(
        row.children[5],
        user
    )
}


function updateUserCard(
    user
) {

    const card =
        document.getElementById(
            `user-card-${user.id}`
        )


    if (
        !card
    ) {

        return
    }


    card.dataset.role =
        user.role

    card.dataset.status =
        user.status


    const nameElement =
        card.querySelector(
            "[data-user-name]"
        )


    if (
        nameElement
    ) {

        nameElement.textContent =
            `${user.first_name} ${user.last_name}`
    }


    const emailElement =
        card.querySelector(
            "[data-user-email]"
        )


    if (
        emailElement
    ) {

        emailElement.textContent =
            user.email
    }


    const roleElement =
        card.querySelector(
            "[data-user-role]"
        )


    if (
        roleElement
    ) {

        updateRoleElement(
            roleElement,
            user.role
        )
    }


    const statusElement =
        card.querySelector(
            "[data-user-status]"
        )


    if (
        statusElement
    ) {

        updateStatusElement(
            statusElement,
            user.status
        )
    }


    updateMobileActionButton(
        card,
        user
    )
}


function updateRoleBadge(
    cell,
    role
) {

    const badge =
        cell.querySelector(
            "[data-user-role]"
        )


    if (
        !badge
    ) {

        return
    }


    updateRoleElement(
        badge,
        role
    )
}


function updateRoleElement(
    element,
    role
) {

    element.textContent =
        capitalize(
            role
        )


    element.classList.remove(
        "bg-purple-100",
        "text-purple-700",
        "bg-blue-100",
        "text-blue-700",
        "bg-gray-100",
        "text-gray-700"
    )


    if (
        role === "admin"
    ) {

        element.classList.add(
            "bg-purple-100",
            "text-purple-700"
        )

    } else if (
        role === "manager"
    ) {

        element.classList.add(
            "bg-blue-100",
            "text-blue-700"
        )

    } else {

        element.classList.add(
            "bg-gray-100",
            "text-gray-700"
        )
    }
}


function updateStatusBadge(
    cell,
    status
) {

    const badge =
        cell.querySelector(
            "[data-user-status]"
        )


    if (
        !badge
    ) {

        return
    }


    updateStatusElement(
        badge,
        status
    )
}


function updateStatusElement(
    element,
    status
) {

    element.textContent =
        capitalize(
            status
        )


    element.classList.remove(
        "bg-green-100",
        "text-green-700",
        "bg-red-100",
        "text-red-700"
    )


    if (
        status ===
        "active"
    ) {

        element.classList.add(
            "bg-green-100",
            "text-green-700"
        )

    } else {

        element.classList.add(
            "bg-red-100",
            "text-red-700"
        )
    }
}


function updateActionButton(
    cell,
    user
) {

    const oldButton =
        cell.querySelector(
            ".activate-user-btn, .deactivate-user-btn"
        )


    if (
        !oldButton
    ) {

        return
    }


    const newButton =
        document.createElement(
            "button"
        )


    newButton.type =
        "button"

    newButton.dataset.id =
        user.id


    if (
        user.status ===
        "active"
    ) {

        newButton.className =
            "deactivate-user-btn w-[84px] rounded-md bg-amber-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-amber-700"

        newButton.textContent =
            "Deactivate"

    } else {

        newButton.className =
            "activate-user-btn w-[84px] rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-green-700"

        newButton.textContent =
            "Activate"
    }


    oldButton.replaceWith(
        newButton
    )
}


function updateMobileActionButton(
    card,
    user
) {

    const oldButton =
        card.querySelector(
            ".activate-user-btn, .deactivate-user-btn"
        )


    if (
        !oldButton
    ) {

        return
    }


    const newButton =
        document.createElement(
            "button"
        )


    newButton.type =
        "button"

    newButton.dataset.id =
        user.id


    if (
        user.status ===
        "active"
    ) {

        newButton.className =
            "deactivate-user-btn flex-1 rounded-md bg-amber-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-amber-700"

        newButton.textContent =
            "Deactivate"

    } else {

        newButton.className =
            "activate-user-btn flex-1 rounded-md bg-green-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-green-700"

        newButton.textContent =
            "Activate"
    }


    oldButton.replaceWith(
        newButton
    )
}


function filterUsers(
    page = 1
) {

    const searchValue =
        userSearch.value
            .toLowerCase()
            .trim()


    const roleValue =
        roleFilter.value
            .toLowerCase()
            .trim()


    const statusValue =
        statusFilter.value
            .toLowerCase()
            .trim()


    const rows =
        userTableBody.querySelectorAll(
            "tr:not(#no-users):not(#no-filter-results)"
        )


    const matchingRows = []


    rows.forEach(
        (row) => {

            const rowText =
                row.textContent
                    .toLowerCase()


            const matchesSearch =
                rowText.includes(
                    searchValue
                )


            const matchesRole =
                roleValue === "" ||
                row.dataset.role ===
                    roleValue


            const matchesStatus =
                statusValue === "" ||
                row.dataset.status ===
                    statusValue


            const shouldShow =
                matchesSearch &&
                matchesRole &&
                matchesStatus


            if (
                shouldShow
            ) {

                matchingRows.push(
                    row
                )

            } else {

                row.classList.add(
                    "hidden"
                )
            }
        }
    )


    const cards =
        userCardList
            ? userCardList.querySelectorAll(
                "[id^='user-card-']"
            )
            : []


    const matchingCards = []


    cards.forEach(
        (card) => {

            const cardText =
                card.textContent
                    .toLowerCase()


            const matchesSearch =
                cardText.includes(
                    searchValue
                )


            const matchesRole =
                roleValue === "" ||
                card.dataset.role ===
                    roleValue


            const matchesStatus =
                statusValue === "" ||
                card.dataset.status ===
                    statusValue


            const shouldShow =
                matchesSearch &&
                matchesRole &&
                matchesStatus


            if (
                shouldShow
            ) {

                matchingCards.push(
                    card
                )

            } else {

                card.classList.add(
                    "hidden"
                )
            }
        }
    )


    const totalUsers =
        matchingRows.length


    const totalPages =
        Math.ceil(
            totalUsers /
                USERS_PER_PAGE
        )


    if (
        totalPages === 0
    ) {

        currentUserPage =
            1

    } else if (
        page > totalPages
    ) {

        currentUserPage =
            totalPages

    } else if (
        page < 1
    ) {

        currentUserPage =
            1

    } else {

        currentUserPage =
            page
    }


    const startIndex =
        (
            currentUserPage -
            1
        ) *
            USERS_PER_PAGE


    const endIndex =
        startIndex +
        USERS_PER_PAGE


    matchingRows.forEach(
        (
            row,
            index
        ) => {

            if (
                index >= startIndex &&
                index < endIndex
            ) {

                row.classList.remove(
                    "hidden"
                )

            } else {

                row.classList.add(
                    "hidden"
                )
            }
        }
    )


    matchingCards.forEach(
        (
            card,
            index
        ) => {

            if (
                index >= startIndex &&
                index < endIndex
            ) {

                card.classList.remove(
                    "hidden"
                )

            } else {

                card.classList.add(
                    "hidden"
                )
            }
        }
    )


    let noResults =
        document.getElementById(
            "no-filter-results"
        )


    if (
        totalUsers === 0 &&
        rows.length > 0
    ) {

        if (
            !noResults
        ) {

            noResults =
                document.createElement(
                    "tr"
                )


            noResults.id =
                "no-filter-results"


            noResults.innerHTML =
                `
                    <td
                        colspan="6"
                        class="px-6 py-12 text-center text-sm text-gray-500"
                    >
                        No users match your filters.
                    </td>
                `


            userTableBody.appendChild(
                noResults
            )
        }

    } else if (
        noResults
    ) {

        noResults.remove()
    }


    renderUserPagination(
        totalUsers,
        totalPages
    )
}


function renderUserPagination(
    totalUsers,
    totalPages
) {

    if (
        !userPagination
    ) {

        return
    }


    userPagination.innerHTML =
        ""


    if (
        totalUsers <=
        USERS_PER_PAGE
    ) {

        userPagination.classList.add(
            "hidden"
        )

        return
    }


    userPagination.classList.remove(
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
            currentUserPage *
                USERS_PER_PAGE,
            totalUsers
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
                ${totalUsers}
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
        currentUserPage <= 1


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

            filterUsers(
                currentUserPage -
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
            currentUserPage
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

                filterUsers(
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
        currentUserPage >=
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

            filterUsers(
                currentUserPage +
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


    userPagination.appendChild(
        wrapper
    )
}


userSearch.addEventListener(
    "input",
    () => {

        filterUsers(
            1
        )
    }
)

roleFilter.addEventListener(
    "change",
    () => {

        filterUsers(
            1
        )
    }
)

statusFilter.addEventListener(
    "change",
    () => {

        filterUsers(
            1
        )
    }
)


filterUsers(
    1
)


function formatDate(
    date
) {

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


function capitalize(
    value
) {

    return value.charAt(0).toUpperCase() +
        value.slice(1)
}
