<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        // Get the currently logged-in user's employee record
        $employee = Auth::user()->employee;

        // Get today's attendance record
        $todayAttendance = Attendance::where('employee_id', $employee->id)
            ->whereDate('date', today())
            ->first();

        return view('employee.dashboard', compact(
            'employee',
            'todayAttendance'
        ));
    }
}
