<?php
namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use Illuminate\Support\Facades\Auth;

class AttendanceController extends Controller
{
    public function timeIn()
    {
        $employee = Auth::user()->employee;

        if (!$employee) {
            return response()->json([
                'success' => false,
                'message' => 'Employee record not found.',
            ], 404);
        }

        $attendance = Attendance::firstOrCreate(
            [
                'employee_id' => $employee->id,
                'date' => today('Asia/Manila'),
            ],
            [
                'time_in' => now('Asia/Manila'),
            ]
        );

        if ($attendance->time_in) {
            return response()->json([
                'success' => true,
                'message' => 'Time in recorded successfully.',
                'attendance' => $attendance,
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Unable to record time in.',
        ], 500);
    }

    public function timeOut()
    {
        $employee = Auth::user()->employee;

        if (!$employee) {
            return response()->json([
                'success' => false,
                'message' => 'Employee record not found.',
            ], 404);
        }

        $attendance = Attendance::where('employee_id', $employee->id)
            ->whereDate('date', today('Asia/Manila'))
            ->whereNotNull('time_in')
            ->whereNull('time_out')
            ->first();


        if (!$attendance) {
            return response()->json([
                'success' => false,
                'message' => 'No active attendance record found.',
            ], 404);
        }

        $attendance->update([
            'time_out' => now('Asia/Manila'),
        ]);

        $attendance->refresh();

        return response()->json([
            'success' => true,
            'message' => 'Time out recorded successfully.',
            'attendance' => $attendance,
        ]);
    }
}
