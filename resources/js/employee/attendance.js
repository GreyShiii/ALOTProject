const attendanceResults = document.getElementById("attendance-results");

const searchInput = document.getElementById("attendance-search");

const dateFilter = document.getElementById("attendance-date");

const statusFilter = document.getElementById("attendance-status");

let searchTimeout;

async function loadAttendance(page = 1) {
    const params = new URLSearchParams();

    const search = searchInput.value.trim();

    const date = dateFilter.value;

    const status = statusFilter.value;

    if (search !== "") {
        params.set("search", search);
    }

    if (date !== "") {
        params.set("date", date);
    }

    if (status !== "") {
        params.set("status", status);
    }

    params.set("page", page);

    try {
        attendanceResults.classList.add("opacity-50", "pointer-events-none");

        const response = await fetch(
            `${window.location.pathname}?${params.toString()}`,
            {
                headers: {
                    "X-Requested-With": "XMLHttpRequest",

                    Accept: "text/html",
                },
            },
        );

        if (!response.ok) {
            console.error("ATTENDANCE LOAD ERROR:", response.status);

            return;
        }

        const html = await response.text();

        attendanceResults.innerHTML = html;

        window.history.replaceState(
            {},
            "",
            `${window.location.pathname}?${params.toString()}`,
        );
    } catch (error) {
        console.error("EMPLOYEE ATTENDANCE ERROR:", error);
    } finally {
        attendanceResults.classList.remove("opacity-50", "pointer-events-none");
    }
}

searchInput.addEventListener("input", () => {
    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(() => {
        loadAttendance(1);
    }, 300);
});

dateFilter.addEventListener("change", () => {
    loadAttendance(1);
});

statusFilter.addEventListener("change", () => {
    loadAttendance(1);
});

attendanceResults.addEventListener("click", (event) => {
    const link = event.target.closest("a");

    if (!link) {
        return;
    }

    const url = new URL(link.href, window.location.origin);

    if (url.searchParams.has("page")) {
        event.preventDefault();

        loadAttendance(url.searchParams.get("page"));
    }
});
