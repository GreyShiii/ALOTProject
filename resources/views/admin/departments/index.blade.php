@extends('layouts.app')

@section('title', 'Department Management')
@section('breadcrumb-parent', 'Management')
@section('breadcrumb-current', 'Department Management')

@section('content')

    {{-- Flash messages --}}
    @if (session('success'))
        <div class="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-sm text-green-700">
            {{ session('success') }}
        </div>
    @endif

    @if (session('error'))
        <div class="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            {{ session('error') }}
        </div>
    @endif

    {{-- Page header --}}
    <div class="flex items-center justify-between mb-6">
        <div>
            <h1 class="text-2xl font-bold text-gray-900">Department Management</h1>
            <p class="text-gray-500 mt-1">Departments used across employee records and reporting.</p>
        </div>
        <button
            onclick="document.getElementById('add-department-modal').classList.remove('hidden')"
            class="px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
        >
            + Add Department
        </button>
    </div>

    {{-- Departments table --}}
    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100">
            <h2 class="font-semibold text-gray-900">Departments</h2>
        </div>

        <table class="w-full text-sm">
            <thead class="bg-gray-50 text-xs uppercase text-gray-500">
                <tr class="department-row">
                    <th class="text-left px-6 py-3">Department ID</th>
                    <th class="text-left px-6 py-3">Department Name</th>
                    <th class="text-left px-6 py-3">Number of Employees</th>
                    <th class="text-left px-6 py-3">Created Date</th>
                    <th class="text-right px-6 py-3">Actions</th>
                </tr>
            </thead>
            <tbody id="department-table-body" class="divide-y divide-gray-100">
                @forelse ($departments as $department)
                    <tr id="department-row-{{ $department->id }}">
                        <td class="px-6 py-4 text-blue-600 font-medium">
                            {{ 'DEP-' . str_pad($department->id, 2, '0', STR_PAD_LEFT) }}
                        </td>
                        <td class="px-6 py-4 text-gray-900">{{ $department->name }}</td>
                        <td class="px-6 py-4 text-gray-600">{{ $department->employees_count }}</td>
                        <td class="px-6 py-4 text-gray-600">{{ $department->created_at->format('M j, Y') }}</td>
                        <td class="px-6 py-4 text-right space-x-2">
                            <button
                                type="button"
                                class="edit-department-btn px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                                data-id="{{ $department->id }}">Edit
                            </button>
                            <button
                                type="button"
                                class="delete-department-btn px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
                                data-id="{{ $department->id }}">Delete
                            </button>
                        </td>
                    </tr>
                @empty
                    <tr id="no-departments">
                        <td colspan="5" class="px-6 py-8 text-center text-gray-400">
                            No departments yet.
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    {{-- Add Department Modal --}}
    <div id="add-department-modal" class="hidden fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
        <div class="bg-white rounded-xl w-full max-w-md p-6">
            <div class="flex items-center justify-between mb-1">
                <h2 class="text-lg font-bold text-gray-900">Add Department</h2>
                <button onclick="document.getElementById('add-department-modal').classList.add('hidden')" class="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <p class="text-sm text-gray-500 mb-4 text-xs">Departments group employees for reporting and approvals.</p>

            <form id="add-department-form" method="POST" action="{{ route('admin.departments.store') }}">
                @csrf
                <label class="block text-xs font-medium text-gray-700 uppercase tracking-wide mb-1">Department Name</label>
                <p id="name-error" class="text-red-500"></p>
                <input type="text" name="name" value="{{ old('name') }}" placeholder="e.g. Engineering"
                    class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500">
                @error('name') <p class="text-sm text-red-600 mb-4">{{ $message }}</p> @enderror

                <div class="flex justify-end gap-2">
                    <button type="button" onclick="document.getElementById('add-department-modal').classList.add('hidden')" class="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                    <button type="submit" class="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add Department</button>
                </div>
            </form>
        </div>
    </div>

    {{-- Edit Department Modals (one per department) --}}
    @foreach ($departments as $department)
        <div id="edit-department-modal-{{ $department->id }}" class="hidden fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
            <div class="bg-white rounded-xl w-full max-w-md p-6">
                <div class="flex items-center justify-between mb-1">
                    <h2 class="text-lg font-bold text-gray-900">Edit Department</h2>
                    <button onclick="document.getElementById('edit-department-modal-{{ $department->id }}').classList.add('hidden')" class="text-gray-400 hover:text-gray-600">✕</button>
                </div>
                <p class="text-sm text-gray-500 mb-4">Departments group employees for reporting and approvals.</p>

                <form class="edit-department-form" id="edit-department-form-{{ $department->id }}" method="POST" action="{{ route('admin.departments.update', $department) }}">
                    @csrf
                    @method('PUT')

                    <label class="block text-xs font-medium text-gray-700 uppercase tracking-wide mb-1">Department Name</label>
                    <input
                        type="text"
                        name="name"
                        value="{{ old('name', $department->name) }}"
                        class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >

                    <div class="flex justify-end gap-2">
                        <button type="button" onclick="document.getElementById('edit-department-modal-{{ $department->id }}').classList.add('hidden')" class="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                            Cancel
                        </button>
                        <button type="submit" class="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    @endforeach

    {{-- Delete Department Modals (one per department) --}}
    @foreach ($departments as $department)
        <div id="delete-department-modal-{{ $department->id }}" class="hidden fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
            <div class="bg-white rounded-xl w-full max-w-md p-6">
                <h2 class="text-lg font-bold text-gray-900 mb-2">Delete {{ $department->name }}?</h2>
                <p class="text-sm text-gray-500 mb-4">
                    This department currently has {{ $department->employees_count }} employee(s).
                    They will need to be reassigned. This action cannot be undone.
                </p>

                <form id="delete-department-form-{{ $department->id }}" class="delete-department-form" method="POST" action="{{ route('admin.departments.destroy', $department) }}">
                    @csrf
                    @method('DELETE')

                    <div class="flex justify-end gap-2">
                        <button type="button" onclick="document.getElementById('delete-department-modal-{{ $department->id }}').classList.add('hidden')" class="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                            Cancel
                        </button>
                        <button type="submit" class="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Delete Department
                        </button>
                    </div>
                </form>
            </div>
        </div>
    @endforeach

