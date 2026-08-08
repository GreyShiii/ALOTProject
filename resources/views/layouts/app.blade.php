<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>@yield('title', 'Dashboard') - Attendance, Leave & Overtime Management System</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="bg-gray-50">
    <div class="flex h-screen overflow-hidden">
        {{-- Sidebar --}}
        @include('partials.sidebar')

        {{--  --}}
        <div class="flex-1 flex flex-col overflow-hidden">
            {{-- Topbar --}}
            @include('partials.topbar')
            <main class="flex-1 overflow-y-auto p-8">
                @yield('content')
            </main>

        </div>
    </div>
</body>
</html>
