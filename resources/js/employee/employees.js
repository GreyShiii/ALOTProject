const attendanceSearch = document.getElementById("attendance-search");
const attendanceDate = document.getElementById("attendance-date");
const attendanceStatus = document.getElementById("attendance-status");
const attendanceResults = document.getElementById("attendance-results");


let attendanceSearchTimeout;


async function filterAttendance() {

    const search = attendanceSearch.value;
    const date = attendanceDate.value;
    const status = attendanceStatus.value;


    const params = new URLSearchParams();

    if (search) {
        params.append("search", search);
    }

    if (date) {
        params.append("date", date);
    }

    if (status) {
        params.append("status", status);
    }


    try {

        const response = await fetch(
            `/employee/attendance?${params.toString()}`,
            {
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    "Accept": "text/html",
                },
            }
        );


        if (!response.ok) {
            throw new Error("Failed to filter attendance.");
        }


        const html = await response.text();

        attendanceResults.innerHTML = html;


    } catch (error) {

        console.error(error);

    }

}


attendanceSearch?.addEventListener("input", () => {

    clearTimeout(attendanceSearchTimeout);

    attendanceSearchTimeout = setTimeout(() => {
        filterAttendance();
    }, 300);

});


attendanceDate?.addEventListener("change", () => {

    filterAttendance();

});


attendanceStatus?.addEventListener("change", () => {

    filterAttendance();

});
