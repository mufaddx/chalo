<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TourDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return array_merge((new TourResource($this->resource))->toArray($request), [
            'description' => $this->description,
            'highlights' => $this->highlights,
            'inclusions' => $this->inclusions,
            'exclusions' => $this->exclusions,
            'things_to_carry' => $this->things_to_carry,
            'cancellation_policy' => $this->cancellation_policy,
            'gallery' => $this->images->map(fn ($img) => ['path' => $img->path, 'type' => $img->type]),
            'itinerary' => $this->itineraryDays->map(fn ($day) => [
                'day' => $day->day_number,
                'title' => $day->title,
                'description' => $day->description,
                'meals' => $day->meals,
                'stay' => $day->stay_name,
            ]),
            'tour_dates' => $this->tourDates->map(fn ($d) => [
                'id' => $d->id,
                'departure_date' => $d->departure_date->format('Y-m-d'),
                'seats_available' => $d->seats_available,
                'status' => $d->status,
            ]),
            'reviews' => ReviewResource::collection($this->reviews),
        ]);
    }
}
