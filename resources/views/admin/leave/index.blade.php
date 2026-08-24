@extends('layouts.app')

@section('title', 'Leave Requests')
@section('breadcrumb-parent', 'Management')
@section('breadcrumb-current', 'Leave Requests')

@section('content')

    <div class="mb-6">
        <h1 class="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
            Leave Requests
        </h1>

        <p class="mt-1 text-sm text-gray-500">
            Monitor leave requests across the organization.
        </p>
    </div>

    <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

        <div class="border-b border-gray-200 px-4 py-4 sm:px-6 sm:py-5">
            <h2 class="text-lg font-semibold text-gray-900">
                All Leave Requests
            </h2>

            <p class="mt-1 text-sm text-gray-500">
                View employee leave requests and their current status.
            </p>
        </div>

        <div class="flex flex-col gap-3 border-b border-gray-200 px-4 py-4 sm:flex-row sm:items-center sm:px-6">

            <div class="relative flex-1">
                <svg
                    class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="1.8"
                >
                    <circle
                        cx="11"
                        cy="11"
                        r="7"
                    />

                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m20 20-4-4"
                    />
                </svg>

                <input
                    type="text"
                    id="leave-search"
                    placeholder="Search employee, type or reason..."
                    class="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
            </div>

            <select
                id="leave-status-filter"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:w-48"
            >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
            </select>

            <select
                id="leave-department-filter"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:w-48"
            >
                <option value="">All Departments</option>

                @foreach ($departments as $department)
                    <option value="{{ $department->id }}">
                        {{ $department->name }}
                    </option>
                @endforeach
            </select>

            <input
                type="date"
                id="leave-date-filter"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:w-48"
            >
        </div>

        <div class="hidden overflow-x-auto md:block">
            <table class="w-full table-fixed divide-y divide-gray-200">

                <colgroup>
                    <col class="w-[18%]">
                    <col class="w-[12%]">
                    <col class="w-[12%]">
                    <col class="w-[18%]">
                    <col class="w-[8%]">
                    <col class="w-[12%]">
                    <col class="w-[10%]">
                    <col class="w-[10%]">
                </colgroup>

                <thead class="bg-gray-50">
                    <tr>
                        <th class="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Employee
                        </th>

                        <th class="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Department
                        </th>

                        <th class="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Leave Type
                        </th>

                        <th class="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Date / Range
                        </th>

                        <th class="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Days
                        </th>

                        <th class="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Submitted
                        </th>

                        <th class="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Status
                        </th>

                        <th class="whitespace-nowrap px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Actions
                        </th>
                    </tr>
                </thead>

                <tbody
                    id="leave-table-body"
                    class="divide-y divide-gray-200 bg-white"
                ></tbody>
            </table>
        </div>

        <div
            id="leave-card-list"
            class="divide-y divide-gray-200 md:hidden"
        ></div>

        <div
            id="no-leave-results"
            class="hidden px-6 py-12 text-center"
        >
            <p class="text-sm font-semibold text-gray-700">
                No leave requests found.
            </p>

            <p class="mt-1 text-xs text-gray-500">
                Try changing your search or filters.
            </p>
        </div>

        <div
            id="leave-pagination"
            class="border-t border-gray-200 bg-white"
        ></div>
    </div>

    <div
        id="leave-details-modal"
        class="fixed inset-0 z-50 hidden items-center justify-center bg-black/50 px-4"
    >
        <div class="w-full max-w-xl rounded-xl bg-white shadow-xl">

            <div class="flex items-start justify-between border-b border-gray-200 px-6 py-5">
                <div>
                    <h2 class="text-lg font-semibold text-gray-900">
                        Leave Request Details
                    </h2>

                    <p class="mt-1 text-sm text-gray-500">
                        Complete information for this request.
                    </p>
                </div>

                <button
                    type="button"
                    id="close-leave-details"
                    class="flex h-10 w-10 items-center justify-center rounded-full border border-teal-300 text-teal-500 transition hover:bg-teal-50"
                    aria-label="Close"
                >
                    <svg
                        class="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M6 6l12 12M18 6L6 18"
                        />
                    </svg>
                </button>
            </div>

            <div class="space-y-5 px-6 py-5">
                <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">

                    <div>
                        <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Employee
                        </p>

                        <p
                            id="detail-employee"
                            class="mt-1 text-sm font-medium text-gray-900"
                        >
                            —
                        </p>
                    </div>

                    <div>
                        <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Department
                        </p>

                        <p
                            id="detail-department"
                            class="mt-1 text-sm text-gray-900"
                        >
                            —
                        </p>
                    </div>

                    <div>
                        <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Position
                        </p>

                        <p
                            id="detail-position"
                            class="mt-1 text-sm text-gray-900"
                        >
                            —
                        </p>
                    </div>

                    <div>
                        <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Leave Type
                        </p>

                        <p
                            id="detail-leave-type"
                            class="mt-1 text-sm font-medium text-gray-900"
                        >
                            —
                        </p>
                    </div>

                    <div>
                        <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Start Date
                        </p>

                        <p
                            id="detail-start-date"
                            class="mt-1 text-sm text-gray-900"
                        >
                            —
                        </p>
                    </div>

                    <div>
                        <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            End Date
                        </p>

                        <p
                            id="detail-end-date"
                            class="mt-1 text-sm text-gray-900"
                        >
                            —
                        </p>
                    </div>

                    <div>
                        <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Number of Days
                        </p>

                        <p
                            id="detail-days"
                            class="mt-1 text-sm text-gray-900"
                        >
                            —
                        </p>
                    </div>

                    <div>
                        <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Submitted
                        </p>

                        <p
                            id="detail-submitted"
                            class="mt-1 text-sm text-gray-900"
                        >
                            —
                        </p>
                    </div>

                    <div>
                        <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Status
                        </p>

                        <div
                            id="detail-status"
                            class="mt-1"
                        >
                            —
                        </div>
                    </div>

                    <div>
                        <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Approved / Reviewed By
                        </p>

                        <p
                            id="detail-approver"
                            class="mt-1 text-sm text-gray-900"
                        >
                            —
                        </p>
                    </div>
                </div>

                <div>
                    <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Reason
                    </p>

                    <div
                        id="detail-reason"
                        class="mt-2 break-words rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700"
                    >
                        —
                    </div>
                </div>

                <div
                    id="detail-rejection-container"
                    class="hidden"
                >
                    <p class="text-xs font-semibold uppercase tracking-wide text-red-600">
                        Rejection Reason
                    </p>

                    <div
                        id="detail-rejection"
                        class="mt-2 break-words rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
                    >
                        —
                    </div>
                </div>
            </div>

            <div class="flex justify-end border-t border-gray-200 px-6 py-4">
                <button
                    type="button"
                    id="close-leave-details-footer"
                    class="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                    Close
                </button>
            </div>
        </div>
    </div>

    @vite('resources/js/admin/leave.js')

@endsection
