@extends('layouts.app')

@section('title', 'Attendance Management')
@section('breadcrumb-parent', 'Management')
@section('breadcrumb-current', 'Attendance')

@section('content')

    <div class="space-y-6">

        {{-- =====================================================
            PAGE HEADER
        ===================================================== --}}

        <div>

            <h1 class="text-2xl font-bold text-gray-900">
                Attendance Management
            </h1>

            <p class="mt-1 text-sm text-gray-500">
                Attendance records for all employees in the organization.
            </p>

        </div>


        {{-- =====================================================
            ATTENDANCE CARD
        ===================================================== --}}

        <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

            {{-- =================================================
                CARD HEADER
            ================================================== --}}

            <div class="border-b border-gray-200 px-5 py-4">

                <h2 class="text-lg font-semibold text-gray-900">
                    Attendance Records
                </h2>

                <p class="mt-1 text-sm text-gray-500">
                    Search and filter employee attendance records.
                </p>

            </div>


            {{-- =================================================
                FILTERS
            ================================================== --}}

            <div class="border-b border-gray-200 bg-gray-50 px-5 py-4">

                <div class="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">

                    {{-- SEARCH --}}
                    <div>

                        <label
                            for="attendance-search"
                            class="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500"
                        >
                            Employee
                        </label>

                        <input
                            type="text"
                            id="attendance-search"
                            placeholder="Search employee or email"
                            class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        >

                    </div>


                    {{-- DEPARTMENT --}}
                    <div>

                        <label
                            for="attendance-department"
                            class="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500"
                        >
                            Department
                        </label>

                        <select
                            id="attendance-department"
                            class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        >

                            <option value="">
                                All departments
                            </option>

                            @foreach ($departments as $department)

                                <option value="{{ $department->id }}">
                                    {{ $department->name }}
                                </option>

                            @endforeach

                        </select>

                    </div>


                    {{-- DATE --}}
                    <div>

                        <label
                            for="attendance-date"
                            class="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500"
                        >
                            Date
                        </label>

                        <input
                            type="date"
                            id="attendance-date"
                            class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        >

                    </div>


                    {{-- STATUS --}}
                    <div>

                        <label
                            for="attendance-status"
                            class="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500"
                        >
                            Status
                        </label>

                        <select
                            id="attendance-status"
                            class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        >

                            <option value="">
                                All statuses
                            </option>

                            <option value="completed">
                                Completed
                            </option>

                            <option value="working">
                                Working
                            </option>

                            <option value="not_started">
                                Not Started
                            </option>

                        </select>

                    </div>

                </div>
            </div>


            {{-- =================================================
                TABLE
            ================================================== --}}

            <div class="overflow-x-auto">

                <table class="min-w-[950px] w-full divide-y divide-gray-200">

                    <thead class="bg-gray-50">

                        <tr>

                            <th class="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Employee
                            </th>

                            <th class="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Department
                            </th>

                            <th class="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Date
                            </th>

                            <th class="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Time In
                            </th>

                            <th class="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Time Out
                            </th>

                            <th class="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Total Hours
                            </th>

                            <th class="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Status
                            </th>

                        </tr>

                    </thead>


                    <tbody
                        id="attendance-table-body"
                        class="divide-y divide-gray-200 bg-white"
                    ></tbody>

                </table>

            </div>


            {{-- =================================================
                EMPTY STATE
            ================================================== --}}

            <div
                id="attendance-empty"
                class="hidden px-5 py-10 text-center"
            >

                <p class="text-sm font-semibold text-gray-700">
                    No attendance records found.
                </p>

                <p class="mt-1 text-sm text-gray-500">
                    Try changing your search or filters.
                </p>

            </div>


            {{-- =================================================
                LOADING
            ================================================== --}}

            <div
                id="attendance-loading"
                class="hidden px-5 py-10 text-center"
            >

                <p class="text-sm text-gray-500">
                    Loading attendance records...
                </p>

            </div>


            {{-- =================================================
                PAGINATION
            ================================================== --}}

            <div
                id="attendance-pagination"
                class="hidden border-t border-gray-200 px-5 py-4"
            ></div>

        </div>

    </div>


    @vite('resources/js/admin/attendance.js')

@endsection
