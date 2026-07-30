<?php

use App\Http\Middleware\EnsureUserHasRole;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // 'auth:sanctum' ships with the framework/Sanctum package.
        // 'role' is ours — see app/Http/Middleware/EnsureUserHasRole.php.
        $middleware->alias([
            'role' => EnsureUserHasRole::class,
        ]);

        $middleware->statefulApi(); // allows the same guard to serve SPA + token clients
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
