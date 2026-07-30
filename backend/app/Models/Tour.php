<?php

namespace App\Models;

use App\Enums\TourStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;

class Tour extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'agency_id', 'destination_id', 'title', 'slug', 'description',
        'price', 'original_price', 'currency', 'duration_nights', 'duration_days',
        'hotel_rating', 'transport', 'meals_included', 'free_cancellation',
        'instant_confirmation', 'highlights', 'inclusions', 'exclusions',
        'things_to_carry', 'cancellation_policy', 'status', 'rejection_reason',
        'approved_by', 'approved_at', 'featured', 'trending',
    ];

    protected function casts(): array
    {
        return [
            'status' => TourStatus::class,
            'price' => 'decimal:2',
            'original_price' => 'decimal:2',
            'transport' => 'array',
            'highlights' => 'array',
            'inclusions' => 'array',
            'exclusions' => 'array',
            'things_to_carry' => 'array',
            'meals_included' => 'boolean',
            'free_cancellation' => 'boolean',
            'instant_confirmation' => 'boolean',
            'featured' => 'boolean',
            'trending' => 'boolean',
            'rating_avg' => 'decimal:1',
            'approved_at' => 'datetime',
        ];
    }

    // -- Relationships ------------------------------------------------------

    public function agency(): BelongsTo
    {
        return $this->belongsTo(Agency::class);
    }

    public function destination(): BelongsTo
    {
        return $this->belongsTo(Destination::class);
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'tour_categories');
    }

    public function images(): HasMany
    {
        return $this->hasMany(TourImage::class)->orderBy('sort_order');
    }

    public function itineraryDays(): HasMany
    {
        return $this->hasMany(ItineraryDay::class)->orderBy('day_number');
    }

    public function tourDates(): HasMany
    {
        return $this->hasMany(TourDate::class)->orderBy('departure_date');
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class)->where('status', 'published');
    }

    public function wishlistedBy(): HasMany
    {
        return $this->hasMany(Wishlist::class);
    }

    // -- Scopes ---------------------------------------------------------------

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', TourStatus::Published);
    }

    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('featured', true);
    }

    public function scopeTrending(Builder $query): Builder
    {
        return $query->where('trending', true);
    }

    public function scopeInCategory(Builder $query, string $categorySlug): Builder
    {
        return $query->whereHas('categories', fn ($q) => $q->where('slug', $categorySlug));
    }

    public function scopeSearch(Builder $query, ?string $term): Builder
    {
        if (! $term) {
            return $query;
        }

        return $query->where(function (Builder $q) use ($term) {
            $q->where('title', 'like', "%{$term}%")
                ->orWhereHas('destination', fn ($d) => $d->where('name', 'like', "%{$term}%"))
                ->orWhereHas('agency', fn ($a) => $a->where('name', 'like', "%{$term}%"));
        });
    }

    // -- Accessors --------------------------------------------------------

    public function discountPercent(): int
    {
        if ($this->original_price <= $this->price) {
            return 0;
        }

        return (int) round((($this->original_price - $this->price) / $this->original_price) * 100);
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
