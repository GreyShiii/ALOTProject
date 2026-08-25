<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\OvertimeRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OvertimeController extends Controller
{
    public function index()
    {
        $employee =
            Employee::where(
                'user_id',
                Auth::id()
            )->firstOrFail();

        $overtimeRequests =
            OvertimeRequest::where(
                'employee_id',
                $employee->id
            )
            ->latest('date')
            ->simplePaginate(10)
            ->withQueryString();

        $pendingCount =
            OvertimeRequest::where(
                'employee_id',
                $employee->id
            )
            ->where(
                'status',
                'Pending'
            )
            ->count();

        $approvedCount =
            OvertimeRequest::where(
                'employee_id',
                $employee->id
            )
            ->where(
                'status',
                'Approved'
            )
            ->count();

        $rejectedCount =
            OvertimeRequest::where(
                'employee_id',
                $employee->id
            )
            ->where(
                'status',
                'Rejected'
            )
            ->count();

        $totalCount =
            OvertimeRequest::where(
                'employee_id',
                $employee->id
            )->count();

        $approvedHours =
            OvertimeRequest::where(
                'employee_id',
                $employee->id
            )
            ->where(
                'status',
                'Approved'
            )
            ->sum('hours');

        return view(
            'employee.overtime.index',
            compact(
                'overtimeRequests',
                'pendingCount',
                'approvedCount',
                'rejectedCount',
                'totalCount',
                'approvedHours'
            )
        );
    }


    public function data()
    {
        $employee =
            Employee::where(
                'user_id',
                Auth::id()
            )->firstOrFail();


        $overtimeRequests =
            OvertimeRequest::where(
                'employee_id',
                $employee->id
            )
            ->latest('date')
            ->get();


        return response()->json([
            'success' => true,

            'overtimeRequests' =>
            $overtimeRequests,
        ]);
    }


    public function store(
        Request $request
    ) {

        $employee =
            Employee::where(
                'user_id',
                Auth::id()
            )->firstOrFail();


        $validated =
            $request->validate([
                'date' => ['required', 'date',],
                'hours' => ['required', 'numeric', 'min:0.5', 'max:6',],
                'reason' => ['nullable', 'string', 'max:500',],
            ]);

        $overtime =
            OvertimeRequest::create([
                'employee_id' => $employee->id,
                'date' => $validated['date'],
                'hours' => $validated['hours'],
                'reason' => $validated['reason'] ?? null,
                'status' => 'Pending',
                ]);

        return response()->json([
            'success' => true,
            'message' => 'Overtime request submitted successfully!',
            'data' => $overtime,
        ]);
    }
}
