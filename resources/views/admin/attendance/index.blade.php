@extends('layouts.app')

@section('title', 'Attendance Management')
@section('breadcrumb-parent', 'Management')
@section('breadcrumb-current', 'Attendance')

@section('content')

    <div class="space-y-6">

        {{-- PAGE HEADER --}}
        <div>
            <h1 class="text-2xl font-bold text-gray-900">
                Attendance Management
            </h1>

            <p class="mt-1 text-sm text-gray-500">
                Attendance records for all employees in the organization.
            </p>
        </div>


        {{-- ATTENDANCE CARD --}}
        <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

            {{-- CARD HEADER --}}
            <div class="border-b border-gray-200 px-5 py-4">
                <h2 class="text-lg font-semibold text-gray-900">
                    Attendance Records
                </h2>
            </div>


            {{-- FILTERS --}}
            <form
                method="GET"
                action="{{ route('admin.attendance.index') }}"
                class="border-b border-gray-200 px-5 py-4"
            >

                <div class="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">

                    {{-- SEARCH --}}
                    <div>
                        <label
                            for="search"
                            class="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500"
                        >
                            Employee
                        </label>

                        <input
                            type="text"
                            id="search"
                            name="search"
                            value="{{ request('search') }}"
                            placeholder="Search employee"
                            class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                    </div>


                    {{-- DEPARTMENT --}}
                    <div>
                        <label
                            for="department"
                            class="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500"
                        >
                            Department
                        </label>

                        <select
                            id="department"
                            name="department"
                            class="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="">
                                All departments
                            </option>

                            @foreach ($departments as $department)

                                <option
                                    value="{{ $department->id }}"
                                    {{ request('department') == $department->id ? 'selected' : '' }}
                                >
                                    {{ $department->name }}
                                </option>

                            @endforeach

                        </select>
                    </div>


                    {{-- DATE --}}
                    <div>
                        <label
                            for="date"
                            class="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500"
                        >
                            Date
                        </label>

                        <input
                            type="date"
                            id="date"
                            name="date"
                            value="{{ request('date') }}"
                            class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                    </div>


                    {{-- STATUS --}}
                    <div>
                        <label
                            for="status"
                            class="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500"
                        >
                            Status
                        </label>

                        <select
                            id="status"
                            name="status"
                            class="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="">
                                All statuses
                            </option>

                            <option
                                value="completed"
                                {{ request('status') === 'completed' ? 'selected' : '' }}
                            >
                                Completed
                            </option>

                            <option
                                value="working"
                                {{ request('status') === 'working' ? 'selected' : '' }}
                            >
                                Working
                            </option>

                            <option
                                value="not_started"
                                {{ request('status') === 'not_started' ? 'selected' : '' }}
                            >
                                Not Started
                            </option>

                        </select>
                    </div>

                </div>


                {{-- FILTER BUTTONS --}}
                <div class="mt-4 flex items-center gap-2">

                    <button
                        type="submit"
                        class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                        Filter
                    </button>

                    <a
                        href="{{ route('admin.attendance.index') }}"
                        class="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                        Clear
                    </a>

                </div>

            </form>


            {{-- TABLE --}}
            <div class="overflow-x-auto">

                <table class="min-w-full divide-y divide-gray-200">

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


                    <tbody class="divide-y divide-gray-200 bg-white">

                        @forelse ($attendances as $attendance)

                            @php

                                if ($attendance->time_in && $attendance->time_out) {
                                    $attendanceStatus = 'completed';
                                } elseif ($attendance->time_in && !$attendance->time_out) {
                                    $attendanceStatus = 'working';
                                } else {
                                    $attendanceStatus = 'not_started';
                                }

                            @endphp


                            <tr class="hover:bg-gray-50">

                                {{-- EMPLOYEE --}}
                                <td class="whitespace-nowrap px-5 py-3 text-sm font-medium text-gray-900">
                                    {{ $attendance->employee->user->first_name }}
                                    {{ $attendance->employee->user->last_name }}
                                </td>


                                {{-- DEPARTMENT --}}
                                <td class="whitespace-nowrap px-5 py-3 text-sm text-gray-700">
                                    {{ $attendance->employee->department->name ?? '—' }}
                                </td>


                                {{-- DATE --}}
                                <td class="whitespace-nowrap px-5 py-3 text-sm text-gray-700">
                                    {{ $attendance->date->format('M j, Y') }}
                                </td>


                                {{-- TIME IN --}}
                                <td class="whitespace-nowrap px-5 py-3 text-sm text-gray-700">
                                    {{ $attendance->time_in?->format('h:i A') ?? '—' }}
                                </td>


                                {{-- TIME OUT --}}
                                <td class="whitespace-nowrap px-5 py-3 text-sm text-gray-700">
                                    {{ $attendance->time_out?->format('h:i A') ?? '—' }}
                                </td>


                                {{-- TOTAL HOURS --}}
                                <td class="whitespace-nowrap px-5 py-3 text-sm text-gray-700">

                                    @if ($attendance->time_in && $attendance->time_out)

                                        @php

                                            $totalMinutes = (int) $attendance->time_in->diffInMinutes(
                                                $attendance->time_out
                                            );

                                            $hours = intdiv($totalMinutes, 60);

                                            $minutes = $totalMinutes % 60;

                                        @endphp

                                        {{ $hours }}h
                                        {{ str_pad($minutes, 2, '0', STR_PAD_LEFT) }}m

                                    @else

                                        —

                                    @endif

                                </td>


                                {{-- STATUS --}}
                                <td class="whitespace-nowrap px-5 py-3">

                                    @if ($attendanceStatus === 'completed')

                                        <span class="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">

                                            <span class="h-1.5 w-1.5 rounded-full bg-green-500"></span>

                                            Completed

                                        </span>

                                    @elseif ($attendanceStatus === 'working')

                                        <span class="inline-flex items-center gap-1.5 rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-700">

                                            <span class="h-1.5 w-1.5 rounded-full bg-cyan-500"></span>

                                            Working

                                        </span>

                                    @else

                                        <span class="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">

                                            <span class="h-1.5 w-1.5 rounded-full bg-gray-400"></span>

                                            Not Started

                                        </span>

                                    @endif

                                </td>

                            </tr>

                        @empty

                            <tr>

                                <td
                                    colspan="7"
                                    class="px-5 py-10 text-center text-sm text-gray-500"
                                >
                                    No attendance records found.
                                </td>

                            </tr>

                        @endforelse

                    </tbody>

                </table>

            </div>


            {{-- PAGINATION --}}
            @if ($attendances->hasPages())

                <div class="border-t border-gray-200 px-5 py-4">
                    {{ $attendances->withQueryString()->links() }}
                </div>

            @endif

        </div>

    </div>
    @vite('resources/js/admin/attendance.js')

@endsection
