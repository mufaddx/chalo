<?php

namespace App\Models;

use App\Enums\AgencyStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Agency extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id', 'name', 'slug', 'logo_path', 'cover_path', 'about',
        'phone', 'email', 'website', 'office_address', 'city', 'state',
        'country', 'latitude', 'longitude', 'years_experience',
        'social_links', 'status', 'rejection_reason', 'verified_at',
    ];

    protected function casts(): array
    {
        return [
            'status' => AgencyStatus::class,
            'social_links' => 'array',
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
            'rating_avg' => 'decimal:1',
            'verified_at' => 'datetime',
        ];
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function verifications(): HasMany
    {
        return $this->hasMany(AgencyVerification::class);
    }

    public function tours(): HasMany
    {
        return $this->hasMany(Tour::class);
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function coupons(): HasMany
    {
        return $this->hasMany(Coupon::class, 'applicable_agency_id');
    }

    public function scopeVerified($query)
    {
        return $query->where('status', AgencyStatus::Verified);
    }

    public function isVerified(): bool
    {
        return $this->status === AgencyStatus::Verified;
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
