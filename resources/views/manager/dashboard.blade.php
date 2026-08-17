@extends('layouts.app')

@section('title', 'Manager Dashboard')
@section('breadcrumb-parent', 'Manager')
@section('breadcrumb-current', 'Dashboard')

@section('content')

    {{-- =====================================================
        PAGE HEADER
    ===================================================== --}}

    <div class="mb-6">

        <h1 class="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
            Manager Dashboard
        </h1>

        <p class="mt-1 text-sm text-gray-500">
            Review your team's requests and monitor current activity.
        </p>

    </div>


    {{-- =====================================================
        SUMMARY CARDS
    ===================================================== --}}

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

        {{-- Pending Leave --}}
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

            <div class="flex items-start justify-between">

                <div>

                    <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Pending Leave
                    </p>

                    <p class="mt-2 text-3xl font-bold text-gray-900">
                        {{ $pendingLeaveCount }}
                    </p>

                </div>

                <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8"
                        viewBox="0 0 24 24">
                        <rect x="3" y="5" width="18" height="16" rx="2" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 9h18M8 3v4M16 3v4" />
                    </svg>
                </div>

            </div>

            <a
                href="{{ route('manager.leave.index') }}"
                class="mt-4 inline-block text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
                Review leave requests →
            </a>

        </div>


        {{-- Pending Overtime --}}
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

            <div class="flex items-start justify-between">

                <div>

                    <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Pending Overtime
                    </p>

                    <p class="mt-2 text-3xl font-bold text-gray-900">
                        {{ $pendingOvertimeCount }}
                    </p>

                </div>

                <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8"
                        viewBox="0 0 24 24">
                        <circle cx="12" cy="13" r="7" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 10v3M9 2h6" />
                    </svg>
                </div>

            </div>

            <a
                href="{{ route('manager.overtime.index') }}"
                class="mt-4 inline-block text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
                Review overtime requests →
            </a>

        </div>


        {{-- Team Members --}}
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

            <div class="flex items-start justify-between">

                <div>

                    <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Team Members
                    </p>

                    <p class="mt-2 text-3xl font-bold text-gray-900">
                        {{ $teamMemberCount }}
                    </p>

                </div>

                <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M16 20v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 20v-1a4 4 0 0 0-3-3.87M16 3.13A4 4 0 0 1 16 11" />
                    </svg>
                </div>

            </div>

            <a
                href="{{ route('manager.team.index') }}"
                class="mt-4 inline-block text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
                View my team →
            </a>

        </div>


        {{-- Approved Requests --}}
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

            <div class="flex items-start justify-between">

                <div>

                    <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Approved Requests
                    </p>

                    <p class="mt-2 text-3xl font-bold text-gray-900">
                        {{ $approvedRequestCount }}
                    </p>

                </div>

                <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="m5 12 4 4L19 6" />
                    </svg>
                </div>

            </div>

            <p class="mt-4 text-xs text-gray-500">
                Approved leave and overtime requests.
            </p>

        </div>

    </div>


    {{-- =====================================================
        PENDING REQUESTS
    ===================================================== --}}

    <div class="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

        <div class="border-b border-gray-200 px-5 py-4">

            <h2 class="text-lg font-semibold text-gray-900">
                Pending Requests
            </h2>

            <p class="mt-1 text-sm text-gray-500">
                Requests that require your review.
            </p>

        </div>


        {{-- Desktop --}}
        <div class="hidden overflow-x-auto md:block">

            <table class="min-w-full divide-y divide-gray-200">

                <thead class="bg-gray-50">

                    <tr>

                        <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Employee
                        </th>

                        <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Request Type
                        </th>

                        <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Details
                        </th>

                        <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Date
                        </th>

                        <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Submitted
                        </th>

                        <th class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Action
                        </th>

                    </tr>

                </thead>


                <tbody class="divide-y divide-gray-200">

                    @forelse ($pendingLeaveRequests as $request)

                        <tr class="hover:bg-gray-50">

                            <td class="px-4 py-4">

                                <p class="text-sm font-semibold text-gray-900">
                                    {{ $request->employee->user->first_name }}
                                    {{ $request->employee->user->last_name }}
                                </p>

                                <p class="mt-1 text-xs text-gray-500">
                                    {{ $request->employee->department->name ?? '—' }}
                                </p>

                            </td>


                            <td class="px-4 py-4">

                                <span class="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                                    Leave
                                </span>

                            </td>


                            <td class="px-4 py-4 text-sm text-gray-700">
                                {{ $request->leave_type }}
                            </td>


                            <td class="whitespace-nowrap px-4 py-4 text-sm text-gray-700">
                                {{ $request->start_date->format('M j, Y') }}
                            </td>


                            <td class="whitespace-nowrap px-4 py-4 text-sm text-gray-500">
                                {{ $request->created_at->format('M j, Y') }}
                            </td>


                            <td class="px-4 py-4 text-right">

                                <a
                                    href="{{ route('manager.leave.index') }}"
                                    class="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                                >
                                    Review
                                </a>

                            </td>

                        </tr>

                    @empty

                    @endforelse


                    @foreach ($pendingOvertimeRequests as $request)

                        <tr class="hover:bg-gray-50">

                            <td class="px-4 py-4">

                                <p class="text-sm font-semibold text-gray-900">
                                    {{ $request->employee->user->first_name }}
                                    {{ $request->employee->user->last_name }}
                                </p>

                                <p class="mt-1 text-xs text-gray-500">
                                    {{ $request->employee->department->name ?? '—' }}
                                </p>

                            </td>


                            <td class="px-4 py-4">

                                <span class="inline-flex rounded-full bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700">
                                    Overtime
                                </span>

                            </td>


                            <td class="px-4 py-4 text-sm text-gray-700">
                                {{ $request->hours }} hours
                            </td>


                            <td class="whitespace-nowrap px-4 py-4 text-sm text-gray-700">
                                {{ $request->date->format('M j, Y') }}
                            </td>


                            <td class="whitespace-nowrap px-4 py-4 text-sm text-gray-500">
                                {{ $request->created_at->format('M j, Y') }}
                            </td>


                            <td class="px-4 py-4 text-right">

                                <a
                                    href="{{ route('manager.overtime.index') }}"
                                    class="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                                >
                                    Review
                                </a>

                            </td>

                        </tr>

                    @endforeach


                    @if (
                        $pendingLeaveRequests->isEmpty() &&
                        $pendingOvertimeRequests->isEmpty()
                    )

                        <tr>

                            <td
                                colspan="6"
                                class="px-6 py-12 text-center"
                            >

                                <p class="text-sm font-semibold text-gray-700">
                                    No pending requests.
                                </p>

                                <p class="mt-1 text-xs text-gray-500">
                                    You're all caught up.
                                </p>

                            </td>

                        </tr>

                    @endif

                </tbody>

            </table>

        </div>


        {{-- Mobile --}}
        <div class="divide-y divide-gray-200 md:hidden">

            @foreach ($pendingLeaveRequests as $request)

                <div class="px-4 py-4">

                    <div class="flex items-start justify-between gap-3">

                        <div>

                            <p class="text-sm font-semibold text-gray-900">
                                {{ $request->employee->user->first_name }}
                                {{ $request->employee->user->last_name }}
                            </p>

                            <p class="mt-1 text-xs text-gray-500">
                                Leave · {{ $request->leave_type }}
                            </p>

                        </div>

                        <span class="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                            Pending
                        </span>

                    </div>

                    <p class="mt-3 text-sm text-gray-700">
                        {{ $request->start_date->format('M j, Y') }}
                    </p>

                    <a
                        href="{{ route('manager.leave.index') }}"
                        class="mt-3 inline-block text-xs font-semibold text-blue-600"
                    >
                        Review request →
                    </a>

                </div>

            @endforeach


            @foreach ($pendingOvertimeRequests as $request)

                <div class="px-4 py-4">

                    <div class="flex items-start justify-between gap-3">

                        <div>

                            <p class="text-sm font-semibold text-gray-900">
                                {{ $request->employee->user->first_name }}
                                {{ $request->employee->user->last_name }}
                            </p>

                            <p class="mt-1 text-xs text-gray-500">
                                Overtime · {{ $request->hours }} hours
                            </p>

                        </div>

                        <span class="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                            Pending
                        </span>

                    </div>

                    <p class="mt-3 text-sm text-gray-700">
                        {{ $request->date->format('M j, Y') }}
                    </p>

                    <a
                        href="{{ route('manager.overtime.index') }}"
                        class="mt-3 inline-block text-xs font-semibold text-blue-600"
                    >
                        Review request →
                    </a>

                </div>

            @endforeach


            @if (
                $pendingLeaveRequests->isEmpty() &&
                $pendingOvertimeRequests->isEmpty()
            )

                <div class="px-4 py-12 text-center">

                    <p class="text-sm font-semibold text-gray-700">
                        No pending requests.
                    </p>

                    <p class="mt-1 text-xs text-gray-500">
                        You're all caught up.
                    </p>

                </div>

            @endif

        </div>

    </div>

@endsection
