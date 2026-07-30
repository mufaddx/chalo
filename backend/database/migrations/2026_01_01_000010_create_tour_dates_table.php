<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tour_dates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tour_id')->constrained('tours')->cascadeOnDelete();
            $table->date('departure_date')->index();
            $table->date('return_date')->nullable();
            $table->unsignedSmallInteger('seats_total');
            $table->unsignedSmallInteger('seats_available');
            $table->decimal('price_override', 10, 2)->nullable();
            $table->enum('status', ['open', 'closed', 'full'])->default('open');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tour_dates');
    }
};
