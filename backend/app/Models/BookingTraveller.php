<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BookingTraveller extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_id', 'full_name', 'age', 'gender', 'passport_number', 'is_lead_traveller',
    ];

    protected function casts(): array
    {
        return ['is_lead_traveller' => 'boolean'];
    }

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }
}
