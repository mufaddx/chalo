<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TourResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->title,
            'destination' => $this->whenLoaded('destination', fn () => [
                'name' => $this->destination->name,
                'country' => $this->destination->country,
                'slug' => $this->destination->slug,
            ]),
            'agency' => $this->whenLoaded('agency', fn () => [
                'name' => $this->agency->name,
                'slug' => $this->agency->slug,
                'logo_path' => $this->agency->logo_path,
                'verified' => $this->agency->isVerified(),
            ]),
            'price' => (float) $this->price,
            'original_price' => (float) $this->original_price,
            'discount_percent' => $this->discountPercent(),
            'duration' => "{$this->duration_nights}N / {$this->duration_days}D",
            'hotel_rating' => $this->hotel_rating,
            'transport' => $this->transport,
            'meals_included' => $this->meals_included,
            'free_cancellation' => $this->free_cancellation,
            'instant_confirmation' => $this->instant_confirmation,
            'rating_avg' => (float) $this->rating_avg,
            'review_count' => $this->review_count,
            'featured' => $this->featured,
            'trending' => $this->trending,
            'categories' => $this->whenLoaded('categories', fn () => $this->categories->pluck('name')),
            'cover_image' => $this->whenLoaded('images', fn () => optional($this->images->first())->path),
            'next_departures' => $this->whenLoaded('tourDates', fn () => $this->tourDates
                ->where('status', 'open')
                ->take(5)
                ->pluck('departure_date')
            ),
        ];
    }
}
