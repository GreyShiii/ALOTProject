<aside
    id="sidebar"
    class="fixed lg:static inset-y-0 left-0 z-40 w-72 bg-[#0f2138] text-white flex flex-col flex-shrink-0
           transform -translate-x-full lg:translate-x-0 transition-transform duration-200 ease-in-out"
>

{{-- Logo / Brand --}}
<div class="px-6 py-6 flex items-center justify-between">
    <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
            ALO
        </div>

        <div>
            <p class="font-semibold text-sm leading-tight">
                Attendance, Leave &amp; ...
            </p>

            <p class="text-xs text-slate-400">
                Management System
            </p>
        </div>
    </div>

    <button
        id="sidebar-close"
        class="lg:hidden text-slate-400 hover:text-white"
    >
        <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18 18 6M6 6l12 12"
            />
        </svg>
    </button>
</div>


{{-- Menu --}}
<nav class="flex-1 px-4 py-2 overflow-y-auto">

    @auth

        {{-- ========================================================= --}}
        {{-- EMPLOYEE SIDEBAR --}}
        {{-- ========================================================= --}}

        @if (auth()->user()->isEmployee())

            <p class="text-[11px] font-semibold text-slate-500 uppercase tracking-widest px-3 mb-3">
                Employee Menu
            </p>

            <ul class="space-y-1">

                {{-- Dashboard --}}
                <li>
                    <a
                        href="{{ route('employee.dashboard') }}"
                        class="relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition {{ request()->routeIs('employee.dashboard') ? 'bg-slate-800/70 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800/50 hover:text-white' }}"
                    >
                        <svg
                            class="w-5 h-5 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.8"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M4 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5Zm10 0a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V5ZM4 15a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-4Zm10 0a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-4Z"
                            />
                        </svg>

                        Dashboard

                        @if(request()->routeIs('employee.dashboard'))
                            <span class="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-1 rounded-full bg-teal-400"></span>
                        @endif
                    </a>
                </li>


                {{-- Attendance --}}
                <li>
                    <a
                        href="#"
                        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800/50 hover:text-white text-sm transition"
                    >
                        <svg
                            class="w-5 h-5 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.8"
                            viewBox="0 0 24 24"
                        >
                            <circle cx="12" cy="12" r="9"/>
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M12 7v5l3 2"
                            />
                        </svg>

                        Attendance
                    </a>
                </li>


                {{-- My Leave --}}
                <li>
                    <a
                        href="#"
                        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800/50 hover:text-white text-sm transition"
                    >
                        <svg
                            class="w-5 h-5 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.8"
                            viewBox="0 0 24 24"
                        >
                            <rect x="3" y="5" width="18" height="16" rx="2"/>
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M3 9h18M8 3v4M16 3v4"
                            />
                        </svg>

                        My Leave
                    </a>
                </li>


                {{-- My Overtime --}}
                <li>
                    <a
                        href="#"
                        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800/50 hover:text-white text-sm transition"
                    >
                        <svg
                            class="w-5 h-5 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.8"
                            viewBox="0 0 24 24"
                        >
                            <circle cx="12" cy="13" r="7"/>
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M12 10v3M9 2h6"
                            />
                        </svg>

                        My Overtime
                    </a>
                </li>


                {{-- Profile --}}
                <li>
                    <a
                        href="#"
                        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800/50 hover:text-white text-sm transition"
                    >
                        <svg
                            class="w-5 h-5 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.8"
                            viewBox="0 0 24 24"
                        >
                            <circle cx="12" cy="8" r="4"/>
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6"
                            />
                        </svg>

                        Profile
                    </a>
                </li>

            </ul>


        {{-- ========================================================= --}}
        {{-- MANAGER SIDEBAR --}}
        {{-- ========================================================= --}}

        @elseif (auth()->user()->isManager())

            <p class="text-[11px] font-semibold text-slate-500 uppercase tracking-widest px-3 mb-3">
                Manager Menu
            </p>

            <ul class="space-y-1">

                {{-- Dashboard --}}
                <li>
                    <a
                        href="{{ route('manager.dashboard') }}"
                        class="relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition {{ request()->routeIs('manager.dashboard') ? 'bg-slate-800/70 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800/50 hover:text-white' }}"
                    >
                        <svg
                            class="w-5 h-5 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.8"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M4 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5Zm10 0a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V5ZM4 15a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-4Zm10 0a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-4Z"
                            />
                        </svg>

                        Dashboard

                        @if(request()->routeIs('manager.dashboard'))
                            <span class="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-1 rounded-full bg-teal-400"></span>
                        @endif
                    </a>
                </li>


                {{-- Attendance --}}
                <li>
                    <a
                        href="#"
                        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800/50 hover:text-white text-sm transition"
                    >
                        <svg
                            class="w-5 h-5 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.8"
                            viewBox="0 0 24 24"
                        >
                            <circle cx="12" cy="12" r="9"/>
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M12 7v5l3 2"
                            />
                        </svg>

                        Attendance
                    </a>
                </li>


                {{-- Leave Requests --}}
                <li>
                    <a
                        href="#"
                        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800/50 hover:text-white text-sm transition"
                    >
                        <svg
                            class="w-5 h-5 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.8"
                            viewBox="0 0 24 24"
                        >
                            <rect x="3" y="5" width="18" height="16" rx="2"/>
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M3 9h18M8 3v4M16 3v4"
                            />
                        </svg>

                        Leave Requests
                    </a>
                </li>


                {{-- Overtime Requests --}}
                <li>
                    <a
                        href="#"
                        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800/50 hover:text-white text-sm transition"
                    >
                        <svg
                            class="w-5 h-5 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.8"
                            viewBox="0 0 24 24"
                        >
                            <circle cx="12" cy="13" r="7"/>
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M12 10v3M9 2h6"
                            />
                        </svg>

                        Overtime Requests
                    </a>
                </li>


                {{-- My Team --}}
                <li>
                    <a
                        href="#"
                        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800/50 hover:text-white text-sm transition"
                    >
                        <svg
                            class="w-5 h-5 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.8"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M16 20v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 20v-1a4 4 0 0 0-3-3.87M16 3.13A4 4 0 0 1 16 11"
                            />
                        </svg>

                        My Team
                    </a>
                </li>


                {{-- Profile --}}
                <li>
                    <a
                        href="#"
                        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800/50 hover:text-white text-sm transition"
                    >
                        <svg
                            class="w-5 h-5 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.8"
                            viewBox="0 0 24 24"
                        >
                            <circle cx="12" cy="8" r="4"/>
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6"
                            />
                        </svg>

                        Profile
                    </a>
                </li>

            </ul>


        {{-- ========================================================= --}}
        {{-- ADMIN SIDEBAR --}}
        {{-- ========================================================= --}}

        @elseif (auth()->user()->isAdmin())

            <p class="text-[11px] font-semibold text-slate-500 uppercase tracking-widest px-3 mb-3">
                Admin Menu
            </p>

            <ul class="space-y-1">

                {{-- Dashboard --}}
                <li>
                    <a
                        href="{{ route('admin.dashboard') }}"
                        class="relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition {{ request()->routeIs('admin.dashboard') ? 'bg-slate-800/70 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800/50 hover:text-white' }}"
                    >
                        <svg
                            class="w-5 h-5 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.8"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M4 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5Zm10 0a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V5ZM4 15a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-4Zm10 0a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-4Z"
                            />
                        </svg>

                        Dashboard

                        @if(request()->routeIs('admin.dashboard'))
                            <span class="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-1 rounded-full bg-teal-400"></span>
                        @endif
                    </a>
                </li>


                {{-- Employees --}}
                <li>
                    <a
                        href="{{ route('admin.employees.index') }}"
                        class="relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition {{ request()->routeIs('admin.employees.*') ? 'bg-slate-800/70 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800/50 hover:text-white' }}"
                    >
                        <svg
                            class="w-5 h-5 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.8"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M16 20v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 20v-1a4 4 0 0 0-3-3.87M16 3.13A4 4 0 0 1 16 11"
                            />
                        </svg>

                        Employees

                        @if(request()->routeIs('admin.employees.*'))
                            <span class="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-1 rounded-full bg-teal-400"></span>
                        @endif
                    </a>
                </li>


                {{-- Users --}}
                <li>
                    <a
                        href="{{ route('admin.users.index') }}"
                        class="relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition {{ request()->routeIs('admin.users.*') ? 'bg-slate-800/70 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800/50 hover:text-white' }}"
                    >
                        <svg
                            class="w-5 h-5 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.8"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M12 3 5 6v5c0 4.4 3 8.4 7 9.5 4-1.1 7-5.1 7-9.5V6l-7-3Z"
                            />
                        </svg>

                        Users

                        @if(request()->routeIs('admin.users.*'))
                            <span class="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-1 rounded-full bg-teal-400"></span>
                        @endif
                    </a>
                </li>


                {{-- Departments --}}
                <li>
                    <a
                        href="{{ route('admin.departments.index') }}"
                        class="relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition {{ request()->routeIs('admin.departments.*') ? 'bg-slate-800/70 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800/50 hover:text-white' }}"
                    >
                        <svg
                            class="w-5 h-5 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.8"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M4 21V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v15M16 21h4V10a1 1 0 0 0-1-1h-3M8 8h.01M12 8h.01M8 12h.01M12 12h.01M8 16h.01M12 16h.01"
                            />
                        </svg>

                        Departments

                        @if(request()->routeIs('admin.departments.*'))
                            <span class="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-1 rounded-full bg-teal-400"></span>
                        @endif
                    </a>
                </li>


                {{-- Attendance --}}
                <li>
                    <a
                        href="#"
                        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800/50 hover:text-white text-sm transition"
                    >
                        <svg
                            class="w-5 h-5 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.8"
                            viewBox="0 0 24 24"
                        >
                            <circle cx="12" cy="12" r="9"/>
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M12 7v5l3 2"
                            />
                        </svg>

                        Attendance
                    </a>
                </li>


                {{-- Leave Requests --}}
                <li>
                    <a
                        href="#"
                        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800/50 hover:text-white text-sm transition"
                    >
                        <svg
                            class="w-5 h-5 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.8"
                            viewBox="0 0 24 24"
                        >
                            <rect x="3" y="5" width="18" height="16" rx="2"/>
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M3 9h18M8 3v4M16 3v4"
                            />
                        </svg>

                        Leave Requests
                    </a>
                </li>


                {{-- Overtime Requests --}}
                <li>
                    <a
                        href="#"
                        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800/50 hover:text-white text-sm transition"
                    >
                        <svg
                            class="w-5 h-5 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.8"
                            viewBox="0 0 24 24"
                        >
                            <circle cx="12" cy="13" r="7"/>
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M12 10v3M9 2h6"
                            />
                        </svg>

                        Overtime Requests
                    </a>
                </li>


                {{-- Profile --}}
                <li>
                    <a
                        href="#"
                        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800/50 hover:text-white text-sm transition"
                    >
                        <svg
                            class="w-5 h-5 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.8"
                            viewBox="0 0 24 24"
                        >
                            <circle cx="12" cy="8" r="4"/>
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6"
                            />
                        </svg>

                        Profile
                    </a>
                </li>

            </ul>

        @endif

    @endauth

</nav>


{{-- Sign out --}}
<div class="px-4 py-4 border-t border-slate-700/60">

    <form
        method="POST"
        action="{{ route('logout') }}"
    >
        @csrf

        <button
            type="submit"
            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800/50 hover:text-white text-sm transition"
        >
            <svg
                class="w-5 h-5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                viewBox="0 0 24 24"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 12H3m0 0 4-4m-4 4 4 4M11 4h6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6"
                />
            </svg>

            Sign out
        </button>

    </form>

</div>

</aside>
