@extends('layouts.app')


@section('title', 'Attendance')
@section('breadcrumb-parent', 'Employee')
@section('breadcrumb-current', 'Attendance')


@section('content')


<div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

    <div class="flex items-center justify-between border-b border-gray-200 px-5 py-4">

        <div>

            <h2 class="text-lg font-semibold text-gray-900">
                Attendance History
            </h2>

            <p class="mt-1 text-sm text-gray-500">
                Record your daily time in and time out, and review your history.
            </p>

        </div>

    </div>


    <div class="border-b border-gray-200 px-5 py-4">

        <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">

            <div class="relative">

                <input
                    type="text"
                    id="attendance-search"
                    placeholder="Search by date"
                    class="w-full rounded-lg border border-gray-300 px-4 py-2.5 pl-10 text-sm text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >

                <svg
                    class="absolute left-3 top-3 h-4 w-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                    viewBox="0 0 24 24"
                >
                    <circle cx="11" cy="11" r="7"/>
                    <path stroke-linecap="round" stroke-linejoin="round" d="m20 20-4-4"/>
                </svg>

            </div>


            <input
                type="date"
                id="attendance-date"
                class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >


            <select
                id="attendance-status"
                class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >

                <option value="">
                    All statuses
                </option>

                <option value="working">
                    Working
                </option>

                <option value="completed">
                    Completed
                </option>

                <option value="not_started">
                    Not Started
                </option>

            </select>

        </div>

    </div>


    <div id="attendance-results">

        @include('employee.attendance.partials.table')

    </div>

</div>


@endsection
