<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\OvertimeRequest;

class OvertimeController extends Controller
{
    /**
     * Display all overtime requests.
     */
    public function index()
    {
        $departments = Department::orderBy('name')->get();

        return view('admin.overtime.index', compact('departments'));
    }

    /**
     * Return all overtime requests as JSON.
     */
    public function data()
    {
        $overtimeRequests = OvertimeRequest::with([
            'employee.user',
            'employee.department',
            'approver',
        ])
            ->latest('date')
            ->get();

        return response()->json([
            'success' => true,
            'overtimeRequests' => $overtimeRequests,
        ]);
    }
}
