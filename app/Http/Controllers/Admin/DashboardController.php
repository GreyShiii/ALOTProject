<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Department;
use App\Models\Employee;
use App\Models\LeaveRequest;
use App\Models\OvertimeRequest;

class DashboardController extends Controller
{
    public function index()
    {
        $totalEmployees =
            User::where(
                'role',
                'employee'
            )->count();

        $totalManagers =
            User::where(
                'role',
                'manager'
            )->count();

        $totalDepartments =
            Department::count();

        $recentEmployees =
            Employee::with([
                'user',
                'department',
            ])
                ->latest()
                ->take(5)
                ->get();

        $recentLeaveRequests =
            LeaveRequest::with([
                'employee.user',
                'employee.department',
            ])
                ->latest('created_at')
                ->take(5)
                ->get();

        $recentOvertimeRequests =
            OvertimeRequest::with([
                'employee.user',
                'employee.department',
            ])
                ->latest('created_at')
                ->take(5)
                ->get();

        $recentRequests =
            $recentLeaveRequests
                ->map(function ($request) {

                    return [
                        'type' =>
                            'Leave',

                        'employee' =>
                            $request->employee,

                        'date' =>
                            $request->start_date,

                        'status' =>
                            $request->status,

                        'created_at' =>
                            $request->created_at,
                    ];
                })
                ->merge(
                    $recentOvertimeRequests
                        ->map(function ($request) {

                            return [
                                'type' =>
                                    'Overtime',

                                'employee' =>
                                    $request->employee,

                                'date' =>
                                    $request->date,

                                'status' =>
                                    $request->status,

                                'created_at' =>
                                    $request->created_at,
                            ];
                        })
                )
                ->sortByDesc(
                    'created_at'
                )
                ->take(5)
                ->values();

        return view(
            'admin.dashboard',
            compact(
                'totalEmployees',
                'totalManagers',
                'totalDepartments',
                'recentEmployees',
                'recentRequests'
            )
        );
    }
}
