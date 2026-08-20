const searchInput =
    document.getElementById(
        "attendance-search",
    )

const departmentFilter =
    document.getElementById(
        "attendance-department",
    )

const dateFilter =
    document.getElementById(
        "attendance-date",
    )

const statusFilter =
    document.getElementById(
        "attendance-status",
    )

const tableBody =
    document.getElementById(
        "attendance-table-body",
    )

const emptyMessage =
    document.getElementById(
        "attendance-empty",
    )

const loadingMessage =
    document.getElementById(
        "attendance-loading",
    )

const paginationContainer =
    document.getElementById(
        "attendance-pagination",
    )


// =====================================================
// CHECK REQUIRED ELEMENTS
// =====================================================

if (
    !searchInput ||
    !departmentFilter ||
    !dateFilter ||
    !statusFilter ||
    !tableBody ||
    !emptyMessage ||
    !loadingMessage ||
    !paginationContainer
) {

    console.error(
        "ADMIN ATTENDANCE ERROR: Required HTML elements were not found.",
    )

} else {

    let currentPage = 1


    // =====================================================
    // FORMAT DATE
    // =====================================================

    function formatDate(
        date,
    ) {

        if (!date) {
            return "—"
        }


        return new Date(date)
            .toLocaleDateString(
                "en-US",
                {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                },
            )
    }


    // =====================================================
    // FORMAT TIME
    // =====================================================

    function formatTime(
        datetime,
    ) {

        if (!datetime) {
            return "—"
        }


        return new Date(datetime)
            .toLocaleTimeString(
                "en-US",
                {
                    hour: "numeric",
                    minute: "2-digit",
                },
            )
    }


    // =====================================================
    // CALCULATE TOTAL HOURS
    // =====================================================

    function calculateTotalHours(
        timeIn,
        timeOut,
    ) {

        if (
            !timeIn ||
            !timeOut
        ) {

            return "—"
        }


        const start =
            new Date(timeIn)

        const end =
            new Date(timeOut)


        const totalMinutes =
            Math.floor(
                (
                    end - start
                ) /
                    (1000 * 60),
            )


        if (
            totalMinutes < 0
        ) {

            return "—"
        }


        const hours =
            Math.floor(
                totalMinutes / 60,
            )


        const minutes =
            totalMinutes % 60


        return `${hours}h ${String(
            minutes,
        ).padStart(2, "0")}m`
    }


    // =====================================================
    // GET ATTENDANCE STATUS
    // =====================================================

    function getAttendanceStatus(
        attendance,
    ) {

        if (
            attendance.time_in &&
            attendance.time_out
        ) {

            return "completed"
        }


        if (
            attendance.time_in &&
            !attendance.time_out
        ) {

            return "working"
        }


        return "not_started"
    }


    // =====================================================
    // STATUS BADGE
    // =====================================================

    function statusBadge(
        attendance,
    ) {

        const status =
            getAttendanceStatus(
                attendance,
            )


        if (
            status ===
            "completed"
        ) {

            return `
                <span class="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">

                    <span class="h-1.5 w-1.5 rounded-full bg-green-500"></span>

                    Completed

                </span>
            `
        }


        if (
            status ===
            "working"
        ) {

            return `
                <span class="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-700">

                    <span class="h-1.5 w-1.5 rounded-full bg-cyan-500"></span>

                    Working

                </span>
            `
        }


        return `
            <span class="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">

                <span class="h-1.5 w-1.5 rounded-full bg-gray-400"></span>

                Not Started

            </span>
        `
    }


    // =====================================================
    // CREATE TABLE ROW
    // =====================================================

    function createAttendanceRow(
        attendance,
    ) {

        const employee =
            attendance.employee

        const user =
            employee?.user

        const department =
            employee?.department


        const employeeName =
            user
                ? `${user.first_name} ${user.last_name}`
                : "Unknown Employee"


        const row =
            document.createElement(
                "tr",
            )


        row.className =
            "transition hover:bg-gray-50"


        row.innerHTML = `
            <td class="px-5 py-3 text-sm font-medium text-gray-900">

                <div>

                    <p class="font-medium">
                        ${employeeName}
                    </p>

                    <p class="mt-1 text-xs text-gray-500">
                        ${user?.email || "—"}
                    </p>

                </div>

            </td>


            <td class="px-5 py-3 text-sm text-gray-700">
                ${department?.name || "—"}
            </td>


            <td class="whitespace-nowrap px-5 py-3 text-sm text-gray-700">
                ${formatDate(
                    attendance.date,
                )}
            </td>


            <td class="whitespace-nowrap px-5 py-3 text-sm text-gray-700">
                ${formatTime(
                    attendance.time_in,
                )}
            </td>


            <td class="whitespace-nowrap px-5 py-3 text-sm text-gray-700">
                ${formatTime(
                    attendance.time_out,
                )}
            </td>


            <td class="whitespace-nowrap px-5 py-3 text-sm text-gray-700">
                ${calculateTotalHours(
                    attendance.time_in,
                    attendance.time_out,
                )}
            </td>


            <td class="px-5 py-3">
                ${statusBadge(
                    attendance,
                )}
            </td>
        `


        return row
    }


    // =====================================================
    // RENDER TABLE
    // =====================================================

    function renderAttendance(
        attendances,
    ) {

        tableBody.innerHTML = ""


        if (
            attendances.length === 0
        ) {

            emptyMessage.classList.remove(
                "hidden",
            )

            return
        }


        emptyMessage.classList.add(
            "hidden",
        )


        attendances.forEach(
            (
                attendance,
            ) => {

                tableBody.appendChild(
                    createAttendanceRow(
                        attendance,
                    ),
                )
            },
        )
    }


    // =====================================================
    // RENDER PAGINATION
    // =====================================================

    function renderPagination(
        pagination,
    ) {

        paginationContainer.innerHTML = ""


        if (
            !pagination ||
            pagination.last_page <= 1
        ) {

            paginationContainer.classList.add(
                "hidden",
            )

            return
        }


        paginationContainer.classList.remove(
            "hidden",
        )


        const wrapper =
            document.createElement(
                "div",
            )


        wrapper.className =
            "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"


        const info =
            document.createElement(
                "p",
            )


        const first =
            (
                (
                    pagination.current_page -
                    1
                ) *
                    pagination.per_page
            ) + 1


        const last =
            Math.min(
                pagination.current_page *
                    pagination.per_page,
                pagination.total,
            )


        info.className =
            "text-sm text-gray-500"


        info.textContent =
            `${first}-${last} of ${pagination.total}`


        const buttons =
            document.createElement(
                "div",
            )


        buttons.className =
            "flex items-center gap-2"


        // Previous
        const previousButton =
            document.createElement(
                "button",
            )


        previousButton.type =
            "button"

        previousButton.textContent =
            "Previous"


        previousButton.className =
            "rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"


        previousButton.disabled =
            pagination.current_page <= 1


        previousButton.addEventListener(
            "click",
            () => {

                loadAttendance(
                    pagination.current_page -
                        1,
                )
            },
        )


        // Page
        const pageText =
            document.createElement(
                "span",
            )


        pageText.className =
            "px-2 text-sm text-gray-600"


        pageText.textContent =
            `${pagination.current_page} / ${pagination.last_page}`


        // Next
        const nextButton =
            document.createElement(
                "button",
            )


        nextButton.type =
            "button"

        nextButton.textContent =
            "Next"


        nextButton.className =
            "rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"


        nextButton.disabled =
            pagination.current_page >=
            pagination.last_page


        nextButton.addEventListener(
            "click",
            () => {

                loadAttendance(
                    pagination.current_page +
                        1,
                )
            },
        )


        buttons.appendChild(
            previousButton,
        )

        buttons.appendChild(
            pageText,
        )

        buttons.appendChild(
            nextButton,
        )


        wrapper.appendChild(
            info,
        )

        wrapper.appendChild(
            buttons,
        )


        paginationContainer.appendChild(
            wrapper,
        )
    }


    // =====================================================
    // LOAD ATTENDANCE
    // =====================================================

    async function loadAttendance(
        page = 1,
    ) {

        currentPage =
            page


        loadingMessage.classList.remove(
            "hidden",
        )


        emptyMessage.classList.add(
            "hidden",
        )


        try {

            const params =
                new URLSearchParams()


            const search =
                searchInput.value.trim()


            const department =
                departmentFilter.value


            const date =
                dateFilter.value


            const status =
                statusFilter.value


            if (
                search !== ""
            ) {

                params.set(
                    "search",
                    search,
                )
            }


            if (
                department !== ""
            ) {

                params.set(
                    "department",
                    department,
                )
            }


            if (
                date !== ""
            ) {

                params.set(
                    "date",
                    date,
                )
            }


            if (
                status !== ""
            ) {

                params.set(
                    "status",
                    status,
                )
            }


            params.set(
                "page",
                page,
            )


            const response =
                await fetch(
                    `/admin/attendance/data?${params.toString()}`,
                    {
                        headers: {
                            Accept:
                                "application/json",
                        },
                    },
                )


            if (
                !response.ok
            ) {

                const errorText =
                    await response.text()

                console.error(
                    "ADMIN ATTENDANCE API ERROR:",
                    response.status,
                    errorText,
                )

                return
            }


            const data =
                await response.json()


            if (
                !data.success
            ) {

                console.error(
                    "ADMIN ATTENDANCE API RETURNED AN ERROR:",
                    data,
                )

                return
            }


            renderAttendance(
                data.attendances || [],
            )


            renderPagination(
                data.pagination,
            )

        } catch (
            error
        ) {

            console.error(
                "LOAD ADMIN ATTENDANCE ERROR:",
                error,
            )

        } finally {

            loadingMessage.classList.add(
                "hidden",
            )
        }
    }


    // =====================================================
    // FILTER EVENTS
    // =====================================================

    let searchTimeout


    searchInput.addEventListener(
        "input",
        () => {

            clearTimeout(
                searchTimeout,
            )


            searchTimeout =
                setTimeout(
                    () => {

                        loadAttendance(
                            1,
                        )

                    },
                    300,
                )
        },
    )


    departmentFilter.addEventListener(
        "change",
        () => {

            loadAttendance(
                1,
            )
        },
    )


    dateFilter.addEventListener(
        "change",
        () => {

            loadAttendance(
                1,
            )
        },
    )


    statusFilter.addEventListener(
        "change",
        () => {

            loadAttendance(
                1,
            )
        },
    )

    // =====================================================
    // INITIAL LOAD
    // =====================================================

    loadAttendance()
}
