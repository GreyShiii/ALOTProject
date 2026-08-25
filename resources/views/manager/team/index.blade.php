@extends('layouts.app')

@section('title', 'My Team')
@section('breadcrumb-parent', 'Manager')
@section('breadcrumb-current', 'My Team')

@section('content')

    <div class="mb-6">

        <h1 class="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
            My Team
        </h1>

        <p class="mt-1 text-sm text-gray-500">
            Employees assigned to you.
        </p>

    </div>


    <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

        <div class="border-b border-gray-200 px-5 py-4">

            <h2 class="text-lg font-semibold text-gray-900">
                Team Members
            </h2>

            <p class="mt-1 text-sm text-gray-500">
                Your currently assigned employees.
            </p>

        </div>


        <div class="hidden overflow-x-auto md:block">

            <table class="w-full table-fixed divide-y divide-gray-200">

                <colgroup>
                    <col class="w-[18%]">
                    <col class="w-[16%]">
                    <col class="w-[16%]">
                    <col class="w-[23%]">
                    <col class="w-[15%]">
                    <col class="w-[12%]">
                </colgroup>


                <thead class="bg-gray-50">

                    <tr>

                        <th class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Employee
                        </th>

                        <th class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Position
                        </th>

                        <th class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Department
                        </th>

                        <th class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Email
                        </th>

                        <th class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Hire Date
                        </th>

                        <th class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Status
                        </th>

                    </tr>

                </thead>


                <tbody id="manager-team-table-body" class="divide-y divide-gray-200 bg-white"></tbody>

            </table>

        </div>


        <div id="manager-team-card-list" class="divide-y divide-gray-200 md:hidden"></div>


        <div id="manager-team-empty" class="hidden px-6 py-12 text-center">

            <p class="text-sm font-semibold text-gray-700">
                No team members found.
            </p>

            <p class="mt-1 text-xs text-gray-500">
                You currently have no assigned employees.
            </p>

        </div>


        <div id="manager-team-pagination" class="border-t border-gray-200 bg-white"></div>

    </div>


    <script>
        window.managerTeamEmployees = @json($employees->values());
    </script>

    @vite('resources/js/manager/team.js')

@endsection
