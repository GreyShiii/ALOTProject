<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\LeaveRequest;
use App\Models\OvertimeRequest;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{

    public function index()
    {
        $employee = Auth::user()->employee;

        if (!$employee) {
            abort(403, 'Employee record not found.');
        }

        $todayAttendance = Attendance::where('employee_id', $employee->id)
            ->whereDate('date', today())
            ->first();

        $currentYear = now()->year;

        $pendingLeaveCount = LeaveRequest::where('employee_id', $employee->id)
            ->where('status', 'Pending')
            ->count();

        $pendingOvertimeCount = OvertimeRequest::where('employee_id', $employee->id)
            ->where('status', 'Pending')
            ->count();

        $approvedLeaveCount = LeaveRequest::where('employee_id', $employee->id)
            ->where('status', 'Approved')
            ->whereYear('start_date', $currentYear)
            ->count();

        $approvedOvertimeCount = OvertimeRequest::where('employee_id', $employee->id)
            ->where('status', 'Approved')
            ->whereYear('date', $currentYear)
            ->count();

        $recentLeaveRequests = LeaveRequest::where('employee_id', $employee->id)
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($request) {
                return [
                    'type' => $this->formatLeaveType($request->leave_type),
                    'date' => $this->formatDateRange(
                        $request->start_date,
                        $request->end_date
                    ),
                    'reason' => $request->reason,
                    'submitted' => $request->created_at->format('M j, Y'),
                    'status' => $request->status,
                    'created_at' => $request->created_at,
                ];
            });

        $recentOvertimeRequests = OvertimeRequest::where('employee_id', $employee->id)
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($request) {
                return [
                    'type' => 'Overtime',
                    'date' => $request->date->format('M j, Y') .
                        ' · ' .
                        $request->hours .
                        'h',
                    'reason' => $request->reason,
                    'submitted' => $request->created_at->format('M j, Y'),
                    'status' => $request->status,
                    'created_at' => $request->created_at,
                ];
            });

        $recentRequests = $recentLeaveRequests
            ->concat($recentOvertimeRequests)
            ->sortByDesc('created_at')
            ->take(5)
            ->values();

        return view('employee.dashboard', compact(
            'employee',
            'todayAttendance',
            'pendingLeaveCount',
            'pendingOvertimeCount',
            'approvedLeaveCount',
            'approvedOvertimeCount',
            'recentRequests'
        ));
    }

    public function data()
    {
        $employee = Auth::user()->employee;

        if (!$employee) {
            return response()->json([
                'message' => 'Employee record not found.'
            ], 403);
        }

        $todayAttendance = Attendance::where('employee_id', $employee->id)
            ->whereDate('date', today())
            ->first();

        $status = 'not_started';

        if ($todayAttendance?->time_in && !$todayAttendance?->time_out) {
            $status = 'working';
        } elseif ($todayAttendance?->time_in && $todayAttendance?->time_out) {
            $status = 'completed';
        }

        $totalHours = null;

        if ($todayAttendance?->time_in && $todayAttendance?->time_out) {
            $totalMinutes = $todayAttendance->time_in
                ->diffInMinutes($todayAttendance->time_out);

            $hours = intdiv($totalMinutes, 60);
            $minutes = $totalMinutes % 60;

            $totalHours = "{$hours}h " . str_pad(
                $minutes,
                2,
                '0',
                STR_PAD_LEFT
            ) . "m";
        }

        return response()->json([
            'attendance' => [
                'status' => $status,

                'time_in' => $todayAttendance?->time_in
                    ? $todayAttendance->time_in->format('h:i A')
                    : null,

                'time_out' => $todayAttendance?->time_out
                    ? $todayAttendance->time_out->format('h:i A')
                    : null,

                'total_hours' => $totalHours,
            ],
        ]);
    }

    private function formatLeaveType($type)
    {
        return match ($type) {
            'vacation' => 'Vacation Leave',
            'sick' => 'Sick Leave',
            'emergency' => 'Emergency Leave',
            default => ucwords(str_replace('_', ' ', $type)),
        };
    }

    private function formatDateRange($startDate, $endDate)
    {
        if ($startDate->equalTo($endDate)) {
            return $startDate->format('M j, Y');
        }

        if ($startDate->format('Y') === $endDate->format('Y')) {
            if ($startDate->format('m') === $endDate->format('m')) {
                return $startDate->format('M j')
                    . '–'
                    . $endDate->format('j, Y');
            }

            return $startDate->format('M j')
                . '–'
                . $endDate->format('M j, Y');
        }

        return $startDate->format('M j, Y')
            . '–'
            . $endDate->format('M j, Y');
    }
}
