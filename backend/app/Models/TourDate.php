<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TourDate extends Model
{
    use HasFactory;

    protected $fillable = [
        'tour_id', 'departure_date', 'return_date', 'seats_total',
        'seats_available', 'price_override', 'status',
    ];

    protected function casts(): array
    {
        return [
            'departure_date' => 'date',
            'return_date' => 'date',
            'price_override' => 'decimal:2',
        ];
    }

    public function tour(): BelongsTo
    {
        return $this->belongsTo(Tour::class);
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    public function hasAvailability(int $seatsNeeded = 1): bool
    {
        return $this->status === 'open' && $this->seats_available >= $seatsNeeded;
    }
}
