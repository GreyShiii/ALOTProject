document.addEventListener("DOMContentLoaded", () => {

    // =====================================================
    // ELEMENTS
    // =====================================================

    const personalForm =
        document.querySelector(
            'form[data-profile-form="personal"]'
        )

    const passwordForm =
        document.querySelector(
            'form[data-profile-form="password"]'
        )


    // =====================================================
    // TOAST
    // =====================================================

    function showToast(message, type = "success") {

        const existingToast =
            document.querySelector(
                ".profile-toast"
            )

        if (existingToast) {
            existingToast.remove()
        }


        const toast =
            document.createElement("div")

        toast.className =
            type === "success"
                ? "profile-toast fixed right-4 top-4 z-50 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-2.5 shadow-sm"
                : "profile-toast fixed right-4 top-4 z-50 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 shadow-sm"


        if (type === "success") {

            toast.innerHTML = `
                <span class="flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
                    <svg
                        class="h-3 w-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.5"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </span>

                <span class="text-sm font-medium text-green-700">
                    ${message}
                </span>
            `

        } else {

            toast.innerHTML = `
                <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500">
                    <svg
                        class="h-3 w-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.5"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M6 6l12 12M18 6L6 18"
                        />
                    </svg>
                </span>

                <span class="text-sm font-medium text-red-700">
                    ${message}
                </span>
            `
        }


        document.body.appendChild(toast)


        setTimeout(() => {

            toast.remove()

        }, 3000)
    }


    // =====================================================
    // VALIDATION ERRORS
    // =====================================================

    function getFirstError(data) {

        if (
            data.errors
        ) {

            const firstError =
                Object.values(
                    data.errors
                )[0]

            if (firstError) {
                return firstError[0]
            }
        }


        return data.message ||
            "Something went wrong."
    }


    // =====================================================
    // PERSONAL INFORMATION
    // =====================================================

    if (personalForm) {

        personalForm.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault()


                const formData =
                    new FormData(
                        personalForm
                    )


                try {

                    const response =
                        await fetch(
                            personalForm.action,
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


                    if (!response.ok) {

                        showToast(
                            getFirstError(
                                data
                            ),
                            "error"
                        )

                        return
                    }


                    // Update displayed name
                    const fullName =
                        `${data.user.first_name} ${data.user.last_name}`


                    const nameElements =
                        document.querySelectorAll(
                            "[data-profile-name]"
                        )


                    nameElements.forEach(
                        (element) => {
                            element.textContent =
                                fullName
                        }
                    )


                    // Update avatar initials
                    const initials =
                        `${data.user.first_name.charAt(0)}${data.user.last_name.charAt(0)}`
                            .toUpperCase()


                    const avatar =
                        document.querySelector(
                            "[data-profile-avatar]"
                        )


                    if (avatar) {
                        avatar.textContent =
                            initials
                    }


                    // Update email
                    const emailElements =
                        document.querySelectorAll(
                            "[data-profile-email]"
                        )


                    emailElements.forEach(
                        (element) => {
                            element.textContent =
                                data.user.email
                        }
                    )


                    showToast(
                        data.message ||
                        "Profile updated successfully!",
                    )

                } catch (error) {

                    console.error(
                        "PROFILE UPDATE ERROR:",
                        error
                    )

                    showToast(
                        "Something went wrong. Please try again.",
                        "error"
                    )
                }
            }
        )
    }


    // =====================================================
    // PASSWORD
    // =====================================================

    if (passwordForm) {

        passwordForm.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault()


                const formData =
                    new FormData(
                        passwordForm
                    )


                try {

                    const response =
                        await fetch(
                            passwordForm.action,
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


                    if (!response.ok) {

                        showToast(
                            getFirstError(
                                data
                            ),
                            "error"
                        )

                        return
                    }


                    passwordForm.reset()


                    showToast(
                        data.message ||
                        "Password updated successfully!",
                    )

                } catch (error) {

                    console.error(
                        "PASSWORD UPDATE ERROR:",
                        error
                    )

                    showToast(
                        "Something went wrong. Please try again.",
                        "error"
                    )
                }
            }
        )
    }


    // =====================================================
    // PASSWORD TOGGLE
    // =====================================================

    const passwordButtons =
        document.querySelectorAll(
            ".password-toggle"
        )


    passwordButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    const targetId =
                        button.dataset.target

                    const input =
                        document.getElementById(
                            targetId
                        )


                    if (!input) {
                        return
                    }


                    if (
                        input.type ===
                        "password"
                    ) {

                        input.type = "text"

                        button.textContent =
                            "Hide"

                    } else {

                        input.type = "password"

                        button.textContent =
                            "Show"
                    }
                }
            )
        }
    )
})
