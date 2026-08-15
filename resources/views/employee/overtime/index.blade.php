@extends('layouts.app')

@section('title', 'My Overtime')
@section('breadcrumb-parent', 'Employee')
@section('breadcrumb-current', 'My Overtime')

@section('content')

<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div class="flex items-start justify-between">
            <p class="text-sm font-medium text-gray-500">Pending Overtime</p>
            <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="9"/>
                    <path stroke-linecap="round" d="M12 7v5l3 2"/>
                </svg>
            </div>
        </div>
        <p class="mt-3 text-3xl font-bold text-gray-900">{{ $pendingCount }}</p>
        <p class="mt-2 text-xs text-gray-500">Awaiting review</p>
    </div>

    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div class="flex items-start justify-between">
            <p class="text-sm font-medium text-gray-500">Approved Overtime</p>
            <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-green-600">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 12l4 4L19 6"/>
                </svg>
            </div>
        </div>
        <p class="mt-3 text-3xl font-bold text-gray-900">{{ $approvedCount }}</p>
        <p class="mt-2 text-xs text-gray-500">Approved requests</p>
    </div>

    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div class="flex items-start justify-between">
            <p class="text-sm font-medium text-gray-500">Approved Hours</p>
            <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2"/>
                    <circle cx="12" cy="12" r="9"/>
                </svg>
            </div>
        </div>
        <p class="mt-3 text-3xl font-bold text-gray-900">{{ number_format($approvedHours, 2) }}</p>
        <p class="mt-2 text-xs text-gray-500">Total approved hours</p>
    </div>

    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div class="flex items-start justify-between">
            <p class="text-sm font-medium text-gray-500">Total Requests</p>
            <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="17" rx="2"/>
                    <path stroke-linecap="round" d="M8 2v4M16 2v4M3 9h18"/>
                </svg>
            </div>
        </div>
        <p class="mt-3 text-3xl font-bold text-gray-900">{{ $totalCount }}</p>
        <p class="mt-2 text-xs text-gray-500">All overtime requests</p>
    </div>
</div>

@if (session('success'))
    <div class="mt-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
        {{ session('success') }}
    </div>
@endif

<div
    id="overtime-success-message"
    class="fixed top-6 right-6 z-50 hidden rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 shadow-lg">
</div>

<div class="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
    <div class="border-b border-gray-200 px-5 py-4">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h2 class="text-lg font-semibold text-gray-900">My Overtime Requests</h2>
                <p class="mt-1 text-sm text-gray-500">
                    View your submitted overtime requests and their current status.
                </p>
            </div>

            <button
                type="button"
                id="open-overtime-modal"
                class="rounded-lg bg-[#11458c] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
                + Request Overtime
            </button>
        </div>
    </div>

    <div class="border-b border-gray-200 bg-gray-50 px-5 py-4">
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
                <label for="overtime-search" class="text-xs font-semibold uppercase tracking-wide text-gray-500">
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
                        <circle cx="11" cy="11" r="7"/>
                        <path stroke-linecap="round" stroke-linejoin="round" d="m20 20-4-4"/>
                    </svg>

                    <input
                        type="text"
                        id="overtime-search"
                        placeholder="Search reason or date..."
                        class="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                </div>
            </div>

            <div>
                <label for="overtime-status-filter" class="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                </label>

                <select
                    id="overtime-status-filter"
                    class="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                    <option value="">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                </select>
            </div>
        </div>
    </div>

    <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <th class="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Date</th>
                    <th class="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Hours</th>
                    <th class="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Reason</th>
                    <th class="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Submitted</th>
                    <th class="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Status</th>
                    <th class="whitespace-nowrap px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Actions</th>
                </tr>
            </thead>

            <tbody id="overtime-table-body" class="divide-y divide-gray-200 bg-white">
                @forelse ($overtimeRequests as $overtime)
                    <tr
                        class="overtime-row"
                        data-search="{{ strtolower(($overtime->reason ?? '') . ' ' . $overtime->date->format('M d, Y')) }}"
                        data-status="{{ $overtime->status }}"
                    >
                        <td class="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                            {{ $overtime->date->format('M d, Y') }}
                        </td>

                        <td class="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                            {{ number_format($overtime->hours, 2) }}
                            {{ $overtime->hours == 1 ? 'hour' : 'hours' }}
                        </td>

                        <td class="max-w-xs px-4 py-3 text-sm text-gray-700">
                            {{ $overtime->reason ?? '—' }}
                        </td>

                        <td class="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                            {{ $overtime->created_at->format('M d, Y') }}
                        </td>

                        <td class="whitespace-nowrap px-4 py-3">
                            @if ($overtime->status === 'Pending')
                                <span class="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                                    <span class="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                                    Pending
                                </span>
                            @elseif ($overtime->status === 'Approved')
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

                        <td class="whitespace-nowrap px-4 py-3 text-right">
                            <button
                                type="button"
                                class="view-overtime-button rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                                data-date="{{ $overtime->date->format('M d, Y') }}"
                                data-hours="{{ $overtime->hours }}"
                                data-reason="{{ $overtime->reason ?? '' }}"
                                data-submitted="{{ $overtime->created_at->format('M d, Y') }}"
                                data-status="{{ $overtime->status }}"
                                data-rejection-reason="{{ $overtime->rejection_reason ?? '' }}"
                            >
                                View
                            </button>
                        </td>
                    </tr>
                @empty
                    <tr id="no-overtime-records">
                        <td colspan="6" class="px-4 py-10 text-center">
                            <p class="text-sm font-semibold text-gray-700">No overtime requests found.</p>
                            <p class="mt-1 text-xs text-gray-500">
                                You have not submitted any overtime requests yet.
                            </p>
                        </td>
                    </tr>
                @endforelse

                <tr id="no-filtered-overtime-records" class="hidden">
                    <td colspan="6" class="px-4 py-10 text-center">
                        <p class="text-sm font-semibold text-gray-700">No overtime requests found.</p>
                        <p class="mt-1 text-xs text-gray-500">
                            Try changing your search or status filter.
                        </p>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    @if ($overtimeRequests->hasPages())
        <div class="border-t border-gray-200 px-5 py-4">
            {{ $overtimeRequests->links() }}
        </div>
    @endif
