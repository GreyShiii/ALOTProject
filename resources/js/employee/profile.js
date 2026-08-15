import { showToast } from "./employees";
document.querySelectorAll(".profile-success-toast").forEach((toast) => {
    setTimeout(() => {
        toast.remove();
    }, 3000);
})

document.addEventListener("DOMContentLoaded", function () {
    const passwordButtons = document.querySelectorAll(".password-toggle");

    passwordButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const targetId = button.dataset.target;
            const input = document.getElementById(targetId);

            if (input.type === "password") {
                input.type = "text";
                button.textContent = "Hide";
            } else {
                input.type = "password";
                button.textContent = "Show";
            }
        });
    });
});
