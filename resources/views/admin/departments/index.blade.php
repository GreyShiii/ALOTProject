@extends('layouts.app')

@section('title', 'Department Management')
@section('breadcrumb-parent', 'Management')
@section('breadcrumb-current', 'Department Management')

@section('content')

    {{-- Flash messages --}}
    @if (session('success'))
        <div class="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {{ session('success') }}
        </div>
    @endif

    @if (session('error'))
        <div class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {{ session('error') }}
        </div>
    @endif

    {{-- Page header --}}
    <div class="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
            <h1 class="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">Department Management</h1>
            <p class="mt-1 text-sm text-gray-500">Departments used across employee records and reporting.</p>
        </div>

        <button
            type="button"
            id="add-department-btn"
            class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#11458c] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1a3450] focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 sm:w-auto"
        >
            <span class="text-base leading-none">+</span>
            Add Department
        </button>
    </div>

    {{-- Departments table card --}}
    <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

        {{-- Card header --}}
        <div class="border-b border-gray-200 px-4 py-4 sm:px-6 sm:py-5">
            <h2 class="text-lg font-semibold text-gray-900">Departments</h2>
        </div>

        {{-- Table (desktop / tablet) --}}
        <div class="hidden overflow-x-auto md:block">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="whitespace-nowrap px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">Department ID</th>
                        <th class="whitespace-nowrap px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">Department Name</th>
                        <th class="whitespace-nowrap px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">Number of Employees</th>
                        <th class="whitespace-nowrap px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">Created Date</th>
                        <th class="whitespace-nowrap px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">Actions</th>
                    </tr>
                </thead>
                <tbody id="department-table-body" class="divide-y divide-gray-200 bg-white">
                    @forelse ($departments as $department)
                        <tr id="department-row-{{ $department->id }}" class="transition hover:bg-gray-50">
                            <td class="whitespace-nowrap px-3 py-4 text-center font-mono text-xs text-gray-500">{{ 'DEP-' . str_pad($department->id, 2, '0', STR_PAD_LEFT) }}</td>
                            <td class="px-3 py-4 text-center text-sm font-semibold text-gray-900">{{ $department->name }}</td>
                            <td class="px-3 py-4 text-center text-sm text-gray-700">{{ $department->employees_count }}</td>
                            <td class="whitespace-nowrap px-3 py-4 text-center text-sm text-gray-700">{{ $department->created_at->format('M j, Y') }}</td>
                            <td class="whitespace-nowrap px-3 py-4 text-center">
                                <div class="flex items-center justify-center gap-2">
                                    <button
                                        type="button"
                                        class="edit-department-btn rounded-md border border-gray-300 bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                                        data-id="{{ $department->id }}"
                                    >Edit</button>
                                    <button
                                        type="button"
                                        class="delete-department-btn rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/40"
                                        data-id="{{ $department->id }}"
                                    >Delete</button>
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr id="no-departments">
                            <td colspan="5" class="px-6 py-12 text-center text-sm text-gray-500">No departments yet.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        {{-- Card list (mobile) --}}
        <div id="department-card-list" class="divide-y divide-gray-200 md:hidden">
            @forelse ($departments as $department)
                <div id="department-card-{{ $department->id }}" class="px-4 py-4">
                    <div class="flex items-start justify-between gap-3">
                        <div class="min-w-0">
                            <p class="truncate text-sm font-semibold text-gray-900">{{ $department->name }}</p>
                            <p class="mt-1 font-mono text-xs text-gray-400">{{ 'DEP-' . str_pad($department->id, 2, '0', STR_PAD_LEFT) }}</p>
                        </div>
                    </div>

                    <dl class="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <div>
                            <dt class="text-xs font-semibold uppercase tracking-wide text-gray-400">Employees</dt>
                            <dd class="text-gray-700">{{ $department->employees_count }}</dd>
                        </div>
                        <div>
                            <dt class="text-xs font-semibold uppercase tracking-wide text-gray-400">Created</dt>
                            <dd class="text-gray-700">{{ $department->created_at->format('M j, Y') }}</dd>
                        </div>
                    </dl>

                    <div class="mt-4 flex items-center gap-2">
                        <button
                            type="button"
                            class="edit-department-btn flex-1 rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                            data-id="{{ $department->id }}"
                        >Edit</button>
                        <button
                            type="button"
                            class="delete-department-btn flex-1 rounded-md bg-red-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/40"
                            data-id="{{ $department->id }}"
                        >Delete</button>
                    </div>
                </div>
            @empty
                <div class="px-4 py-12 text-center text-sm text-gray-500">No departments yet.</div>
            @endforelse
        </div>
    </div>

    {{-- Add Department Modal --}}
    <div id="add-department-modal" class="fixed inset-0 z-50 hidden">
        <div class="absolute inset-0 bg-black/75"></div>
        <div class="absolute left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-4 shadow-2xl sm:p-6">
            <div class="mb-1 flex items-center justify-between">
                <h2 class="text-xl font-semibold text-gray-900">Add Department</h2>
                <button type="button" onclick="document.getElementById('add-department-modal').classList.add('hidden')" class="text-gray-400 transition hover:text-gray-600">&times;</button>
            </div>
            <p class="mb-6 text-sm text-gray-500">Departments group employees for reporting and approvals.</p>

            <form id="add-department-form" method="POST" action="{{ route('admin.departments.store') }}" class="space-y-4">
                @csrf
                <div>
                    <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-600">Department Name</label>
                    <p id="name-error" class="mb-1.5 text-sm text-red-600 empty:hidden"></p>
                    <input
                        type="text"
                        name="name"
                        value="{{ old('name') }}"
                        placeholder="e.g. Engineering"
                        class="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    >
                    @error('name') <p class="mt-1.5 text-sm text-red-600">{{ $message }}</p> @enderror
                </div>

                <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <button type="button" onclick="document.getElementById('add-department-modal').classList.add('hidden')" class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 sm:w-auto">Cancel</button>
                    <button type="submit" class="w-full rounded-lg bg-[#11458c] px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800 sm:w-auto">Add Department</button>
                </div>
            </form>
        </div>
    </div>

    {{-- Edit Department Modals (one per department) --}}
    @foreach ($departments as $department)
        <div id="edit-department-modal-{{ $department->id }}" class="fixed inset-0 z-50 hidden">
            <div class="absolute inset-0 bg-black/75"></div>
            <div class="absolute left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-4 shadow-2xl sm:p-6">
                <div class="mb-1 flex items-center justify-between">
                    <h2 class="text-xl font-semibold text-gray-900">Edit Department</h2>
                    <button type="button" onclick="document.getElementById('edit-department-modal-{{ $department->id }}').classList.add('hidden')" class="text-gray-400 transition hover:text-gray-600">&times;</button>
                </div>
                <p class="mb-6 text-sm text-gray-500">Departments group employees for reporting and approvals.</p>

                <form class="edit-department-form space-y-4" id="edit-department-form-{{ $department->id }}" method="POST" action="{{ route('admin.departments.update', $department) }}">
                    @csrf
                    @method('PUT')

                    <div>
                        <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-600">Department Name</label>
                        <input
                            type="text"
                            name="name"
                            value="{{ old('name', $department->name) }}"
                            class="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                        >
                    </div>

                    <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                        <button type="button" onclick="document.getElementById('edit-department-modal-{{ $department->id }}').classList.add('hidden')" class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 sm:w-auto">Cancel</button>
                        <button type="submit" class="w-full rounded-lg bg-[#11458c] px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800 sm:w-auto">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    @endforeach

    {{-- Delete Department Modals (one per department) --}}
    @foreach ($departments as $department)
        <div id="delete-department-modal-{{ $department->id }}" class="fixed inset-0 z-50 hidden">
            <div class="absolute inset-0 bg-black/75"></div>
            <div class="absolute left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-4 shadow-2xl sm:p-6">
                <h2 class="mb-2 text-xl font-semibold text-gray-900">Delete {{ $department->name }}?</h2>
                <p class="mb-4 text-sm text-gray-500">
                    This department currently has {{ $department->employees_count }} employee(s).
                    They will need to be reassigned. This action cannot be undone.
                </p>

                <p id="delete-department-error-{{ $department->id }}" class="mb-4 hidden rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"></p>

                <form id="delete-department-form-{{ $department->id }}" class="delete-department-form" method="POST" action="{{ route('admin.departments.destroy', $department) }}">
                    @csrf
                    @method('DELETE')

                    <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                        <button type="button" onclick="document.getElementById('delete-department-modal-{{ $department->id }}').classList.add('hidden')" class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 sm:w-auto">Cancel</button>
                        <button type="submit" class="w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 sm:w-auto">Delete Department</button>
                    </div>
                </form>
            </div>
        </div>
    @endforeach

@vite('resources/js/admin/departments.js')

@endsection
