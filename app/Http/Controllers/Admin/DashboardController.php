<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Department;
use App\Models\Employee;

class DashboardController extends Controller
{
    public function index()
    {
        $totalEmployees = User::where('role', 'employee')->count();

        $totalManagers = User::where('role', 'manager')->count();

        $totalDepartments = Department::count();

        $recentEmployees = Employee::with(['user', 'department'])
            ->latest()
            ->take(5)
            ->get();

        return view('admin.dashboard', compact(
            'totalEmployees',
            'totalManagers',
            'totalDepartments',
            'recentEmployees'
        ));
    }
}
