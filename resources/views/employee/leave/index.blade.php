@extends('layouts.app')


@section('title', 'My Leave')

@section('breadcrumb-parent', 'Employee')

@section('breadcrumb-current', 'My Leave')


@section('content')


{{-- =====================================================
    SUMMARY CARDS
===================================================== --}}

<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">


    {{-- Pending --}}

    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

        <div class="flex items-start justify-between">

            <p class="text-sm font-medium text-gray-500">
                Pending Leave
            </p>

            <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">

                <svg
                    class="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                    viewBox="0 0 24 24"
                >
                    <rect
                        x="3"
                        y="5"
                        width="18"
                        height="16"
                        rx="2"
                    />

                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M3 9h18M8 3v4M16 3v4"
                    />
                </svg>

            </div>

        </div>

        <p class="mt-3 text-3xl font-bold text-gray-900">
            {{ $pendingCount }}
        </p>

        <p class="mt-2 text-xs text-gray-500">
            Awaiting review
        </p>

    </div>


    {{-- Approved --}}

    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

        <div class="flex items-start justify-between">

            <p class="text-sm font-medium text-gray-500">
                Approved Leave
            </p>

            <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-green-600">

                <svg
                    class="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M5 12l4 4L19 6"
                    />
                </svg>

            </div>

        </div>

        <p class="mt-3 text-3xl font-bold text-gray-900">
            {{ $approvedCount }}
        </p>

        <p class="mt-2 text-xs text-gray-500">
            Approved requests
        </p>

    </div>


    {{-- Rejected --}}

    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

        <div class="flex items-start justify-between">

            <p class="text-sm font-medium text-gray-500">
                Rejected Leave
            </p>

            <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600">

                <svg
                    class="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M6 6l12 12M18 6L6 18"
                    />
                </svg>

            </div>

        </div>

        <p class="mt-3 text-3xl font-bold text-gray-900">
            {{ $rejectedCount }}
        </p>

        <p class="mt-2 text-xs text-gray-500">
            Rejected requests
        </p>

    </div>


    {{-- Total --}}

    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

        <div class="flex items-start justify-between">

            <p class="text-sm font-medium text-gray-500">
                Total Requests
            </p>

            <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">

                <svg
                    class="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                    viewBox="0 0 24 24"
                >
                    <rect
                        x="3"
                        y="4"
                        width="18"
                        height="17"
                        rx="2"
                    />

                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M8 2v4M16 2v4M3 9h18"
                    />
                </svg>

            </div>

        </div>

        <p class="mt-3 text-3xl font-bold text-gray-900">
            {{ $totalCount }}
        </p>

        <p class="mt-2 text-xs text-gray-500">
            All leave requests
        </p>

    </div>

</div>



{{-- =====================================================
    LEAVE REQUESTS
===================================================== --}}

