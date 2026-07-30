<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            // one review per booking — enforces "only completed tours can be reviewed" upstream
            $table->foreignId('booking_id')->constrained('bookings')->cascadeOnDelete()->unique();
            $table->foreignId('tour_id')->constrained('tours')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('agency_id')->constrained('agencies')->cascadeOnDelete();
            $table->unsignedTinyInteger('rating');
            $table->text('review_text')->nullable();
            $table->json('images')->nullable();
            $table->enum('status', ['published', 'hidden'])->default('published');
            $table->text('agency_reply')->nullable();
            $table->timestamp('agency_replied_at')->nullable();
            $table->timestamps();
        });

        // MySQL CHECK constraint — Laravel's schema builder doesn't have a
        // first-class helper for this, so it's added directly.
        DB::statement('ALTER TABLE reviews ADD CONSTRAINT reviews_rating_range CHECK (rating BETWEEN 1 AND 5)');
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
