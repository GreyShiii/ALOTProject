<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\DepartmentController;
use App\Http\Controllers\Admin\EmployeeController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\AttendanceController as AdminAttendanceController;
use App\Http\Controllers\Admin\LeaveController as AdminLeaveController;
use App\Http\Controllers\Admin\OvertimeController as AdminOvertimeController;

use App\Http\Controllers\Auth\LoginController;

use App\Http\Controllers\Employee\AttendanceController as EmployeeAttendanceController;
use App\Http\Controllers\Employee\DashboardController as EmployeeDashboardController;
use App\Http\Controllers\Employee\LeaveController as EmployeeLeaveController;
use App\Http\Controllers\Employee\OvertimeController;
use App\Http\Controllers\Employee\ProfileController;

use App\Http\Controllers\Manager\LeaveController as ManagerLeaveController;
use App\Http\Controllers\Manager\OvertimeController as ManagerOvertimeController;
use App\Http\Controllers\Manager\TeamController;
use App\Http\Controllers\Manager\DashboardController as ManagerDashboardController;

use Illuminate\Support\Facades\Route;


/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return redirect()->route('login');
});


/*
|--------------------------------------------------------------------------
| Guest Routes
|--------------------------------------------------------------------------
*/

Route::middleware('guest')->group(function () {

    Route::get('/login', [LoginController::class, 'create'])
        ->name('login');

    Route::post('/login', [LoginController::class, 'store'])
        ->name('login.attempt');

});


/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Logout
    |--------------------------------------------------------------------------
    */

    Route::post('/logout', [LoginController::class, 'destroy'])
        ->name('logout');


    /*
    |--------------------------------------------------------------------------
    | Employee Profile
    |--------------------------------------------------------------------------
    */

    Route::prefix('employee/profile')
        ->name('employee.profile.')
        ->group(function () {

            Route::get('/', [ProfileController::class, 'index'])
                ->name('index');

            Route::put('/', [ProfileController::class, 'update'])
                ->name('update');

            Route::put('/password', [ProfileController::class, 'updatePassword'])
                ->name('password.update');

        });


    /*
    |--------------------------------------------------------------------------
    | Employee Dashboard
    |--------------------------------------------------------------------------
    */

    Route::get('/employee/dashboard', [EmployeeDashboardController::class, 'index'])
        ->name('employee.dashboard');

    Route::get('/employee/dashboard/data', [EmployeeDashboardController::class, 'data'])
        ->name('employee.dashboard.data');


    /*
    |--------------------------------------------------------------------------
    | Employee Attendance
    |--------------------------------------------------------------------------
    */

    Route::prefix('employee/attendance')
        ->name('employee.attendance.')
        ->group(function () {

            Route::get('/', [EmployeeAttendanceController::class, 'index'])
                ->name('index');

            Route::post('/time-in', [EmployeeAttendanceController::class, 'timeIn'])
                ->name('timeIn');

            Route::post('/time-out', [EmployeeAttendanceController::class, 'timeOut'])
                ->name('timeOut');

        });


    /*
    |--------------------------------------------------------------------------
    | Employee Leave
    |--------------------------------------------------------------------------
    */

    Route::prefix('employee/leave')
        ->name('employee.leave.')
        ->group(function () {

            Route::get('/', [EmployeeLeaveController::class, 'index'])
                ->name('index');

            Route::get('/data', [EmployeeLeaveController::class, 'data'])
                ->name('data');

            Route::post('/', [EmployeeLeaveController::class, 'store'])
                ->name('store');

        });


    /*
    |--------------------------------------------------------------------------
    | Employee Overtime
    |--------------------------------------------------------------------------
    */

