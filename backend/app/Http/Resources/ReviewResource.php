<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'author' => $this->whenLoaded('user', fn () => $this->user->name),
            'rating' => $this->rating,
            'review_text' => $this->review_text,
            'images' => $this->images,
            'agency_reply' => $this->agency_reply,
            'created_at' => $this->created_at->toIso8601String(),
        ];
    }
}
