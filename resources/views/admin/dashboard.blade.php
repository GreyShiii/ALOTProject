@extends('layouts.app')

@section('title', 'Admin Dashboard')
@section('breadcrumb-parent', 'Management')
@section('breadcrumb-current', 'Dashboard')

@section('content')

{{-- Page Header --}}
<div class="mb-6">
    <h1 class="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
        Admin Dashboard
    </h1>

    <p class="mt-1 text-sm text-gray-500">
        Overview of employees, departments, attendance, and requests.
    </p>
</div>


{{-- ========================================================= --}}
{{-- STATISTICS CARDS --}}
{{-- ========================================================= --}}

<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

    {{-- Total Employees --}}
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div class="flex items-center justify-between">

            <div>
                <p class="text-sm font-medium text-gray-500">
                    Total Employees
                </p>

                <p class="mt-2 text-3xl font-bold text-gray-900">
                    {{ $totalEmployees }}
                </p>
            </div>

            <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
                <svg
                    class="h-6 w-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m4-4a4 4 0 100-8 4 4 0 000 8zm4 0a3 3 0 100-6 3 3 0 000 6z"
                    />
                </svg>
            </div>

        </div>
    </div>


    {{-- Total Managers --}}
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div class="flex items-center justify-between">

            <div>
                <p class="text-sm font-medium text-gray-500">
                    Total Managers
                </p>

                <p class="mt-2 text-3xl font-bold text-gray-900">
                    {{ $totalManagers }}
                </p>
            </div>

            <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-50">
                <svg
                    class="h-6 w-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5.121 17.804A9 9 0 1118.88 6.196 9 9 0 015.12 17.804zM12 13a3 3 0 100-6 3 3 0 000 6zm0 2c-2.21 0-4 1.343-4 3h8c0-1.657-1.79-3-4-3z"
                    />
                </svg>
            </div>

        </div>
    </div>


    {{-- Departments --}}
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div class="flex items-center justify-between">

            <div>
                <p class="text-sm font-medium text-gray-500">
                    Departments
                </p>

                <p class="mt-2 text-3xl font-bold text-gray-900">
                    {{ $totalDepartments }}
                </p>
            </div>

            <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-green-50">
                <svg
                    class="h-6 w-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6M9 10h.01M12 10h.01M15 10h.01"
                    />
                </svg>
            </div>

        </div>
    </div>

</div>


{{-- ========================================================= --}}
{{-- ATTENDANCE OVERVIEW --}}
{{-- ========================================================= --}}

<div class="mt-6 rounded-xl border border-gray-200 bg-white shadow-sm">

    <div class="border-b border-gray-200 px-4 py-4 sm:px-6 sm:py-5">

        <div class="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">

            <div>
                <h2 class="text-lg font-semibold text-gray-900">
                    Attendance Overview
                </h2>

                <p class="mt-1 text-sm text-gray-500">
                    Today's employee attendance status.
                </p>
            </div>

            <span class="text-sm text-gray-500">
                Today
            </span>

        </div>

    </div>


    <div class="grid grid-cols-2 divide-x divide-y divide-gray-200 sm:grid-cols-4 sm:divide-y-0">

        {{-- Working --}}
        <div class="p-5">
            <p class="text-sm font-medium text-gray-500">
                Working
            </p>

            <p class="mt-2 text-2xl font-bold text-gray-900">
                0
            </p>
        </div>


        {{-- Completed --}}
        <div class="p-5">
            <p class="text-sm font-medium text-gray-500">
                Completed
            </p>

            <p class="mt-2 text-2xl font-bold text-gray-900">
                0
            </p>
        </div>


        {{-- On Leave --}}
        <div class="p-5">
            <p class="text-sm font-medium text-gray-500">
                On Leave
            </p>

            <p class="mt-2 text-2xl font-bold text-gray-900">
                0
            </p>
        </div>


        {{-- Not Started --}}
        <div class="p-5">
            <p class="text-sm font-medium text-gray-500">
                Not Started
            </p>

            <p class="mt-2 text-2xl font-bold text-gray-900">
                0
            </p>
        </div>

    </div>

