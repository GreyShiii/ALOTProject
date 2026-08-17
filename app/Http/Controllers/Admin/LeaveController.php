<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\LeaveRequest;
use Illuminate\Http\Request;

class LeaveController extends Controller
{
    /**
     * Display all leave requests.
     */
    public function index()
    {
        $leaveRequests = LeaveRequest::with([
            'employee.user',
            'employee.department',
            'approver',
        ])
            ->latest('created_at')
            ->get();

        $departments = Department::orderBy('name')->get();

        return view(
            'admin.leave.index',
            compact('leaveRequests', 'departments')
        );
    }

    /**
     * Return all leave requests as JSON.
     */
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
