<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->string('booking_number', 20)->unique(); // e.g. VYG-482913
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete(); // nullable: guest checkout
            $table->foreignId('tour_id')->constrained('tours')->restrictOnDelete();
            $table->foreignId('tour_date_id')->constrained('tour_dates')->restrictOnDelete();
            $table->foreignId('agency_id')->constrained('agencies')->restrictOnDelete(); // denormalised for fast agency queries
            $table->string('customer_name', 150);
            $table->string('customer_email', 191);
            $table->string('customer_phone', 20);
            $table->string('customer_city', 120)->nullable();
            $table->unsignedTinyInteger('adults')->default(1);
            $table->unsignedTinyInteger('children')->default(0);
            $table->string('special_request', 500)->nullable();
            $table->decimal('total_amount', 10, 2);
            $table->enum('payment_status', ['unpaid', 'partial', 'paid', 'refunded'])->default('unpaid');
            $table->enum('status', ['pending', 'confirmed', 'cancelled', 'completed'])->default('pending')->index();
            $table->string('agency_notes', 500)->nullable();
            $table->string('cancelled_reason')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->timestamp('confirmed_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
