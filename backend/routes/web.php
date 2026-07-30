<?php

use Illuminate\Support\Facades\Route;

// This is an API-only backend (see routes/api.php) — the web routes file
// only needs to exist because bootstrap/app.php's withRouting() requires
// it, and a plain JSON marker here is more honest than Laravel's default
// view('welcome'), since no resources/views/welcome.blade.php exists.
Route::get('/', function () {
    return response()->json(['message' => 'Voyagr API']);
});
