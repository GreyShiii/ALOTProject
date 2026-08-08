<aside
    id="sidebar"
    class="fixed lg:static inset-y-0 left-0 z-40 w-72 bg-slate-900 text-white flex flex-col flex-shrink-0
           transform -translate-x-full lg:translate-x-0 transition-transform duration-200 ease-in-out"
>

    {{-- Logo / Brand --}}
    <div class="px-6 py-6 border-b border-slate-700 flex items-center justify-between">
        <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center font-bold text-sm flex-shrink-0">
                ALO
            </div>
            <div>
                <p class="font-semibold text-sm leading-tight">Attendance, Leave &amp;<br>Overtime</p>
                <p class="text-xs text-slate-400">Management System</p>
            </div>
        </div>

        <button id="sidebar-close" class="lg:hidden text-slate-400 hover:text-white">
            ✕
        </button>
    </div>

    {{-- Menu --}}
    <nav class="flex-1 px-4 py-6 overflow-y-auto">

        @auth
            @if (auth()->user()->isEmployee())

                <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 mb-3">Employee Menu</p>
                <ul class="space-y-1">
                    <li>
                        <a href="{{ route('employee.dashboard') }}" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition {{ request()->routeIs('employee.dashboard') ? 'bg-slate-800 text-white font-medium' : 'text-slate-300 hover:bg-slate-800 hover:text-white' }}">
                            <span>📊</span> Dashboard
                        </a>
                    </li>
                    <li>
                        <a href="#" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white text-sm transition">
                            <span>🕒</span> Attendance
                        </a>
                    </li>
                    <li>
                        <a href="#" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white text-sm transition">
                            <span>📅</span> My Leave
                        </a>
                    </li>
                    <li>
                        <a href="#" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white text-sm transition">
                            <span>⏱️</span> My Overtime
                        </a>
                    </li>
                    <li>
                        <a href="#" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white text-sm transition">
                            <span>👤</span> Profile
                        </a>
                    </li>
                </ul>

            @elseif (auth()->user()->isManager())

                <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 mb-3">Manager Menu</p>
                <ul class="space-y-1">
                    <li>
                        <a href="{{ route('manager.dashboard') }}" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition {{ request()->routeIs('manager.dashboard') ? 'bg-slate-800 text-white font-medium' : 'text-slate-300 hover:bg-slate-800 hover:text-white' }}">
                            <span>📊</span> Dashboard
                        </a>
                    </li>
                    <li>
                        <a href="#" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white text-sm transition">
                            <span>🕒</span> Attendance
                        </a>
                    </li>
                    <li>
                        <a href="#" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white text-sm transition">
                            <span>📅</span> Leave Requests
                        </a>
                    </li>
                    <li>
                        <a href="#" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white text-sm transition">
                            <span>⏱️</span> Overtime Requests
                        </a>
                    </li>
                    <li>
                        <a href="#" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white text-sm transition">
                            <span>👥</span> My Team
                        </a>
                    </li>
                    <li>
                        <a href="#" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white text-sm transition">
                            <span>👤</span> Profile
                        </a>
                    </li>
                </ul>

            @elseif (auth()->user()->isAdmin())

                <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 mb-3">Admin Menu</p>
                <ul class="space-y-1">
                    <li>
                        <a href="{{ route('admin.dashboard') }}" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition {{ request()->routeIs('admin.dashboard') ? 'bg-slate-800 text-white font-medium' : 'text-slate-300 hover:bg-slate-800 hover:text-white' }}">
                            <span>📊</span> Dashboard
                        </a>
                    </li>
                    <li>
                        <a href="#" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white text-sm transition">
                            <span>👥</span> Employees
                        </a>
                    </li>
                    <li>
                        <a href="#" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white text-sm transition">
                            <span>🛡️</span> Users
                        </a>
                    </li>
                    <li>
                        <a href="#" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white text-sm transition">
                            <span>🏢</span> Departments
                        </a>
                    </li>
                    <li>
                        <a href="#" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white text-sm transition">
                            <span>🕒</span> Attendance
                        </a>
                    </li>
                    <li>
                        <a href="#" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white text-sm transition">
                            <span>📅</span> Leave Requests
                        </a>
                    </li>
                    <li>
                        <a href="#" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white text-sm transition">
                            <span>⏱️</span> Overtime Requests
                        </a>
                    </li>
                    <li>
                        <a href="#" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white text-sm transition">
                            <span>👤</span> Profile
                        </a>
                    </li>
                </ul>

            @endif
        @endauth

    </nav>

    {{-- Sign out --}}
    <div class="px-4 py-4 border-t border-slate-700">
        <form method="POST" action="{{ route('logout') }}">
            @csrf
            <button type="submit" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white text-sm transition">
                <span>🚪</span> Sign out
            </button>
        </form>
    </div>

</aside>
