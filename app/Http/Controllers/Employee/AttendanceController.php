<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use Illuminate\Support\Facades\Auth;

class AttendanceController extends Controller
{
    public function index()
    {
        $employee = Auth::user()->employee;

        $query = Attendance::where('employee_id', $employee->id);

        if (request('search')) {
            $search = request('search');

            $query->where(function ($query) use ($search) {
                $query->whereDate('date', $search)
                    ->orWhereRaw("DATE_FORMAT(date, '%M %e, %Y') LIKE ?", ["%{$search}%"])
                    ->orWhereRaw("DATE_FORMAT(date, '%b %e, %Y') LIKE ?", ["%{$search}%"]);
            });
        }

        if (request('date')) {
            $query->whereDate('date', request('date'));
        }

        if (request('status')) {

            if (request('status') === 'working') {
                $query->whereNotNull('time_in')
                    ->whereNull('time_out');
            }

            if (request('status') === 'completed') {
                $query->whereNotNull('time_in')
                    ->whereNotNull('time_out');
            }

            if (request('status') === 'not_started') {
                $query->whereNull('time_in')
                    ->whereNull('time_out');
            }
        }

        $attendances = $query
            ->latest('date')
            ->paginate(10)
            ->withQueryString();

        if (request()->ajax()) {
            return view('employee.attendance.partials.table', compact('attendances'));
        }

        return view('employee.attendance.index', compact(
            'employee',
            'attendances'
        ));
    }


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
                'date' => today(),
            ],
            [
                'time_in' => now(),
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
            ->whereDate('date', today())
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
            'time_out' => now(),
        ]);

        $attendance->refresh();

        return response()->json([
            'success' => true,
            'message' => 'Time out recorded successfully.',
            'attendance' => $attendance,
        ]);
    }
}
