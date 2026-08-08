@extends('layouts.guest')

@section('title', 'Login')

@section('content')
<div class="bg-white rounded-xl border border-gray-200 shadow-sm p-8">

    {{-- Logo / Brand --}}
    <div class="flex items-center gap-3 mb-8">
        <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center font-bold text-sm text-white">
            ALO
        </div>
        <div>
            <p class="font-semibold text-sm leading-tight text-gray-900">Attendance, Leave &amp; Overtime</p>
            <p class="text-xs text-gray-500">Management System</p>
        </div>
    </div>

    <h1 class="text-xl font-bold text-gray-900 mb-1">Sign in</h1>
    <p class="text-sm text-gray-500 mb-6">Enter your credentials to access your account.</p>

    {{-- Error messages --}}
    @if ($errors->any())
        <div class="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            @foreach ($errors->all() as $error)
                <p>{{ $error }}</p>
            @endforeach
        </div>
    @endif

    <form method="POST" action="{{ route('login.attempt') }}">
        @csrf

        <div class="mb-4">
            <label for="email" class="block text-xs font-medium text-gray-700 uppercase tracking-wide mb-1">
                Email
            </label>
            <input
                type="email"
                id="email"
                name="email"
                value="{{ old('email') }}"
                required
                autofocus
                class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="name@company.com"
            >
        </div>

        <div class="mb-6">
            <label for="password" class="block text-xs font-medium text-gray-700 uppercase tracking-wide mb-1">
                Password
            </label>
            <input
                type="password"
                id="password"
                name="password"
                required
                class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
            >
        </div>

        <button
            type="submit"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm py-2.5 rounded-lg transition"
        >
            Sign in
        </button>
    </form>

</div>
@endsection
