<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index()
    {
        $users = User::latest()->get();

        return view(
            'admin.users.index',
            compact('users')
        );
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
            'password' => ['nullable', 'string', 'min:8'],
            'role' => [
                'required',
                Rule::in([
                    'employee',
                    'manager',
                    'admin',
                ]),
            ],
            'status' => [
                'required',
                Rule::in([
                    'active',
                    'inactive',
                ]),
            ],
        ]);

        $wasManager = $user->role === 'manager';
        $willBeManager = $validated['role'] === 'manager';

        DB::transaction(function () use (
            $validated,
            $user,
            $wasManager,
            $willBeManager
        ) {
            if (empty($validated['password'])) {
                unset($validated['password']);
            }

            $user->update($validated);

            if ($wasManager && !$willBeManager) {
                $employee = $user->employee;

                if ($employee) {
                    Employee::where(
                        'manager_id',
                        $employee->id
                    )->update([
                        'manager_id' => null,
                    ]);
                }
            }
        });

        $user->load('employee.department');

        return response()->json([
            'message' => 'User updated successfully.',
            'user' => $user,
        ]);
    }

    public function deactivate(User $user)
    {
        if (Auth::id() === $user->id) {
            return response()->json([
                'message' => 'You cannot deactivate your own account.',
            ], 422);
        }

        $user->update([
            'status' => 'inactive',
        ]);

        return response()->json([
            'message' => 'User deactivated successfully.',
            'user' => $user,
        ]);
    }

    public function activate(User $user)
    {
        if (Auth::id() === $user->id) {
            return response()->json([
                'message' => 'You cannot change your own account status.',
            ], 422);
        }

        $user->update([
            'status' => 'active',
        ]);

        return response()->json([
            'message' => 'User activated successfully.',
            'user' => $user,
        ]);
    }
}
