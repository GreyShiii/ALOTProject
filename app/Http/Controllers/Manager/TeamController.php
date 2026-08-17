<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class TeamController extends Controller
{
    /**
     * Display the manager's team.
     */
    public function index()
    {
        $manager = Auth::user()->employee;

        $employees = $manager->subordinates()
            ->with([
                'user',
                'department',
            ])
            ->get();

        return view('manager.team.index', compact('employees'));
    }
}
