@extends('layouts.app')

@section('title', 'User Management')
@section('breadcrumb-parent', 'Management')
@section('breadcrumb-current', 'User Management')

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
            <h1 class="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">User Management</h1>
            <p class="mt-1 text-sm text-gray-500">Manage system users, roles, and account status.</p>
        </div>

        <button
            type="button"
            id="add-user-btn"
            class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#11458c] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1a3450] focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 sm:w-auto"
        >
            <span class="text-base leading-none">+</span>
            Add User
        </button>
    </div>

    {{-- Users table card --}}
    <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

        {{-- Card header --}}
        <div class="border-b border-gray-200 px-4 py-4 sm:px-6 sm:py-5">
            <h2 class="text-lg font-semibold text-gray-900">Accounts</h2>
        </div>

        {{-- Table (desktop / tablet) --}}
        <div class="hidden overflow-x-auto md:block">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="whitespace-nowrap px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">User</th>
                        <th class="whitespace-nowrap px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">Email</th>
                        <th class="whitespace-nowrap px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">Role</th>
                        <th class="whitespace-nowrap px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">Created At</th>
                        <th class="whitespace-nowrap px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                        <th class="whitespace-nowrap px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">Actions</th>
                    </tr>
                </thead>
                <tbody id="user-table-body" class="divide-y divide-gray-200 bg-white">
                    @forelse ($users as $user)
                        <tr id="user-row-{{ $user->id }}" class="transition hover:bg-gray-50">
                            <td class="px-3 py-4 text-center text-sm font-semibold text-gray-900">{{ $user->first_name }} {{ $user->last_name }}</td>
                            <td class="px-3 py-4 text-center text-sm text-gray-700">{{ $user->email }}</td>
                            <td class="px-3 py-4 text-center">
                                @if ($user->role === 'admin')
                                    <span class="inline-flex rounded-full bg-purple-100 px-2.5 py-1 text-xs font-semibold text-purple-700">Admin</span>
                                @elseif ($user->role === 'manager')
                                    <span class="inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">Manager</span>
                                @else
                                    <span class="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700">Employee</span>
                                @endif
                            </td>
                            <td class="whitespace-nowrap px-3 py-4 text-center text-sm text-gray-700">{{ $user->created_at->format('M j, Y') }}</td>
                            <td class="px-3 py-4 text-center">
                                @if ($user->status === 'active')
                                    <span class="inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">Active</span>
                                @else
                                    <span class="inline-flex rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">Inactive</span>
                                @endif
                            </td>
                            <td class="whitespace-nowrap px-3 py-4 text-center">
                                <div class="flex items-center justify-center gap-2">
                                    <button
                                        type="button"
                                        data-id="{{ $user->id }}"
                                        class="view-user-btn rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300/60"
                                    >View</button>
                                    <button
                                        type="button"
                                        data-id="{{ $user->id }}"
                                        class="edit-user-btn rounded-md border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-300/60"
                                    >Edit</button>
                                    <button
                                        type="button"
                                        data-id="{{ $user->id }}"
                                        class="delete-user-btn rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/40"
                                    >Delete</button>
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr id="no-users">
                            <td colspan="6" class="px-6 py-12 text-center text-sm text-gray-500">No users yet.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        {{-- Card list (mobile) --}}
        <div id="user-card-list" class="divide-y divide-gray-200 md:hidden">
            @forelse ($users as $user)
                <div id="user-card-{{ $user->id }}" class="px-4 py-4">
                    <div class="flex items-start justify-between gap-3">
                        <div class="min-w-0">
                            <p class="truncate text-sm font-semibold text-gray-900">{{ $user->first_name }} {{ $user->last_name }}</p>
                            <p class="mt-1 truncate text-xs text-gray-500">{{ $user->email }}</p>
                        </div>

                        @if ($user->status === 'active')
                            <span class="shrink-0 rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">Active</span>
                        @else
                            <span class="shrink-0 rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">Inactive</span>
                        @endif
                    </div>

                    <dl class="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <div>
                            <dt class="text-xs font-semibold uppercase tracking-wide text-gray-400">Role</dt>
                            <dd class="text-gray-700">{{ ucfirst($user->role) }}</dd>
                        </div>
                        <div>
                            <dt class="text-xs font-semibold uppercase tracking-wide text-gray-400">Created At</dt>
                            <dd class="text-gray-700">{{ $user->created_at->format('M j, Y') }}</dd>
                        </div>
                    </dl>

                    <div class="mt-4 flex items-center gap-2">
                        <button
                            type="button"
                            data-id="{{ $user->id }}"
                            class="view-user-btn flex-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                        >View</button>
                        <button
                            type="button"
                            data-id="{{ $user->id }}"
                            class="edit-user-btn flex-1 rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-200"
                        >Edit</button>
                        <button
                            type="button"
                            data-id="{{ $user->id }}"
                            class="delete-user-btn flex-1 rounded-md bg-red-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-red-700"
                        >Delete</button>
                    </div>
                </div>
            @empty
                <div id="no-user-cards" class="px-4 py-12 text-center text-sm text-gray-500">No users yet.</div>
            @endforelse
        </div>
    </div>

    {{-- Add User Modal --}}
    <div id="add-user-modal" class="fixed inset-0 z-50 hidden">
        <div class="absolute inset-0 bg-black/75"></div>
        <div class="absolute left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-4 shadow-2xl sm:p-6">
            <div class="mb-1 flex items-center justify-between">
                <h2 class="text-xl font-semibold text-gray-900">Add User</h2>
                <button type="button" onclick="document.getElementById('add-user-modal').classList.add('hidden')" class="text-gray-400 transition hover:text-gray-600">&times;</button>
            </div>
            <p class="mb-6 text-sm text-gray-500">Create a new system user account.</p>

            <form id="add-user-form" method="POST" action="{{ route('admin.users.store') }}" class="space-y-4">
                @csrf

                {{-- First Name --}}
                <div>
                    <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-600">First Name</label>
                    <p id="first-name-error" class="mb-1.5 text-sm text-red-600 empty:hidden"></p>
                    <input
                        type="text"
                        name="first_name"
                        placeholder="e.g. Juan"
                        class="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                    >
                </div>

                {{-- Last Name --}}
                <div>
                    <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-600">Last Name</label>
                    <p id="last-name-error" class="mb-1.5 text-sm text-red-600 empty:hidden"></p>
                    <input
                        type="text"
                        name="last_name"
                        placeholder="e.g. Dela Cruz"
                        class="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                    >
                </div>

                {{-- Email --}}
                <div>
                    <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-600">Email</label>
                    <p id="email-error" class="mb-1.5 text-sm text-red-600 empty:hidden"></p>
                    <input
                        type="email"
                        name="email"
                        placeholder="e.g. juan@example.com"
                        class="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                    >
                </div>

                {{-- Password --}}
                <div>
                    <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-600">Password</label>
                    <p id="password-error" class="mb-1.5 text-sm text-red-600 empty:hidden"></p>
                    <input
                        type="password"
                        name="password"
                        placeholder="Minimum 8 characters"
                        class="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                    >
                </div>

                {{-- Role --}}
                <div>
                    <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-600">Role</label>
                    <p id="role-error" class="mb-1.5 text-sm text-red-600 empty:hidden"></p>
                    <select
                        name="role"
                        class="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 transition focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                    >
                        <option value="employee">Employee</option>
                        <option value="manager">Manager</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                {{-- Status --}}
                <div>
                    <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-600">Status</label>
                    <p id="status-error" class="mb-1.5 text-sm text-red-600 empty:hidden"></p>
                    <select
                        name="status"
                        class="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 transition focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>

                {{-- Buttons --}}
                <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <button type="button" onclick="document.getElementById('add-user-modal').classList.add('hidden')" class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 sm:w-auto">Cancel</button>
                    <button type="submit" class="w-full rounded-lg bg-[#11458c] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1a3450] sm:w-auto">Add User</button>
                </div>
            </form>
        </div>
    </div>

    {{-- View User Modals (one per user) --}}
    @foreach ($users as $user)
        <div id="view-user-modal-{{ $user->id }}" class="fixed inset-0 z-50 hidden">
            <div class="absolute inset-0 bg-black/60"></div>
            <div class="absolute left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-white shadow-2xl">
                {{-- Header --}}
                <div class="flex items-start justify-between gap-4 px-6 pb-4 pt-6">
                    <div>
                        <h2 class="text-2xl font-semibold tracking-tight text-gray-900">{{ $user->first_name }} {{ $user->last_name }}</h2>
                        <p class="mt-1 text-sm text-gray-400">Account EMP-{{ str_pad($user->id, 4, '0', STR_PAD_LEFT) }}</p>
                    </div>

                    <button
                        type="button"
                        onclick="document.getElementById('view-user-modal-{{ $user->id }}').classList.add('hidden')"
                        class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-teal-300 text-teal-500 transition hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-400/30"
                        aria-label="Close"
                    >
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {{-- Information grid --}}
                <div class="grid grid-cols-1 gap-x-8 gap-y-6 px-6 pb-8 sm:grid-cols-2">
                    <div>
                        <p class="text-xs font-semibold uppercase tracking-wider text-gray-400">Email</p>
                        <p class="mt-1.5 break-all text-sm text-gray-900">{{ $user->email }}</p>
                    </div>
                    <div>
                        <p class="text-xs font-semibold uppercase tracking-wider text-gray-400">Role</p>
                        <span class="mt-1.5 inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm font-medium text-gray-700">{{ ucfirst($user->role) }}</span>
                    </div>
                    <div>
                        <p class="text-xs font-semibold uppercase tracking-wider text-gray-400">Created</p>
                        <p class="mt-1.5 text-sm text-gray-900">{{ $user->created_at->format('M j, Y') }}</p>
                    </div>
                    <div>
                        <p class="text-xs font-semibold uppercase tracking-wider text-gray-400">Status</p>
                        <p class="mt-1.5 text-sm font-medium text-gray-900">{{ ucfirst($user->status) }}</p>
                    </div>
                </div>
            </div>
        </div>
    @endforeach

    {{-- Edit User Modals (one per user) --}}
    @foreach ($users as $user)
        <div id="edit-user-modal-{{ $user->id }}" class="fixed inset-0 z-50 hidden">
            <div class="absolute inset-0 bg-black/75"></div>
            <div class="absolute left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-2xl">
                <div class="mb-1 flex items-start justify-between">
                    <h2 class="text-xl font-semibold text-gray-900">Edit Account</h2>
                    <button type="button" onclick="document.getElementById('edit-user-modal-{{ $user->id }}').classList.add('hidden')" class="text-gray-400 transition hover:text-gray-600">&times;</button>
                </div>
                <p class="mb-6 text-sm text-gray-500">Update the role or status of this system account.</p>

                <form id="edit-user-form-{{ $user->id }}" class="edit-user-form space-y-4" method="POST" action="{{ route('admin.users.update', $user) }}">
                    @csrf
                    @method('PUT')

                    {{-- First Name --}}
                    <div>
                        <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-600">First Name</label>
                        <input
                            type="text"
                            name="first_name"
                            value="{{ $user->first_name }}"
                            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                        >
                    </div>

                    {{-- Last Name --}}
                    <div>
                        <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-600">Last Name</label>
                        <input
                            type="text"
                            name="last_name"
                            value="{{ $user->last_name }}"
                            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                        >
                    </div>

                    {{-- Email --}}
                    <div>
                        <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-600">Email</label>
                        <input
                            type="email"
                            name="email"
                            value="{{ $user->email }}"
                            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                        >
                    </div>

                    {{-- Password --}}
                    <div>
                        <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-600">New Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Leave blank to keep current password"
                            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                        >
                    </div>

                    {{-- Role --}}
                    <div>
                        <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-600">Role</label>
                        <select
                            name="role"
                            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                        >
                            <option value="employee" @selected($user->role === 'employee')>Employee</option>
                            <option value="manager" @selected($user->role === 'manager')>Manager</option>
                            <option value="admin" @selected($user->role === 'admin')>Admin</option>
                        </select>
                    </div>

                    {{-- Status --}}
                    <div>
                        <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-600">Status</label>
                        <select
                            name="status"
                            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                        >
                            <option value="active" @selected($user->status === 'active')>Active</option>
                            <option value="inactive" @selected($user->status === 'inactive')>Inactive</option>
                        </select>
                    </div>

                    {{-- Buttons --}}
                    <div class="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
                        <button type="button" onclick="document.getElementById('edit-user-modal-{{ $user->id }}').classList.add('hidden')" class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 sm:w-auto">Cancel</button>
                        <button type="submit" class="w-full rounded-lg bg-[#11458c] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1a3450] sm:w-auto">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    @endforeach

    {{-- Delete User Modals (one per user) --}}
    @foreach ($users as $user)
        <div id="delete-user-modal-{{ $user->id }}" class="fixed inset-0 z-50 hidden">
            <div class="absolute inset-0 bg-black/75"></div>
            <div class="absolute left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-4 shadow-2xl sm:p-6">
                <h2 class="mb-2 text-xl font-semibold text-gray-900">Delete {{ $user->first_name }} {{ $user->last_name }}?</h2>
                <p class="mb-6 text-sm text-gray-500">This action cannot be undone. The user account will be permanently deleted.</p>

                <p id="delete-user-error-{{ $user->id }}" class="mb-4 hidden rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"></p>

                <form id="delete-user-form-{{ $user->id }}" class="delete-user-form" method="POST" action="{{ route('admin.users.destroy', $user) }}">
                    @csrf
                    @method('DELETE')

                    <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                        <button type="button" onclick="document.getElementById('delete-user-modal-{{ $user->id }}').classList.add('hidden')" class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 sm:w-auto">Cancel</button>
                        <button type="submit" class="w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 sm:w-auto">Delete User</button>
                    </div>
                </form>
            </div>
        </div>
    @endforeach

    @vite('resources/js/admin/users.js')

@endsection
