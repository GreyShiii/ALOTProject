<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Models\LeaveRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LeaveController extends Controller
{
    public function index()
    {
        $employee = Auth::user()->employee;

        $leaveRequests = LeaveRequest::where('employee_id', $employee->id)
            ->latest('created_at')
            ->paginate(5);

        $pendingCount = LeaveRequest::where('employee_id', $employee->id)
            ->where('status', 'Pending')
            ->count();

        $approvedCount = LeaveRequest::where('employee_id', $employee->id)
            ->where('status', 'Approved')
            ->count();

        $rejectedCount = LeaveRequest::where('employee_id', $employee->id)
            ->where('status', 'Rejected')
            ->count();

        $totalCount = LeaveRequest::where('employee_id', $employee->id)
            ->count();

        return view('employee.leave.index', compact(
            'employee',
            'leaveRequests',
            'pendingCount',
            'approvedCount',
            'rejectedCount',
            'totalCount'
        ));
    }

    public function store(Request $request)
    {
        $employee = Auth::user()->employee;

        $validated = $request->validate([
            'leave_type' => 'required|in:Sick,Vacation,Emergency,Bereavement',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'nullable|string|max:500',
        ]);

        LeaveRequest::create([
            'employee_id' => $employee->id,
            'leave_type' => $validated['leave_type'],
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'reason' => $validated['reason'] ?? null,
            'status' => 'Pending',
        ]);

        return redirect()
            ->route('employee.leave.index')
            ->with('success', 'Leave request submitted successfully.');
    }
}
