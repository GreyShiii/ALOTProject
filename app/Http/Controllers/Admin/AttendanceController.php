<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Department;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    public function index()
    {
        $departments = Department::orderBy('name')->get();

        return view(
            'admin.attendance.index',
            compact('departments')
        );
    }

    public function data(Request $request)
    {
        $attendances = Attendance::with([
            'employee.user',
            'employee.department',
        ])
            ->latest('date')
            ->get();

        return response()->json([
            'success' => true,
            'attendances' => $attendances,
        ]);
    }
}
