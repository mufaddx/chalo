<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Laravel Sanctum's own migration, published via `php artisan vendor:publish
// --tag=sanctum-migrations` — required for token auth (login/register) to
// work at all. Discovered missing only in production: every auth endpoint
// 500'd with "Base table or view not found: personal_access_tokens" because
// this repo never had it, same gap as the missing artisan/public/ files.
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('personal_access_tokens', function (Blueprint $table) {
            $table->id();
            $table->morphs('tokenable');
            $table->text('name');
            $table->string('token', 64)->unique();
            $table->text('abilities')->nullable();
            $table->timestamp('last_used_at')->nullable();
            $table->timestamp('expires_at')->nullable()->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('personal_access_tokens');
    }
};
