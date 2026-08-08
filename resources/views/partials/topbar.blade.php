<header class="bg-white border-b border-gray-200 px-4 sm:px-8 py-4 flex items-center justify-between flex-shrink-0">

    <div class="flex items-center gap-4">
        {{-- Hamburger, mobile only --}}
        <button id="sidebar-open" class="lg:hidden text-gray-600 hover:text-gray-900">
            ☰
        </button>

        {{-- Breadcrumb --}}
        <div class="flex items-center gap-2 text-sm">
            <span class="text-gray-400 hidden sm:inline">@yield('breadcrumb-parent', 'Employee')</span>
            <span class="text-gray-300 hidden sm:inline">&gt;</span>
            <span class="text-gray-900 font-medium">@yield('breadcrumb-current', 'Dashboard')</span>
        </div>
    </div>

    {{-- Right side --}}
    <div class="flex items-center gap-3 sm:gap-5">
        <button class="relative text-gray-500 hover:text-gray-700">
            🔔
            <span class="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full"></span>
        </button>

        <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
                BO
            </div>
            <div class="text-sm hidden sm:block">
                <p class="font-medium text-gray-900 leading-tight">Grey Shii</p>
                <p class="text-gray-500 text-xs">Senior Software Engineer</p>
            </div>
        </div>
    </div>

</header>
