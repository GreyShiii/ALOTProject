@extends('layouts.app')

@section('title', 'Leave Requests')
@section('breadcrumb-parent', 'Manager')
@section('breadcrumb-current', 'Leave Requests')

@section('content')

    <div class="mb-6">

        <h1 class="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
            Leave Requests
        </h1>

        <p class="mt-1 text-sm text-gray-500">
            Review leave requests from your assigned employees.
        </p>

    </div>


    <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

        <div class="border-b border-gray-200 px-5 py-4">

            <h2 class="text-lg font-semibold text-gray-900">
                Team Leave Requests
            </h2>

            <p class="mt-1 text-sm text-gray-500">
                Approve or reject pending requests from your team.
            </p>

        </div>


        <div class="border-b border-gray-200 bg-gray-50 px-5 py-4">

            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">

                <div>

                    <label for="manager-leave-search" class="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Search
                    </label>

                    <input type="text" id="manager-leave-search" placeholder="Search employee, leave type..."
                        class="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500">

                </div>


                <div>

                    <label for="manager-leave-status" class="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Status
                    </label>

                    <select id="manager-leave-status"
                        class="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500">

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


                <div>

                    <label for="manager-leave-date" class="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Date
                    </label>

                    <input type="date" id="manager-leave-date"
                        class="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500">

                </div>

            </div>

        </div>


        <div class="hidden overflow-x-auto md:block">

            <table class="w-full table-fixed divide-y divide-gray-200">

                <colgroup>
                    <col class="w-[24%]">
                    <col class="w-[14%]">
                    <col class="w-[18%]">
                    <col class="w-[14%]">
                    <col class="w-[14%]">
                    <col class="w-[16%]">
                </colgroup>


                <thead class="bg-gray-50">

                    <tr>

                        <th class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Employee
                        </th>

                        <th class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Leave Type
                        </th>

                        <th class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Date
                        </th>

                        <th class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Submitted
                        </th>

                        <th class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Status
                        </th>

                        <th class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Action
                        </th>

                    </tr>

                </thead>


                <tbody id="manager-leave-table-body" class="divide-y divide-gray-200 bg-white"></tbody>

            </table>

        </div>


        <div id="manager-leave-card-list" class="divide-y divide-gray-200 md:hidden"></div>


        <div id="manager-leave-empty" class="hidden px-6 py-12 text-center">

            <p class="text-sm font-semibold text-gray-700">
                No leave requests found.
            </p>

            <p class="mt-1 text-xs text-gray-500">
                Try changing your filters.
            </p>

        </div>


        <div id="manager-leave-pagination" class="border-t border-gray-200 bg-white"></div>

    </div>


    <div id="manager-leave-modal" class="fixed inset-0 z-50 hidden items-center justify-center bg-black/50 px-4">

        <div class="w-full max-w-xl rounded-xl bg-white shadow-xl">

            <div class="flex items-start justify-between border-b border-gray-200 px-6 py-5">

                <div>

                    <h2 class="text-lg font-semibold text-gray-900">
                        Leave Request
                    </h2>

                    <p class="mt-1 text-sm text-gray-500">
                        Review the employee's leave request.
                    </p>

                </div>


                <button type="button" id="close-manager-leave-modal"
                    class="flex h-10 w-10 items-center justify-center rounded-full border border-teal-300 text-teal-500 transition hover:bg-teal-50">
                    &times;
                </button>

            </div>


            <div class="space-y-5 px-6 py-5">

                <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">

                    <div>

                        <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Employee
                        </p>

                        <p id="review-employee" class="mt-1 text-sm font-semibold text-gray-900">
                            —
                        </p>

                    </div>


                    <div>

                        <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Department
                        </p>

                        <p id="review-department" class="mt-1 text-sm text-gray-900">
                            —
                        </p>

                    </div>


                    <div>

                        <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Position
                        </p>

                        <p id="review-position" class="mt-1 text-sm text-gray-900">
                            —
                        </p>

                    </div>


                    <div>

                        <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Leave Type
                        </p>

                        <p id="review-leave-type" class="mt-1 text-sm font-medium text-gray-900">
                            —
                        </p>

                    </div>


                    <div>

                        <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Start Date
                        </p>

                        <p id="review-start-date" class="mt-1 text-sm text-gray-900">
                            —
                        </p>

                    </div>


                    <div>

                        <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            End Date
                        </p>

                        <p id="review-end-date" class="mt-1 text-sm text-gray-900">
                            —
                        </p>

                    </div>


                    <div>

                        <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Submitted
                        </p>

                        <p id="review-submitted" class="mt-1 text-sm text-gray-900">
                            —
                        </p>

                    </div>


                    <div>

                        <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Status
                        </p>

                        <div id="review-status" class="mt-1">
                            —
                        </div>

                    </div>

                </div>


                <div>

                    <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Reason
                    </p>

                    <div id="review-reason"
                        class="mt-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
                        —
                    </div>

                </div>


                <div id="manager-leave-error"
                    class="hidden rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"></div>


                <div id="reject-section" class="hidden">

                    <label for="rejection-reason" class="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Rejection Reason
                    </label>

                    <textarea id="rejection-reason" rows="4" placeholder="Explain why this request is being rejected..."
                        class="mt-2 w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500"></textarea>

                </div>

            </div>


            <div id="manager-leave-actions"
                class="flex flex-col-reverse gap-2 border-t border-gray-200 px-6 py-4 sm:flex-row sm:justify-end">

                <button type="button" id="close-manager-leave-footer"
                    class="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
                    Close
                </button>


                <button type="button" id="cancel-reject-leave-btn"
                    class="hidden rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
                    Cancel Reject
                </button>


                <button type="button" id="reject-leave-btn"
                    class="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700">
                    Reject
                </button>


                <button type="button" id="confirm-reject-leave-btn"
                    class="hidden rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700">
                    Reject Request
                </button>


                <button type="button" id="approve-leave-btn"
                    class="rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700">
                    Approve
                </button>

            </div>

        </div>

    </div>


    @vite('resources/js/manager/leave.js')

@endsection
