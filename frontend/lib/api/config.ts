// Points at the Laravel backend shipped separately (voyagr-travel-marketplace-backend.zip).
// Override with NEXT_PUBLIC_API_URL in .env.local once that backend is running
// (composer install && php artisan serve) — see that project's README.
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export const AUTH_TOKEN_STORAGE_KEY = "voyagr_auth_token";
