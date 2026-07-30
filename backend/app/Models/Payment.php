<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_id', 'gateway', 'gateway_order_id', 'gateway_payment_id',
        'gateway_signature', 'checkout_url', 'expires_at', 'amount', 'currency',
        'status', 'failure_reason',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
    ];

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    /** Amount is stored in paise (smallest currency unit). */
    public function amountInRupees(): float
    {
        return $this->amount / 100;
    }
}
