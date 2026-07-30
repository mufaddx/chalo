<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterAgencyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'owner_name' => ['required', 'string', 'max:150'],
            'owner_email' => ['required', 'email', 'max:191', 'unique:users,email'],
            'owner_password' => ['required', 'string', 'min:8'],
            'agency_name' => ['required', 'string', 'max:180'],
            'phone' => ['required', 'string', 'max:20'],
            'office_address' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:120'],
            'years_experience' => ['nullable', 'integer', 'min:0', 'max:100'],
            'document_type' => ['required', 'in:gst_certificate,pan_card,trade_license,other'],
            'document_path' => ['required', 'string'], // path to a previously uploaded file
        ];
    }
}
