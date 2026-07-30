<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTourRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Only verified agency owners can create tours; enforced again in the
        // controller via TourPolicy, this is the first line of defence.
        return $this->user()?->isAgencyOwner() && $this->user()->agency?->isVerified();
    }

    public function rules(): array
    {
        return [
            'destination_id' => ['required', 'integer', 'exists:destinations,id'],
            'title' => ['required', 'string', 'max:200'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'original_price' => ['required', 'numeric', 'gte:price'],
            'duration_nights' => ['required', 'integer', 'min:0', 'max:60'],
            'duration_days' => ['required', 'integer', 'min:1', 'max:61'],
            'hotel_rating' => ['required', 'integer', 'min:1', 'max:5'],
            'transport' => ['required', 'array', 'min:1'],
            'transport.*' => [Rule::in(['Flight', 'Train', 'Bus', 'Cab'])],
            'meals_included' => ['boolean'],
            'free_cancellation' => ['boolean'],
            'instant_confirmation' => ['boolean'],
            'highlights' => ['nullable', 'array'],
            'inclusions' => ['nullable', 'array'],
            'exclusions' => ['nullable', 'array'],
            'things_to_carry' => ['nullable', 'array'],
            'cancellation_policy' => ['nullable', 'string'],
            'category_ids' => ['required', 'array', 'min:1'],
            'category_ids.*' => ['integer', 'exists:categories,id'],
            'itinerary' => ['nullable', 'array'],
            'itinerary.*.day_number' => ['required_with:itinerary', 'integer', 'min:1'],
            'itinerary.*.title' => ['required_with:itinerary', 'string', 'max:180'],
            'itinerary.*.description' => ['nullable', 'string'],
        ];
    }
}