<div class="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">


    {{-- Header --}}

    <div class="border-b border-gray-200 px-5 py-4">

        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>

                <h2 class="text-lg font-semibold text-gray-900">
                    My Leave Requests
                </h2>

                <p class="mt-1 text-sm text-gray-500">
                    View your submitted leave requests and their current status.
                </p>

            </div>


            <button
                type="button"
                id="open-leave-modal"
                class="rounded-lg bg-[#11458c] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
                + Request Leave
            </button>

        </div>

    </div>



    {{-- =================================================
        FILTERS
    ================================================= --}}

    <div class="border-b border-gray-200 bg-gray-50 px-5 py-4">

        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">


            {{-- Search --}}

            <div>

                <label
                    for="leave-search"
                    class="text-xs font-semibold uppercase tracking-wide text-gray-500"
                >
                    Search
                </label>

                <div class="relative mt-2">

                    <svg
                        class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.8"
                        viewBox="0 0 24 24"
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
                        placeholder="Search leave type or reason..."
                        class="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >

                </div>

            </div>



            {{-- Status --}}

            <div>

                <label
                    for="leave-status-filter"
                    class="text-xs font-semibold uppercase tracking-wide text-gray-500"
                >
                    Status
                </label>

                <select
                    id="leave-status-filter"
                    class="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >

                    <option value="">
                        All Status
                    </option>

                    <option value="Pending">
                        Pending
                    </option>

                    <option value="Approved">
                        Approved
                    </option>

                    <option value="Rejected">
                        Rejected
                    </option>

                </select>

            </div>

        </div>

    </div>



    {{-- =================================================
        TABLE
    ================================================= --}}

    <div class="overflow-x-auto">

        <table class="min-w-full divide-y divide-gray-200">

            <thead class="bg-gray-50">

                <tr>

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
                        Reason
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
            >

                @forelse ($leaveRequests as $leave)

                    @php

                        $days =
                            $leave->start_date
                                ->diffInDays($leave->end_date)
                            + 1;

                    @endphp


                    <tr
                        class="leave-row"
                        data-search="{{ strtolower($leave->leave_type . ' ' . ($leave->reason ?? '')) }}"
                        data-status="{{ $leave->status }}"
                    >


                        {{-- Leave Type --}}

                        <td class="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">

                            {{ $leave->leave_type }}

                        </td>



                        {{-- Date --}}

                        <td class="whitespace-nowrap px-4 py-3 text-sm text-gray-700">

                            @if ($leave->start_date->equalTo($leave->end_date))

                                {{ $leave->start_date->format('M d, Y') }}

                            @else

                                {{ $leave->start_date->format('M d, Y') }}

                                &ndash;

                                {{ $leave->end_date->format('M d, Y') }}

                            @endif

                        </td>



                        {{-- Days --}}

                        <td class="whitespace-nowrap px-4 py-3 text-sm text-gray-700">

                            {{ $days }}

                            {{ $days === 1 ? 'day' : 'days' }}

                        </td>



                        {{-- Reason --}}

                        <td class="max-w-xs px-4 py-3 text-sm text-gray-700">

                            {{ $leave->reason ?? '—' }}

                        </td>



                        {{-- Submitted --}}

                        <td class="whitespace-nowrap px-4 py-3 text-sm text-gray-500">

                            {{ $leave->created_at->format('M d, Y') }}

                        </td>



                        {{-- Status --}}

                        <td class="whitespace-nowrap px-4 py-3">

                            @if ($leave->status === 'Pending')

                                <span class="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">

                                    <span class="h-1.5 w-1.5 rounded-full bg-amber-500"></span>

                                    Pending

                                </span>

                            @elseif ($leave->status === 'Approved')

                                <span class="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">

                                    <span class="h-1.5 w-1.5 rounded-full bg-green-500"></span>

                                    Approved

                                </span>

                            @else

                                <span class="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">

                                    <span class="h-1.5 w-1.5 rounded-full bg-red-500"></span>

                                    Rejected

                                </span>

                            @endif

                        </td>



                        {{-- =================================================
                            VIEW BUTTON
                        ================================================= --}}

                        <td class="whitespace-nowrap px-4 py-3 text-right">

                            <button
                                type="button"
                                class="view-leave-btn rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"

                                data-leave-type="{{ $leave->leave_type }}"

                                data-start-date="{{ $leave->start_date->format('M d, Y') }}"

                                data-end-date="{{ $leave->end_date->format('M d, Y') }}"

                                data-days="{{ $days }}"

                                data-reason="{{ $leave->reason ?? '—' }}"

                                data-submitted="{{ $leave->created_at->format('M d, Y') }}"

                                data-status="{{ $leave->status }}"

                                data-rejection-reason="{{ $leave->rejection_reason ?? '' }}"
                            >
                                View
                            </button>

                        </td>

                    </tr>

                @empty


                    {{-- No Database Records --}}

                    <tr id="no-leave-records">

                        <td
                            colspan="7"
                            class="px-4 py-10 text-center"
                        >

                            <p class="text-sm font-semibold text-gray-700">
                                No leave requests found.
                            </p>

                            <p class="mt-1 text-xs text-gray-500">
                                You have not submitted any leave requests yet.
                            </p>

                        </td>

                    </tr>

                @endforelse


                {{-- No Filter Results --}}

                <tr
                    id="no-filtered-leave-records"
                    class="hidden"
                >

                    <td
                        colspan="7"
                        class="px-4 py-10 text-center"
                    >

                        <p class="text-sm font-semibold text-gray-700">
                            No leave requests found.
                        </p>

                        <p class="mt-1 text-xs text-gray-500">
                            Try changing your search or status filter.
                        </p>

                    </td>

                </tr>

            </tbody>

        </table>

    </div>



    {{-- =================================================
        PAGINATION
    ================================================= --}}

    @if ($leaveRequests->hasPages())

        <div class="border-t border-gray-200 px-5 py-4">

            {{ $leaveRequests->links() }}

        </div>

    @endif

</div>



{{-- =====================================================
    REQUEST LEAVE MODAL
===================================================== --}}

<div
    id="leave-request-modal"
    class="fixed inset-0 z-50 hidden items-center justify-center bg-black/50 px-4"
