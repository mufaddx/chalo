<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('itinerary_days', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tour_id')->constrained('tours')->cascadeOnDelete();
            $table->unsignedSmallInteger('day_number');
            $table->string('title', 180);
            $table->text('description')->nullable();
            $table->json('meals')->nullable(); // ["Breakfast","Dinner"]
            $table->string('stay_name', 180)->nullable();
            $table->timestamps();

            $table->unique(['tour_id', 'day_number']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('itinerary_days');
    }
};
