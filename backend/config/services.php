<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as SabPaisa, Mailgun, Postmark, AWS and more.
    |
    */

    'sabpaisa' => [
        'api_key' => env('SABPAISA_API_KEY'),
        'secret_key' => env('SABPAISA_SECRET_KEY'),
        'merchant_id' => env('SABPAISA_MERCHANT_ID'),
        'base_url' => env('SABPAISA_BASE_URL', 'https://merchant-api.sabpaisa.in'),
    ],

    'frontend' => [
        'url' => env('FRONTEND_URL', 'http://localhost:3000'),
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],
];
