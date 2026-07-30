<?php

namespace App\Models;

use App\Enums\BookingStatus;
use App\Enums\PaymentStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Booking extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'booking_number', 'user_id', 'tour_id', 'tour_date_id', 'agency_id',
        'customer_name', 'customer_email', 'customer_phone', 'customer_city',
        'adults', 'children', 'special_request', 'total_amount',
        'payment_status', 'status', 'agency_notes', 'cancelled_reason',
        'cancelled_at', 'confirmed_at', 'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'status' => BookingStatus::class,
            'payment_status' => PaymentStatus::class,
            'total_amount' => 'decimal:2',
            'cancelled_at' => 'datetime',
            'confirmed_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Booking $booking) {
            $booking->booking_number ??= static::generateBookingNumber();
        });
    }

    public static function generateBookingNumber(): string
    {
        do {
            $candidate = 'VYG-'.random_int(100000, 999999);
        } while (static::where('booking_number', $candidate)->exists());

        return $candidate;
    }

    // -- Relationships ------------------------------------------------------

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function tour(): BelongsTo
    {
        return $this->belongsTo(Tour::class);
    }

    public function tourDate(): BelongsTo
    {
        return $this->belongsTo(TourDate::class);
    }

    public function agency(): BelongsTo
    {
        return $this->belongsTo(Agency::class);
    }

    public function travellers(): HasMany
    {
        return $this->hasMany(BookingTraveller::class);
    }

    public function review(): HasOne
    {
        return $this->hasOne(Review::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    // -- Business rules -----------------------------------------------------

    public function isReviewEligible(): bool
    {
        return $this->status === BookingStatus::Completed && ! $this->review()->exists();
    }

    public function totalTravellers(): int
    {
        return $this->adults + $this->children;
    }
}
