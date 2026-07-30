<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'booking_number' => $this->booking_number,
            'status' => $this->status,
            'payment_status' => $this->payment_status,
            'tour' => $this->whenLoaded('tour', fn () => [
                'title' => $this->tour->title,
                'slug' => $this->tour->slug,
            ]),
            'agency' => $this->whenLoaded('agency', fn () => ['name' => $this->agency->name, 'slug' => $this->agency->slug]),
            'travel_date' => $this->whenLoaded('tourDate', fn () => $this->tourDate->departure_date->format('Y-m-d')),
            'customer_name' => $this->customer_name,
            'customer_email' => $this->customer_email,
            'customer_phone' => $this->customer_phone,
            'customer_city' => $this->customer_city,
            'special_request' => $this->special_request,
            'agency_notes' => $this->agency_notes,
            'cancelled_reason' => $this->cancelled_reason,
            'adults' => $this->adults,
            'children' => $this->children,
            'total_amount' => (float) $this->total_amount,
            'created_at' => $this->created_at->toIso8601String(),
        ];
    }
}
