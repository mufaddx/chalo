<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

class Coupon extends Model
{
    use HasFactory;

    protected $fillable = [
        'code', 'type', 'value', 'min_booking_amount', 'max_discount',
        'usage_limit', 'used_count', 'valid_from', 'valid_until',
        'is_active', 'applicable_agency_id',
    ];

    protected function casts(): array
    {
        return [
            'value' => 'decimal:2',
            'min_booking_amount' => 'decimal:2',
            'max_discount' => 'decimal:2',
            'valid_from' => 'date',
            'valid_until' => 'date',
            'is_active' => 'boolean',
        ];
    }

    public function agency(): BelongsTo
    {
        return $this->belongsTo(Agency::class, 'applicable_agency_id');
    }

    public function isValidNow(): bool
    {
        if (! $this->is_active) {
            return false;
        }
        if ($this->usage_limit && $this->used_count >= $this->usage_limit) {
            return false;
        }
        $today = Carbon::today();
        if ($this->valid_from && $today->lt($this->valid_from)) {
            return false;
        }
        if ($this->valid_until && $today->gt($this->valid_until)) {
            return false;
        }

        return true;
    }

    public function discountFor(float $amount): float
    {
        $discount = $this->type === 'percent' ? $amount * ($this->value / 100) : $this->value;

        return $this->max_discount ? min($discount, (float) $this->max_discount) : $discount;
    }
}
