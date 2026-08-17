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


        {{-- Desktop --}}
        <div class="hidden overflow-x-auto md:block">

            <table class="min-w-full divide-y divide-gray-200">

                <thead class="bg-gray-50">

                    <tr>

                        <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Employee
                        </th>

                        <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Position
                        </th>

                        <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Department
                        </th>

                        <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Email
                        </th>

                        <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Hire Date
                        </th>

                        <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Status
                        </th>

                    </tr>

                </thead>


                <tbody class="divide-y divide-gray-200 bg-white">

                    @forelse ($employees as $employee)

                        <tr class="hover:bg-gray-50">

                            <td class="px-4 py-4">

                                <p class="text-sm font-semibold text-gray-900">
                                    {{ $employee->user->first_name }}
                                    {{ $employee->user->last_name }}
                                </p>

                            </td>


                            <td class="px-4 py-4 text-sm text-gray-700">
                                {{ $employee->position }}
                            </td>


                            <td class="px-4 py-4 text-sm text-gray-700">
                                {{ $employee->department->name ?? '—' }}
                            </td>


                            <td class="px-4 py-4 text-sm text-gray-700">
                                {{ $employee->user->email }}
                            </td>


                            <td class="px-4 py-4 text-sm text-gray-700">
                                {{ $employee->hire_date?->format('M j, Y') ?? 'N/A' }}
                            </td>


                            <td class="px-4 py-4">

                                @if ($employee->user->status === 'active')

                                    <span class="inline-flex rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                                        Active
                                    </span>

                                @else

                                    <span class="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
                                        Inactive
                                    </span>

                                @endif

                            </td>

                        </tr>

                    @empty

                        <tr>

                            <td
                                colspan="6"
                                class="px-6 py-12 text-center text-sm text-gray-500"
                            >
                                You currently have no assigned employees.
                            </td>

                        </tr>

                    @endforelse

                </tbody>

            </table>

        </div>


        {{-- Mobile --}}
        <div class="divide-y divide-gray-200 md:hidden">

            @forelse ($employees as $employee)

                <div class="px-4 py-4">

                    <div class="flex items-start justify-between gap-3">

                        <div class="min-w-0">

                            <p class="text-sm font-semibold text-gray-900">
                                {{ $employee->user->first_name }}
                                {{ $employee->user->last_name }}
                            </p>

                            <p class="mt-1 text-xs text-gray-500">
                                {{ $employee->position }}
                            </p>

                        </div>


                        @if ($employee->user->status === 'active')

                            <span class="shrink-0 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                                Active
                            </span>

                        @else

                            <span class="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
                                Inactive
                            </span>

                        @endif

                    </div>


                    <dl class="mt-3 grid grid-cols-2 gap-3 text-sm">

                        <div>

                            <dt class="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                Department
                            </dt>

                            <dd class="text-gray-700">
                                {{ $employee->department->name ?? '—' }}
                            </dd>

                        </div>


                        <div>

                            <dt class="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                Email
                            </dt>

                            <dd class="break-all text-gray-700">
                                {{ $employee->user->email }}
                            </dd>

                        </div>


                        <div>

                            <dt class="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                Hire Date
                            </dt>

                            <dd class="text-gray-700">
                                {{ $employee->hire_date?->format('M j, Y') ?? 'N/A' }}
                            </dd>

                        </div>

                    </dl>

                </div>

            @empty

                <div class="px-4 py-12 text-center text-sm text-gray-500">
                    You currently have no assigned employees.
                </div>

            @endforelse

        </div>

    </div>

@endsection