</div>


{{-- ========================================================= --}}
{{-- RECENT REQUESTS --}}
{{-- ========================================================= --}}

<div class="mt-6 rounded-xl border border-gray-200 bg-white shadow-sm">

    <div class="border-b border-gray-200 px-4 py-4 sm:px-6 sm:py-5">

        <div class="flex items-center justify-between">

            <div>
                <h2 class="text-lg font-semibold text-gray-900">
                    Recent Requests
                </h2>

                <p class="mt-1 text-sm text-gray-500">
                    Latest leave and overtime requests.
                </p>
            </div>

        </div>

    </div>


    {{-- Desktop / Tablet --}}
    <div class="hidden overflow-x-auto md:block">

        <table class="min-w-full divide-y divide-gray-200">

            <thead class="bg-gray-50">

                <tr>

                    <th class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Employee
                    </th>

                    <th class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Type
                    </th>

                    <th class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Date
                    </th>

                    <th class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Status
                    </th>

                </tr>

            </thead>


            <tbody class="divide-y divide-gray-200 bg-white">

                <tr>

                    <td
                        colspan="4"
                        class="px-6 py-10 text-center text-sm text-gray-500"
                    >
                        No recent requests.
                    </td>

                </tr>

            </tbody>

        </table>

    </div>


    {{-- Mobile --}}
    <div class="divide-y divide-gray-200 md:hidden">

        <div class="px-4 py-10 text-center text-sm text-gray-500">
            No recent requests.
        </div>

    </div>

</div>


{{-- ========================================================= --}}
{{-- RECENT EMPLOYEES --}}
{{-- ========================================================= --}}

<div class="mt-6 rounded-xl border border-gray-200 bg-white shadow-sm">

    <div class="border-b border-gray-200 px-4 py-4 sm:px-6 sm:py-5">

        <div>
            <h2 class="text-lg font-semibold text-gray-900">
                Recent Employees
            </h2>

            <p class="mt-1 text-sm text-gray-500">
                Recently added employees.
            </p>
        </div>

    </div>


    {{-- Desktop / Tablet --}}
    <div class="hidden overflow-x-auto md:block">

        <table class="min-w-full divide-y divide-gray-200">

            <thead class="bg-gray-50">

                <tr>

                    <th class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Employee
                    </th>

                    <th class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Position
                    </th>

                    <th class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Department
                    </th>

                    <th class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Hire Date
                    </th>

                </tr>

            </thead>


            <tbody class="divide-y divide-gray-200 bg-white">

                @forelse ($recentEmployees as $employee)

                    <tr>
                        {{-- Employee --}}
                        <td class="px-4 py-4 text-center text-sm font-semibold text-gray-900">
                            {{ $employee->user->first_name }}
                            {{ $employee->user->last_name }}
                        </td>

                        {{-- Position --}}
                        <td class="px-4 py-4 text-center text-sm text-gray-700">
                            {{ $employee->position }}
                        </td>

                        {{-- Department --}}
                        <td class="px-4 py-4 text-center text-sm text-gray-700">
                            {{ $employee->department->name }}
                        </td>

                        {{-- Hire Date --}}
                        <td class="px-4 py-4 text-center text-sm text-gray-700">
                            {{ $employee->hire_date
                                ? $employee->hire_date->format('M j, Y')
                                : 'N/A'
                            }}
                        </td>
                    </tr>

                @empty

                    <tr>
                        <td
                            colspan="4"
                            class="px-6 py-10 text-center text-sm text-gray-500"
                        >
                            No employees yet.
                        </td>
                    </tr>

                @endforelse

            </tbody>

        </table>

    </div>


    {{-- Mobile --}}
    <div class="divide-y divide-gray-200 md:hidden">

        <div class="px-4 py-10 text-center text-sm text-gray-500">
            No employees yet.
        </div>

    </div>

</div>

@endsection
