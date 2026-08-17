<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\DepartmentController;
use App\Http\Controllers\Admin\EmployeeController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\AttendanceController as AdminAttendanceController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Employee\AttendanceController as EmployeeAttedanceController;
use App\Http\Controllers\Employee\DashboardController as EmployeeDashboardController;
use App\Http\Controllers\Employee\LeaveController;
use App\Http\Controllers\Employee\OvertimeController;
use App\Http\Controllers\Employee\ProfileController;
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

            Route::get('/', [EmployeeAttedanceController::class, 'index'])
                ->name('index');

            Route::post('/time-in', [EmployeeAttedanceController::class, 'timeIn'])
                ->name('timeIn');

            Route::post('/time-out', [EmployeeAttedanceController::class, 'timeOut'])
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

            Route::get('/', [LeaveController::class, 'index'])
                ->name('index');

            Route::get('/data', [LeaveController::class, 'data'])
                ->name('data');

            Route::post('/', [LeaveController::class, 'store'])
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

            Route::post('/', [OvertimeController::class, 'store'])
                ->name('store');

        });


    /*
    |--------------------------------------------------------------------------
    | Manager Dashboard
    |--------------------------------------------------------------------------
    */

    Route::get('/manager/dashboard', function () {
        return view('manager.dashboard');
    })->name('manager.dashboard');


/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

Route::middleware('admin')
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

    Route::get('/dashboard', [AdminDashboardController::class, 'index'])
        ->name('dashboard');

    Route::resource('departments', DepartmentController::class)
        ->only([
            'index',
            'store',
            'update',
            'destroy',
        ]);

    Route::resource('employees', EmployeeController::class)
        ->only([
            'index',
            'store',
            'show',
            'update',
            'destroy',
        ]);

    Route::resource('users', UserController::class)
        ->only([
            'index',
            'update',
        ]);

    Route::post('/users/{user}/deactivate', [UserController::class, 'deactivate'])
        ->name('users.deactivate');

    Route::post('/users/{user}/activate', [UserController::class, 'activate'])
        ->name('users.activate');

    Route::get('/attendance', [AdminAttendanceController::class, 'index'])
        ->name('attendance.index');

});

});
