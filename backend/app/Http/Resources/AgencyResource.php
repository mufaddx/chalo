<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AgencyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'name' => $this->name,
            'logo_path' => $this->logo_path,
            'cover_path' => $this->cover_path,
            'about' => $this->about,
            'city' => $this->city,
            'phone' => $this->phone,
            'email' => $this->email,
            'website' => $this->website,
            'verified' => $this->isVerified(),
            'status' => $this->status,
            'rejection_reason' => $this->rejection_reason,
            'years_experience' => $this->years_experience,
            'rating_avg' => (float) $this->rating_avg,
            'review_count' => $this->review_count,
            'tour_count' => $this->whenCounted('tours'),
            'owner_email' => $this->whenLoaded('owner', fn () => $this->owner->email),
            'created_at' => $this->created_at?->toIso8601String(),
            'verifications' => $this->whenLoaded('verifications', fn () => $this->verifications->map(fn ($v) => [
                'document_type' => $v->document_type,
                'document_path' => $v->document_path,
                'status' => $v->status,
            ])),
        ];
    }
}
