<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreEmployeeRequest;
use App\Http\Requests\Admin\UpdateEmployeeRequest;
use App\Models\Department;
use App\Models\Employee;
use App\Models\User;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $employees = Employee::with(['user', 'department', 'manager'])->get();
        $departments = Department::all();
        $managers = Employee::with('user')
            ->whereHas('user', function ($query) {
                $query->where('role', 'manager');
            })
            ->get();

        return view('admin.employees.index', compact('employees', 'departments', 'managers'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEmployeeRequest $request)
    {
        $data = $request->validated();

        $user = User::create([
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'email' => $data['email'],
            'password' => $data['password'],
            'role' => $data['role'],
        ]);

        $employee = Employee::create([
            'user_id' => $user->id,
            'department_id' => $data['department_id'],
            'manager_id' => $data['manager_id'] ?? null,
            'position' => $data['position'],
            'hire_date' => $data['hire_date'] ?? null,
        ]);

        $employee->load(['user', 'department', 'manager.user']);

        return response()->json([
            'message' => 'Employee created successfully.',
            'employee' => $employee,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Employee $employee)
    {
        $employee->load(['user', 'department', 'manager']);
        return response()->json(['employee' => $employee]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEmployeeRequest $request, Employee $employee)
    {
        $data = $request->validated();

            $employee->user->update([
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'email' => $data['email'],
                'role' => $data['role'],
            ]);

            if (!empty($data['password'])) {
                $employee->user->update(['password' => $data['password']]);
            }

            $employee->update([
                'department_id' => $data['department_id'],
                'manager_id' => $data['manager_id'] ?? null,
                'position' => $data['position'],
                'hire_date' => $data['hire_date'] ?? null,
            ]);

        $employee->load(['user', 'department', 'manager.user',]);

        return response()->json([
            'message' => 'Employee updated successfully.',
            'employee' => $employee,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Employee $employee)
    {
        $user = $employee->user;

        $employee->delete();
        $user->delete();

        return response()->json([
            'message' => 'Employee deleted successfully',
            'employee_id' => $employee->id,
        ]);
    }
}
