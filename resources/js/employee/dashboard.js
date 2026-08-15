document.addEventListener('DOMContentLoaded', function () {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

    // Generic Request Submitter
    async function handleFormSubmit(formId, successCallback) {
        const form = document.getElementById(formId);
        if (!form) return;

        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            const formData = new FormData(form);
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.disabled = true;

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': csrfToken,
                        'Accept': 'application/json'
                    },
                    body: formData
                });

                const data = await response.json();

                if (response.ok) {
                    form.reset();
                    if (typeof successCallback === 'function') {
                        successCallback(data);
                    }
                } else {
                    alert(data.message || 'Something went wrong. Please check your inputs.');
                }
            } catch (error) {
                console.error('Request error:', error);
            } finally {
                submitBtn.disabled = false;
            }
        });
    }

    // Attach to Leave Form
    handleFormSubmit('leave-request-form', (data) => {
        // Increment pending leave counter
        const pendingCounter = document.getElementById('pending-leave-count');
        if (pendingCounter) {
            pendingCounter.textContent = parseInt(pendingCounter.textContent || 0) + 1;
        }
    });

    // Attach to Overtime Form
    handleFormSubmit('overtime-request-form', (data) => {
        // Increment pending overtime counter
        const pendingCounter = document.getElementById('pending-overtime-count');
        if (pendingCounter) {
            pendingCounter.textContent = parseInt(pendingCounter.textContent || 0) + 1;
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const forms = ['#time-in-form', '#time-out-form'];

    forms.forEach(selector => {
        const form = document.querySelector(selector);
        if (!form) return;

        form.addEventListener('submit', async function (e) {
            e.preventDefault(); // Stop standard form submission/redirect

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: new FormData(form),
                    headers: {
                        'Accept': 'application/json',
                    }
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    window.location.reload(); // Reload page to update Blade view state
                } else {
                    alert(data.message || 'Something went wrong.');
                }
            } catch (error) {
                console.error(error);
                alert('An error occurred. Please try again.');
            }
        });
    });
});