<script>
const addDepartmentForm = document.getElementById("add-department-form");
const nameError = document.getElementById("name-error");
const tbody = document.getElementById("department-table-body");
const noDepartments = document.getElementById("no-departments");
const departmentRow = document.getElementById("department-row");
const deleteForms = document.querySelectorAll(".delete-department-form");


tbody.addEventListener("click", (event) => {
    if (event.target.classList.contains("edit-department-btn")) {
        const id = event.target.getAttribute("data-id");
        const modal = document.getElementById(`edit-department-modal-${id}`);
        modal.classList.remove("hidden");
    }

    if (event.target.classList.contains("delete-department-btn")) {
        const id = event.target.getAttribute("data-id");
        const modal = document.getElementById(`delete-department-modal-${id}`);
        modal.classList.remove("hidden");
    }
});

deleteForms.forEach((form) => {
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        console.log("DELETE SUBMIT");
        try {
            const formData = new FormData(event.target);
            const response = await fetch(event.target.action, {
                method: "POST",
                body: formData,
                headers: {
                    "Accept": "application/json"
                }
            });

                const data = await response.json();
                if (!response.ok) {
                    console.error(data);
                    return;
                }

                const departmentId = event.target.id.replace("delete-department-form-", "");
                const row = document.getElementById(`department-row-${departmentId}`);
                console.log("ROW", row);

                row.remove();

                const modal = document.getElementById(`delete-department-modal-${departmentId}`);
                modal.classList.add("hidden");

        } catch (error) {
            console.error(error);
        }
    });
});

const editDepartmentForm = document.getElementById("edit-department-form");
const editForms = document.querySelectorAll(".edit-department-form");

editForms.forEach((form) => {
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const response = await fetch(event.target.action, {
            method: "POST",
            body: formData,
            headers:  {
                "Accept": "application/json"
            }
        });
        const data = await response.json();
        const formattedDate = new Date(data.department.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });

        console.log("STATUS:", response.status);
        console.log("OK:", response.ok);
        console.log("DATA:", data);

        if (response.ok) {
            const row = document.getElementById(`department-row-${data.department.id}`);
            console.log("ROW:", row);
            row.innerHTML = `
                <td class="px-6 py-4 text-blue-600 font-medium">DEP-${String(data.department.id).padStart(2, "0")}</td>
                <td class="px-6 py-4 text-gray-900">${data.department.name}</td>
                <td class="px-6 py-4 text-gray-600">0</td>
                <td class="px-6 py-4 text-gray-600">${formattedDate}</td>
                <td class="px-6 py-4 text-right space-x-2">
                    <button
                        type="button"
                        data-id="${data.department.id}"
                        class="edit-department-btn px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Edit
                    </button>

                    <button
                        type="button"
                        data-id="${data.department.id}"
                        class="delete-department-btn px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">Delete
                    </button>
                </td>
            `;

            const modal = document.getElementById(`edit-department-modal-${data.department.id}`);
            modal.classList.add("hidden");
        }
    });
})

addDepartmentForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    nameError.textContent = "";

    try {
        const formData = new FormData(event.target);

        const response = await fetch(event.target.action, {
            method: "POST",
            body: formData,
            headers: {
                "Accept": "application/json"
            }
        });

        const data = await response.json();
        const formattedDate = new Date(data.department.created_at)
            .toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
            });

        console.log("STATUS:", response.status);
        console.log("OK:", response.ok);
        console.log("DATA:", data);

        if (!response.ok) {
            nameError.textContent = data.errors.name[0];
            console.log(data.errors);
            console.log(data.errors.name);
            console.log(data.errors.name[0]);
        } else {

            if (noDepartments) {
                noDepartments.remove();
            }

            tbody.innerHTML += `
                <tr id="department-row-${data.department.id}">
                    <td class="px-6 py-4 text-blue-600 font-medium">DEP-${String(data.department.id).padStart(2, "0")}</td>
                    <td class="px-6 py-4 text-gray-900">${data.department.name}</td>
                    <td class="px-6 py-4 text-gray-600">0</td>
                    <td class="px-6 py-4 text-gray-600">${formattedDate}</td>
                    <td class="px-6 py-4 text-right space-x-2">
                        <button
                            type="button"
                            data-id="${data.department.id}"
                            class="edit-department-btn px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Edit
                        </button>

                        <button
                            type="button"
                            data-id="${data.department.id}"
                            class="delete-department-btn px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">Delete
                        </button>
                    </td>
                </tr>
            `;
            addDepartmentForm.reset();
            window.location.reload();
            const modal = document.getElementById("add-department-modal");
            modal.classList.add("hidden");
        }
    } catch (error) {
        console.error(error);
    }
});
</script>

@endsection
