<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\DepartmentController;
use App\Http\Controllers\Admin\EmployeeController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Employee\AttendanceController;
use App\Http\Controllers\Employee\DashboardController as EmployeeDashboardController;
use App\Http\Controllers\Employee\LeaveController;
use App\Http\Controllers\Employee\OvertimeController;
use App\Http\Controllers\Employee\ProfileController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::middleware('guest')->group(function () {
    Route::get('/login', [LoginController::class, 'create'])->name('login');
    Route::post('/login', [LoginController::class, 'store'])->name('login.attempt');
});

Route::middleware('auth')->group(function () {

    Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');

    Route::prefix('employee/profile')->name('employee.profile.')->group(function () {
        Route::get('/', [ProfileController::class, 'index'])->name('index');
        Route::put('/', [ProfileController::class, 'update'])->name('update');
        Route::put('/password', [ProfileController::class, 'updatePassword'])->name('password.update');
    });

    Route::get('/employee/dashboard', [EmployeeDashboardController::class, 'index'])->name('employee.dashboard');
    Route::get('/employee/dashboard/data', [EmployeeDashboardController::class, 'data'])->name('employee.dashboard.data');

    Route::prefix('employee/attendance')->name('employee.attendance.')->group(function () {
        Route::get('/', [AttendanceController::class, 'index'])->name('index');
        Route::post('/time-in', [AttendanceController::class, 'timeIn'])->name('timeIn');
        Route::post('/time-out', [AttendanceController::class, 'timeOut'])->name('timeOut');
    });

    Route::prefix('employee/leave')->name('employee.leave.')->group(function () {
        Route::get('/', [LeaveController::class, 'index'])->name('index');
        Route::get('/data', [LeaveController::class, 'data'])->name('data');
        Route::post('/', [LeaveController::class, 'store'])->name('store');
    });

    Route::prefix('employee/overtime')->name('employee.overtime.')->group(function () {
        Route::get('/', [OvertimeController::class, 'index'])->name('index');
        Route::post('/', [OvertimeController::class, 'store'])->name('store');
    });

    Route::get('/manager/dashboard', function () {
        return view('manager.dashboard');
    })->name('manager.dashboard');

    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

        Route::resource('departments', DepartmentController::class)->only([
            'index', 'store', 'update', 'destroy'
        ]);

        Route::resource('employees', EmployeeController::class)->only([
            'index', 'store', 'show', 'update', 'destroy'
        ]);

        Route::resource('users', UserController::class)->only([
            'index', 'store', 'show', 'update', 'destroy'
        ]);
    });

});
