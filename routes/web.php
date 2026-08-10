<?php
use App\Http\Controllers\Admin\DepartmentController;
use App\Http\Controllers\Admin\EmployeeController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Auth\LoginController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('login');
});

// Guest routes
Route::middleware('guest')->group(function () {
    Route::get('/login', [LoginController::class, 'create'])
        ->name('login');
    Route::post('/login', [LoginController::class, 'store'])
        ->name('login.attempt');

});

// Authenticated routes
Route::middleware('auth')->group(function () {
    Route::post('/logout', [LoginController::class, 'destroy'])
        ->name('logout');
    // Employee dashboard
    Route::get('/employee/dashboard', function () {
        return view('employee.dashboard');
    })->name('employee.dashboard');
    // Manager dashboard
    Route::get('/manager/dashboard', function () {
        return view('manager.dashboard');
    })->name('manager.dashboard');

    // Admin routes
    Route::prefix('admin')->name('admin.')->group(function () {
        // Admin dashboard
        Route::get('/dashboard', [DashboardController::class, 'index'])
            ->name('dashboard');
        // Departments
        Route::resource('departments', DepartmentController::class)
            ->only(['index', 'store', 'update', 'destroy']);
        // Employees
        Route::resource('employees', EmployeeController::class)
            ->only(['index', 'store', 'show', 'update', 'destroy']);
        // Users
        Route::resource('users', UserController::class)
            ->only(['index', 'store', 'show', 'update', 'destroy']);
    });
});
