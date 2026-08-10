<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AdminUserController extends Controller
{
    public function index()
    {
        $users = User::with('employee.department')
            ->latest()
            ->paginate(10);

        return view('admin.users.index', compact('users'));
    }
}
