<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Departments
        $engineering = Department::create(['name' => 'Engineering']);
        $hr = Department::create(['name' => 'Human Resources']);

        // Admin
        $adminUser = User::create([
            'first_name' => 'Admin',
            'last_name' => 'User',
            'email' => 'admin@company.com',
            'password' => 'password',
            'role' => 'admin',
            'status' => 'active',
        ]);

        Employee::create([
            'user_id' => $adminUser->id,
            'department_id' => $hr->id,
            'position' => 'System Administrator',
            'hire_date' => '2020-01-05',
        ]);

        // Manager
        $managerUser = User::create([
            'first_name' => 'Daniel',
            'last_name' => 'Reyes',
            'email' => 'daniel.reyes@company.com',
            'password' => 'password',
            'role' => 'manager',
            'status' => 'active',
        ]);

        $managerEmployee = Employee::create([
            'user_id' => $managerUser->id,
            'department_id' => $engineering->id,
            'position' => 'Engineering Manager',
            'hire_date' => '2021-03-02',
        ]);

        // Employee (reports to Daniel)
        $employeeUser = User::create([
            'first_name' => 'Bea Marie',
            'last_name' => 'Oca',
            'email' => 'bea.oca@company.com',
            'password' => 'password',
            'role' => 'employee',
            'status' => 'active',
        ]);

        Employee::create([
            'user_id' => $employeeUser->id,
            'department_id' => $engineering->id,
            'manager_id' => $managerEmployee->id,
            'position' => 'Senior Software Engineer',
            'hire_date' => '2024-02-14',
        ]);

        // Inactive employee (to test the "deactivated" login block)
        $inactiveUser = User::create([
            'first_name' => 'Inactive',
            'last_name' => 'Tester',
            'email' => 'inactive@company.com',
            'password' => 'password',
            'role' => 'employee',
            'status' => 'inactive',
        ]);

        Employee::create([
            'user_id' => $inactiveUser->id,
            'department_id' => $engineering->id,
            'manager_id' => $managerEmployee->id,
            'position' => 'Former Employee',
            'hire_date' => '2023-01-10',
        ]);
    }
}