Route::prefix('employee/overtime')
    ->name('employee.overtime.')
    ->group(function () {

        Route::get('/', [OvertimeController::class, 'index'])
            ->name('index');

        Route::get('/data', [OvertimeController::class, 'data'])
            ->name('data');

        Route::post('/', [OvertimeController::class, 'store'])
            ->name('store');

    });


    /*
    |--------------------------------------------------------------------------
    | Manager Dashboard
    |--------------------------------------------------------------------------
    */

    Route::get('/manager/dashboard', [ManagerDashboardController::class, 'index'])
        ->name('manager.dashboard');


    /*
    |--------------------------------------------------------------------------
    | Manager Leave Requests
    |--------------------------------------------------------------------------
    */

    Route::prefix('manager/leave')
        ->name('manager.leave.')
        ->group(function () {

            Route::get('/', [ManagerLeaveController::class, 'index'])
                ->name('index');

            Route::get('/data', [ManagerLeaveController::class, 'data'])
                ->name('data');

            Route::post('/{leaveRequest}/approve', [ManagerLeaveController::class, 'approve'])
                ->name('approve');

            Route::post('/{leaveRequest}/reject', [ManagerLeaveController::class, 'reject'])
                ->name('reject');

        });


    /*
    |--------------------------------------------------------------------------
    | Manager Overtime Requests
    |--------------------------------------------------------------------------
    */

    Route::prefix('manager/overtime')
        ->name('manager.overtime.')
        ->group(function () {

            Route::get('/', [ManagerOvertimeController::class, 'index'])
                ->name('index');

            Route::get('/data', [ManagerOvertimeController::class, 'data'])
                ->name('data');

            Route::post('/{overtimeRequest}/approve', [ManagerOvertimeController::class, 'approve'])
                ->name('approve');

            Route::post('/{overtimeRequest}/reject', [ManagerOvertimeController::class, 'reject'])
                ->name('reject');

        });


    /*
    |--------------------------------------------------------------------------
    | Manager Team
    |--------------------------------------------------------------------------
    */

    Route::get('/manager/team', [TeamController::class, 'index'])
        ->name('manager.team.index');


    /*
    |--------------------------------------------------------------------------
    | Manager Profile
    |--------------------------------------------------------------------------
    |
    | Uses the same ProfileController as Employee Profile.
    | The Blade decides which route prefix to use.
    |
    */

    Route::prefix('manager/profile')
        ->name('manager.profile.')
        ->group(function () {

            Route::get('/', [ProfileController::class, 'index'])
                ->name('index');

            Route::put('/', [ProfileController::class, 'update'])
                ->name('update');

            Route::put('/password', [ProfileController::class, 'updatePassword'])
                ->name('password.update');

        });


    /*
    |--------------------------------------------------------------------------
    | Admin Routes
    |--------------------------------------------------------------------------
    */

    Route::middleware('admin')
        ->prefix('admin')
        ->name('admin.')
        ->group(function () {

            // Dashboard
            Route::get('/dashboard', [AdminDashboardController::class, 'index'])
                ->name('dashboard');


            // Employees
            Route::resource('employees', EmployeeController::class)
                ->only([
                    'index',
                    'store',
                    'show',
                    'update',
                    'destroy',
                ]);


            // Users
            Route::resource('users', UserController::class)
                ->only([
                    'index',
                    'update',
                ]);

            Route::post('/users/{user}/deactivate', [UserController::class, 'deactivate'])
                ->name('users.deactivate');

            Route::post('/users/{user}/activate', [UserController::class, 'activate'])
                ->name('users.activate');


            // Departments
            Route::resource('departments', DepartmentController::class)
                ->only([
                    'index',
                    'store',
                    'update',
                    'destroy',
                ]);


            // Attendance
            Route::get('/attendance', [AdminAttendanceController::class, 'index'])
                ->name('attendance.index');

            Route::get('/attendance/data', [AdminAttendanceController::class, 'data'])
                ->name('attendance.data');


            // Leave
            Route::get('/leave', [AdminLeaveController::class, 'index'])
                ->name('leave.index');

            Route::get('/leave/data', [AdminLeaveController::class, 'data'])
                ->name('leave.data');


            // Overtime
            Route::get('/overtime', [AdminOvertimeController::class, 'index'])
                ->name('overtime.index');

            Route::get('/overtime/data', [AdminOvertimeController::class, 'data'])
                ->name('overtime.data');


            // =================================================
            // ADMIN PROFILE
            // =================================================

            Route::prefix('profile')
                ->name('profile.')
                ->group(function () {

                    Route::get('/', [ProfileController::class, 'index'])
                        ->name('index');

                    Route::put('/', [ProfileController::class, 'update'])
                        ->name('update');

                    Route::put('/password', [ProfileController::class, 'updatePassword'])
                        ->name('password.update');

                });

        });

});
