<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use App\Models\LeaveRequest;
use App\Models\OvertimeRequest;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $manager = Auth::user()->employee;

        $teamEmployeeIds = $manager->subordinates()
            ->pluck('id');

        $pendingLeaveCount = LeaveRequest::whereIn(
            'employee_id',
            $teamEmployeeIds
        )
            ->where('status', 'Pending')
            ->count();

        $pendingOvertimeCount = OvertimeRequest::whereIn(
            'employee_id',
            $teamEmployeeIds
        )
            ->where('status', 'Pending')
            ->count();

        $teamMemberCount = $teamEmployeeIds->count();

        $approvedLeaveCount = LeaveRequest::whereIn(
            'employee_id',
            $teamEmployeeIds
        )
            ->where('status', 'Approved')
            ->count();

        $approvedOvertimeCount = OvertimeRequest::whereIn(
            'employee_id',
            $teamEmployeeIds
        )
            ->where('status', 'Approved')
            ->count();

        $approvedRequestCount =
            $approvedLeaveCount +
            $approvedOvertimeCount;

        $pendingLeaveRequests = LeaveRequest::with([
            'employee.user',
            'employee.department',
        ])
            ->whereIn('employee_id', $teamEmployeeIds)
            ->where('status', 'Pending')
            ->latest('created_at')
            ->get();

        $pendingOvertimeRequests = OvertimeRequest::with([
            'employee.user',
            'employee.department',
        ])
            ->whereIn('employee_id', $teamEmployeeIds)
            ->where('status', 'Pending')
            ->latest('date')
            ->get();

        return view('manager.dashboard', compact(
            'pendingLeaveCount',
            'pendingOvertimeCount',
            'teamMemberCount',
            'approvedRequestCount',
            'pendingLeaveRequests',
            'pendingOvertimeRequests'
        ));
    }
}
