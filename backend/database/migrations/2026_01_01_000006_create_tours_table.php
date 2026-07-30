<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tours', function (Blueprint $table) {
            $table->id();
            $table->foreignId('agency_id')->constrained('agencies')->cascadeOnDelete();
            $table->foreignId('destination_id')->constrained('destinations')->restrictOnDelete();
            $table->string('title', 200);
            $table->string('slug', 220)->unique();
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->decimal('original_price', 10, 2);
            $table->char('currency', 3)->default('INR');
            $table->unsignedTinyInteger('duration_nights');
            $table->unsignedTinyInteger('duration_days');
            $table->unsignedTinyInteger('hotel_rating')->default(3);
            $table->json('transport'); // ["Flight","Cab"]
            $table->boolean('meals_included')->default(false);
            $table->boolean('free_cancellation')->default(false);
            $table->boolean('instant_confirmation')->default(false);
            $table->json('highlights')->nullable();
            $table->json('inclusions')->nullable();
            $table->json('exclusions')->nullable();
            $table->json('things_to_carry')->nullable();
            $table->text('cancellation_policy')->nullable();
            $table->enum('status', ['draft', 'pending_approval', 'published', 'rejected', 'closed'])
                ->default('draft')->index();
            $table->string('rejection_reason')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable();
            $table->boolean('featured')->default(false);
            $table->boolean('trending')->default(false);
            $table->unsignedInteger('views_count')->default(0);
            $table->decimal('rating_avg', 2, 1)->default(0);
            $table->unsignedInteger('review_count')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tours');
    }
};