</div>

<div
    id="overtime-request-modal"
    class="fixed inset-0 z-50 hidden items-center justify-center bg-black/50 px-4"
>
    <div class="w-full max-w-lg rounded-xl bg-white shadow-xl">
        <div class="flex items-start justify-between border-b border-gray-200 px-6 py-5">
            <div>
                <h2 class="text-lg font-semibold text-gray-900">Request Overtime</h2>
                <p class="mt-1 text-sm text-gray-500">
                    Submit a new overtime request for review.
                </p>
            </div>

            <button
                type="button"
                id="close-overtime-modal"
                class="text-gray-400 transition hover:text-gray-600"
            >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 6l12 12M18 6L6 18"/>
                </svg>
            </button>
        </div>

        <form
            id="overtime-request-form"
            method="POST"
            action="{{ route('employee.overtime.store') }}"
        >
            @csrf

            <div class="space-y-5 px-6 py-5">
                <div>
                    <label for="overtime_date" class="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Overtime Date
                    </label>

                    <input
                        type="date"
                        id="overtime_date"
                        name="date"
                        required
                        class="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                </div>

                <div>
                    <label for="overtime_hours" class="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Overtime Hours
                    </label>

                    <input
                        type="number"
                        id="overtime_hours"
                        name="hours"
                        min="0.5"
                        {{-- max="24" --}}
                        step="0.5"
                        required
                        placeholder="e.g. 2.5"
                        class="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                </div>

                <div>
                    <label for="overtime_reason" class="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Reason
                    </label>

                    <textarea
                        id="overtime_reason"
                        name="reason"
                        rows="4"
                        maxlength="500"
                        placeholder="Briefly explain why overtime was required..."
                        class="mt-2 w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    ></textarea>
                </div>
            </div>

            <div class="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
                <button
                    type="button"
                    id="cancel-overtime-modal"
                    class="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    class="rounded-lg bg-[#11458c] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                    Submit Overtime Request
                </button>
            </div>
        </form>
    </div>
</div>

<div
    id="overtime-details-modal"
    class="fixed inset-0 z-50 hidden items-center justify-center bg-black/50 px-4"
>
    <div class="w-full max-w-lg rounded-xl bg-white shadow-xl">
        <div class="flex items-start justify-between border-b border-gray-200 px-6 py-5">
            <div>
                <h2 class="text-lg font-semibold text-gray-900">Overtime Request Details</h2>
                <p class="mt-1 text-sm text-gray-500">Overtime request details</p>
            </div>

            <button
                type="button"
                id="close-overtime-details-modal"
                class="text-gray-400 transition hover:text-gray-600"
            >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 6l12 12M18 6L6 18"/>
                </svg>
            </button>
        </div>

        <div class="space-y-5 px-6 py-5">
            <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                    <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">Overtime Date</p>
                    <p id="detail-overtime-date" class="mt-1 text-sm font-medium text-gray-900">—</p>
                </div>

                <div>
                    <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">Overtime Hours</p>
                    <p id="detail-overtime-hours" class="mt-1 text-sm font-medium text-gray-900">—</p>
                </div>

                <div>
                    <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">Status</p>
                    <div id="detail-overtime-status" class="mt-1">—</div>
                </div>

                <div>
                    <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">Submitted Date</p>
                    <p id="detail-overtime-submitted" class="mt-1 text-sm text-gray-900">—</p>
                </div>
            </div>

            <div>
                <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">Reason</p>
                <div
                    id="detail-overtime-reason"
                    class="mt-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700"
                >
                    —
                </div>
            </div>

            <div id="detail-overtime-rejection-container" class="hidden">
                <p class="text-xs font-semibold uppercase tracking-wide text-red-600">Rejection Reason</p>
                <div
                    id="detail-overtime-rejection-reason"
                    class="mt-2 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                    —
                </div>
            </div>
        </div>

        <div class="flex justify-end border-t border-gray-200 px-6 py-4">
            <button
                type="button"
                id="close-overtime-details-button"
                class="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
                Close
            </button>
        </div>
    </div>
</div>

@endsection
