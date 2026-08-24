<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\LeaveRequest;

class LeaveController extends Controller
{
    public function index()
    {
        $leaveRequests = LeaveRequest::with([
            'employee.user',
            'employee.department',
            'approver',
        ])
            ->latest('created_at')
            ->get();

        $departments =
            Department::orderBy('name')->get();

        return view(
            'admin.leave.index',
            compact(
                'leaveRequests',
                'departments'
            )
        );
    }

    public function data()
    {
        $leaveRequests = LeaveRequest::with([
            'employee.user',
            'employee.department',
            'approver',
        ])
            ->latest('created_at')
            ->get();

        return response()->json([
            'success' => true,
            'leaveRequests' => $leaveRequests,
        ]);
    }
}
