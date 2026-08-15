document.addEventListener('DOMContentLoaded', function () {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
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
