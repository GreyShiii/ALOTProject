<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Department;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        // Build the attendance query
        $query = Attendance::with([
            'employee.user',
            'employee.department',
        ]);

        // Employee search
        if ($request->filled('search')) {
            $query->whereHas('employee', function ($employeeQuery) use ($request) {
                $employeeQuery->whereHas('user', function ($userQuery) use ($request) {
                    $userQuery
                        ->where(
                            'first_name',
                            'LIKE',
                            '%' . $request->input('search') . '%'
                        )
                        ->orWhere(
                            'last_name',
                            'LIKE',
                            '%' . $request->input('search') . '%'
                        );
                });
            });
        }

        // Department filter
        if ($request->filled('department')) {
            $query->whereHas('employee', function ($employeeQuery) use ($request) {
                $employeeQuery->where(
                    'department_id',
                    $request->input('department')
                );
            });
        }

        if ($request->filled('date')) {
            $query->where('date', $request->input('date'));
        }

        // Status logic


        if ($request->filled('status')) {
            $status = $request->input('status');

            if ($status === 'completed') {
                $query->whereNotNull('time_in')
                      ->whereNotNull('time_out');

            } else if ($status === 'working') {
                $query->whereNotNull('time_in')
                      ->whereNull('time_out');

            } else if ($status === 'not_started') {
                $query->whereNull('time_in');
            }
        }

        // Execute the attendance query AFTER all filters are added
        $attendances = $query->paginate(10);

        // Get departments separately for the dropdown
        $departments = Department::orderBy('name')->get();

        return view(
            'admin.attendance.index',
            compact('attendances', 'departments')
        );
    }
}
