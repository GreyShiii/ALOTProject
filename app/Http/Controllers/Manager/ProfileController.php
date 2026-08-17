<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;


class ProfileController extends Controller
{
    public function index()
    {
        /** @var \App\Models\User $user */
        $update = Auth::user();
        $user = Auth::user();

        $employee = Employee::with([
            'department',
            'manager',
        ])
            ->where('user_id', $user->id)
            ->first();

        return view('manager.profile.index', compact(
            'user',
            'employee'
        ));
    }

    public function update(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'first_name' => [
                'required',
                'string',
                'max:255',
            ],

            'last_name' => [
                'required',
                'string',
                'max:255',
            ],

            'email' => [
                'required',
                'email',
                'max:255',
                'unique:users,email,' . $user->id,
            ],
        ]);

        $user->update([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
        ]);

        return to_route('manager.profile')
            ->with('success', 'Profile updated successfully!');
    }

    public function updatePassword(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'current_password' => [
                'required',
            ],

            'new_password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
            ],
        ]);

        if (!Hash::check(
            $validated['current_password'],
            $user->password
        )) {
            return back()
                ->withErrors([
                    'current_password' => 'The current password is incorrect.',
                ])
                ->withInput();
        }

        $user->update([
            'password' => Hash::make(
                $validated['new_password']
            ),
        ]);

        return to_route('manager.profile')
            ->with('password_success', 'Password updated successfully!');
    }
}