>

    <div class="w-full max-w-lg rounded-xl bg-white shadow-xl">


        {{-- Header --}}

        <div class="flex items-start justify-between border-b border-gray-200 px-6 py-5">

            <div>

                <h2 class="text-lg font-semibold text-gray-900">
                    Request Leave
                </h2>

                <p class="mt-1 text-sm text-gray-500">
                    Submit a new leave request for review.
                </p>

            </div>


            <button
                type="button"
                id="close-leave-modal"
                class="text-gray-400 transition hover:text-gray-600"
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



        {{-- Form --}}

        <form
            id="leave-request-form"
            method="POST"
            action="{{ route('employee.leave.store') }}"
        >

            @csrf


            <div class="space-y-5 px-6 py-5">


                {{-- Leave Type --}}

                <div>

                    <label
                        for="leave_type"
                        class="text-xs font-semibold uppercase tracking-wide text-gray-500"
                    >
                        Leave Type
                    </label>


                    <select
                        id="leave_type"
                        name="leave_type"
                        required
                        class="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >

                        <option value="">
                            Select leave type
                        </option>

                        <option value="Sick">
                            Sick Leave
                        </option>

                        <option value="Vacation">
                            Vacation Leave
                        </option>

                        <option value="Emergency">
                            Emergency Leave
                        </option>

                        <option value="Bereavement">
                            Bereavement Leave
                        </option>

                    </select>

                </div>



                {{-- Dates --}}

                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">

                    <div>

                        <label
                            for="start_date"
                            class="text-xs font-semibold uppercase tracking-wide text-gray-500"
                        >
                            Start Date
                        </label>

                        <input
                            type="date"
                            id="start_date"
                            name="start_date"
                            required
                            class="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        >

                    </div>


                    <div>

                        <label
                            for="end_date"
                            class="text-xs font-semibold uppercase tracking-wide text-gray-500"
                        >
                            End Date
                        </label>

                        <input
                            type="date"
                            id="end_date"
                            name="end_date"
                            required
                            class="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        >

                    </div>

                </div>



                {{-- Reason --}}

                <div>

                    <label
                        for="reason"
                        class="text-xs font-semibold uppercase tracking-wide text-gray-500"
                    >
                        Reason
                    </label>

                    <textarea
                        id="reason"
                        name="reason"
                        rows="4"
                        maxlength="500"
                        placeholder="Briefly explain the purpose of this leave..."
                        class="mt-2 w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    ></textarea>

                </div>

            </div>



            {{-- Footer --}}

            <div class="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">

                <button
                    type="button"
                    id="cancel-leave-modal"
                    class="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                    Cancel
                </button>


                <button
                    type="submit"
                    class="rounded-lg bg-[#11458c] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                    Submit Leave Request
                </button>

            </div>

        </form>

    </div>

</div>



{{-- =====================================================
    VIEW LEAVE DETAILS MODAL
===================================================== --}}

<div
    id="leave-details-modal"
    class="fixed inset-0 z-50 hidden items-center justify-center bg-black/50 px-4"
>

    <div class="w-full max-w-lg rounded-xl bg-white shadow-xl">


        {{-- Header --}}

        <div class="flex items-start justify-between border-b border-gray-200 px-6 py-5">

            <div>

                <h2 class="text-lg font-semibold text-gray-900">
                    Request Details
                </h2>

                <p class="mt-1 text-sm text-gray-500">
                    Leave request details
                </p>

            </div>


            <button
                type="button"
                id="close-leave-details-modal"
                class="text-gray-400 transition hover:text-gray-600"
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



        {{-- Details --}}

        <div class="space-y-5 px-6 py-5">

            <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">


                {{-- Leave Type --}}

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



                {{-- Status --}}

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



                {{-- Start Date --}}

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



                {{-- End Date --}}

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



                {{-- Days --}}

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



                {{-- Submitted --}}

                <div>

                    <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Submitted Date
                    </p>

                    <p
                        id="detail-submitted"
                        class="mt-1 text-sm text-gray-900"
                    >
                        —
                    </p>

                </div>

            </div>



            {{-- Reason --}}

            <div>

                <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Reason
                </p>

                <div
                    id="detail-reason"
                    class="mt-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700"
                >
                    —
                </div>

            </div>



            {{-- Rejection Reason --}}

            <div
                id="detail-rejection-container"
                class="hidden"
            >

                <p class="text-xs font-semibold uppercase tracking-wide text-red-600">
                    Rejection Reason
                </p>

                <div
                    id="detail-rejection-reason"
                    class="mt-2 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                    —
                </div>

            </div>

        </div>



        {{-- Footer --}}

        <div class="flex justify-end border-t border-gray-200 px-6 py-4">

            <button
                type="button"
                id="close-leave-details-button"
                class="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
                Close
            </button>

        </div>

    </div>

</div>


@endsection
