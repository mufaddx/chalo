<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // guest checkout is allowed; ownership isn't relevant on create
    }

    public function rules(): array
    {
        return [
            'tour_date_id' => ['required', 'integer', 'exists:tour_dates,id'],
            'customer_name' => ['required', 'string', 'max:150'],
            'customer_email' => ['required', 'email', 'max:191'],
            'customer_phone' => ['required', 'string', 'max:20'],
            'customer_city' => ['nullable', 'string', 'max:120'],
            'adults' => ['required', 'integer', 'min:1', 'max:20'],
            'children' => ['nullable', 'integer', 'min:0', 'max:20'],
            'special_request' => ['nullable', 'string', 'max:500'],
            'travellers' => ['nullable', 'array'],
            'travellers.*.full_name' => ['required_with:travellers', 'string', 'max:150'],
            'travellers.*.age' => ['nullable', 'integer', 'min:0', 'max:120'],
            'travellers.*.gender' => ['nullable', 'in:male,female,other'],
            'travellers.*.passport_number' => ['nullable', 'string', 'max:40'],
        ];
    }
}
