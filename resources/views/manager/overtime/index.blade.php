@extends('layouts.app')

@section('title', 'Overtime Requests')
@section('breadcrumb-parent', 'Manager')
@section('breadcrumb-current', 'Overtime Requests')

@section('content')

    {{-- =====================================================
        PAGE HEADER
    ===================================================== --}}

    <div class="mb-6">

        <h1 class="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
            Overtime Requests
        </h1>

        <p class="mt-1 text-sm text-gray-500">
            Review overtime requests from your assigned employees.
        </p>

    </div>


    {{-- =====================================================
        REQUESTS CARD
    ===================================================== --}}

    <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

        {{-- HEADER --}}
        <div class="border-b border-gray-200 px-5 py-4">

            <h2 class="text-lg font-semibold text-gray-900">
                Team Overtime Requests
            </h2>

            <p class="mt-1 text-sm text-gray-500">
                Approve or reject pending overtime requests.
            </p>

        </div>


        {{-- =================================================
            FILTERS
        ================================================== --}}

        <div class="border-b border-gray-200 bg-gray-50 px-5 py-4">

            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">

                {{-- SEARCH --}}
                <div>

                    <label
                        for="manager-overtime-search"
                        class="text-xs font-semibold uppercase tracking-wide text-gray-500"
                    >
                        Search
                    </label>

                    <input
                        type="text"
                        id="manager-overtime-search"
                        placeholder="Search employee, reason..."
                        class="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >

                </div>


                {{-- STATUS --}}
                <div>

                    <label
                        for="manager-overtime-status"
                        class="text-xs font-semibold uppercase tracking-wide text-gray-500"
                    >
                        Status
                    </label>

                    <select
                        id="manager-overtime-status"
                        class="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >

                        <option value="">
                            All Status
                        </option>

                        <option value="pending">
                            Pending
                        </option>

                        <option value="approved">
                            Approved
                        </option>

                        <option value="rejected">
                            Rejected
                        </option>

                    </select>

                </div>


                {{-- DATE --}}
                <div>

                    <label
                        for="manager-overtime-date"
                        class="text-xs font-semibold uppercase tracking-wide text-gray-500"
                    >
                        Date
                    </label>

                    <input
                        type="date"
                        id="manager-overtime-date"
                        class="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >

                </div>

            </div>

        </div>


        {{-- =================================================
            DESKTOP TABLE
        ================================================== --}}

        <div class="hidden overflow-x-auto md:block">

            <table class="min-w-full divide-y divide-gray-200">

                <thead class="bg-gray-50">

                    <tr>

                        <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Employee
                        </th>

                        <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Date
                        </th>

                        <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Hours
                        </th>

                        <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Reason
                        </th>

                        <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Status
                        </th>

                        <th class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Action
                        </th>

                    </tr>

                </thead>


                <tbody
                    id="manager-overtime-table-body"
                    class="divide-y divide-gray-200 bg-white"
                ></tbody>

            </table>

        </div>


        {{-- =================================================
            MOBILE
        ================================================== --}}

        <div
            id="manager-overtime-card-list"
            class="divide-y divide-gray-200 md:hidden"
        ></div>


        {{-- =================================================
            EMPTY
        ================================================== --}}

        <div
            id="manager-overtime-empty"
            class="hidden px-6 py-12 text-center"
        >

            <p class="text-sm font-semibold text-gray-700">
                No overtime requests found.
            </p>

            <p class="mt-1 text-xs text-gray-500">
                Try changing your filters.
            </p>

        </div>

    </div>


    {{-- =====================================================
        REVIEW MODAL
    ===================================================== --}}

    <div
        id="manager-overtime-modal"
        class="fixed inset-0 z-50 hidden items-center justify-center bg-black/50 px-4"
    >

        <div class="w-full max-w-xl rounded-xl bg-white shadow-xl">

            {{-- HEADER --}}
            <div class="flex items-start justify-between border-b border-gray-200 px-6 py-5">

                <div>

                    <h2 class="text-lg font-semibold text-gray-900">
                        Overtime Request
                    </h2>

                    <p class="mt-1 text-sm text-gray-500">
                        Review the employee's overtime request.
                    </p>

                </div>


                <button
                    type="button"
                    id="close-manager-overtime-modal"
                    class="flex h-10 w-10 items-center justify-center rounded-full border border-teal-300 text-teal-500 transition hover:bg-teal-50"
                    aria-label="Close"
                >
                    &times;
                </button>

            </div>


            {{-- BODY --}}
            <div class="space-y-5 px-6 py-5">

                <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">

                    {{-- EMPLOYEE --}}
                    <div>

                        <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Employee
                        </p>

                        <p
                            id="review-overtime-employee"
                            class="mt-1 text-sm font-semibold text-gray-900"
                        >
                            —
                        </p>

                    </div>


                    {{-- DEPARTMENT --}}
                    <div>

                        <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Department
                        </p>

                        <p
                            id="review-overtime-department"
                            class="mt-1 text-sm text-gray-900"
                        >
                            —
                        </p>

                    </div>


                    {{-- POSITION --}}
                    <div>

                        <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Position
                        </p>

                        <p
                            id="review-overtime-position"
                            class="mt-1 text-sm text-gray-900"
                        >
                            —
                        </p>

                    </div>


                    {{-- DATE --}}
                    <div>

                        <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Overtime Date
                        </p>

                        <p
                            id="review-overtime-date"
                            class="mt-1 text-sm text-gray-900"
                        >
                            —
                        </p>

                    </div>


                    {{-- HOURS --}}
                    <div>

                        <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Hours
                        </p>

                        <p
                            id="review-overtime-hours"
                            class="mt-1 text-sm font-medium text-gray-900"
                        >
                            —
                        </p>

                    </div>


                    {{-- SUBMITTED --}}
                    <div>

                        <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Submitted
                        </p>

                        <p
                            id="review-overtime-submitted"
                            class="mt-1 text-sm text-gray-900"
                        >
                            —
                        </p>

                    </div>


                    {{-- STATUS --}}
                    <div>

                        <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Status
                        </p>

                        <div
                            id="review-overtime-status"
                            class="mt-1"
                        >
                            —
                        </div>

                    </div>

                </div>


                {{-- =================================================
                    REASON
                ================================================== --}}

                <div>

                    <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Reason
                    </p>

                    <div
                        id="review-overtime-reason"
                        class="mt-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700"
                    >
                        —
                    </div>

                </div>


                {{-- =================================================
                    ERROR
                ================================================== --}}

                <div
                    id="manager-overtime-error"
                    class="hidden rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                ></div>


                {{-- =================================================
                    REJECTION AREA
                ================================================== --}}

                <div
                    id="overtime-reject-section"
                    class="hidden"
                >

                    <label
                        for="overtime-rejection-reason"
                        class="text-xs font-semibold uppercase tracking-wide text-gray-500"
                    >
                        Rejection Reason
                    </label>

                    <textarea
                        id="overtime-rejection-reason"
                        rows="4"
                        placeholder="Explain why this request is being rejected..."
                        class="mt-2 w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    ></textarea>

                </div>

            </div>


            {{-- =================================================
                FOOTER
            ================================================== --}}

            <div
                class="flex flex-col-reverse gap-2 border-t border-gray-200 px-6 py-4 sm:flex-row sm:justify-end"
            >

                {{-- CLOSE --}}
                <button
                    type="button"
                    id="close-manager-overtime-footer"
                    class="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                    Close
                </button>


                {{-- CANCEL REJECT --}}
                <button
                    type="button"
                    id="cancel-reject-overtime-btn"
                    class="hidden rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                    Cancel Reject
                </button>


                {{-- REJECT --}}
                <button
                    type="button"
                    id="reject-overtime-btn"
                    class="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                    Reject
                </button>


                {{-- CONFIRM REJECT --}}
                <button
                    type="button"
                    id="confirm-reject-overtime-btn"
                    class="hidden rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    Reject Request
                </button>


                {{-- APPROVE --}}
                <button
                    type="button"
                    id="approve-overtime-btn"
                    class="rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    Approve
                </button>

            </div>

        </div>

    </div>


    @vite('resources/js/manager/overtime.js')

@endsection
