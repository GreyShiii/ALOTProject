<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Department;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    /**
     * Display the attendance management page.
     */
    public function index()
    {
        $departments = Department::orderBy('name')->get();

        return view(
            'admin.attendance.index',
            compact('departments')
        );
    }

    /**
     * Return attendance records as JSON.
     */
    public function data(Request $request)
    {
        $query = Attendance::with([
            'employee.user',
            'employee.department',
        ])
            ->latest('date');


        // =====================================================
        // SEARCH EMPLOYEE
        // =====================================================

        if ($request->filled('search')) {

            $search = $request->input('search');

            $query->whereHas(
                'employee.user',
                function ($userQuery) use ($search) {

                    $userQuery
                        ->where(
                            'first_name',
                            'LIKE',
                            '%' . $search . '%'
                        )
                        ->orWhere(
                            'last_name',
                            'LIKE',
                            '%' . $search . '%'
                        )
                        ->orWhere(
                            'email',
                            'LIKE',
                            '%' . $search . '%'
                        );
                }
            );
        }


        // =====================================================
        // DEPARTMENT
        // =====================================================

        if ($request->filled('department')) {

            $query->whereHas(
                'employee',
                function ($employeeQuery) use ($request) {

                    $employeeQuery->where(
                        'department_id',
                        $request->input('department')
                    );
                }
            );
        }


        // =====================================================
        // DATE
        // =====================================================

        if ($request->filled('date')) {

            $query->where(
                'date',
                $request->input('date')
            );
        }


        // =====================================================
        // STATUS
        // =====================================================

        if ($request->filled('status')) {

            $status =
                $request->input('status');


            if ($status === 'completed') {

                $query
                    ->whereNotNull('time_in')
                    ->whereNotNull('time_out');

            } elseif ($status === 'working') {

                $query
                    ->whereNotNull('time_in')
                    ->whereNull('time_out');

            } elseif ($status === 'not_started') {

                $query->whereNull('time_in');
            }
        }


        // =====================================================
        // PAGINATION
        // =====================================================

        $attendances =
            $query->paginate(10);


        return response()->json([

            'success' => true,

            'attendances' =>
                $attendances->items(),

            'pagination' => [
                'current_page' =>
                    $attendances->currentPage(),

                'last_page' =>
                    $attendances->lastPage(),

                'per_page' =>
                    $attendances->perPage(),

                'total' =>
                    $attendances->total(),
            ],

        ]);
    }
}
