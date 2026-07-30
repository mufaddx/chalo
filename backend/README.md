# Voyagr — Travel Marketplace API (Laravel 11)

This is the **backend** for the Travel Marketplace project — Phase 2 of the
build, following the public website frontend. It's a REST API covering
authentication, tours, bookings, agencies, reviews, wishlists, and the
admin/agency management surfaces, backed by a MySQL schema for every module
listed in the original brief.

## Changelog

- **Support tickets** — `SupportTicketController` (customer: list/create/view/reply own tickets) and `Admin\SupportTicketManagementController` (list all, update status, assign, reply) — the table and models already existed, only the controllers were missing.
- **`GET /api/tours` now accepts an `?agency=slug` filter** — added specifically to unblock the frontend's agency profile page, which needs "this agency's published tours" as a public, unauthenticated list. Filters via `whereHas('agency', ...)`, same pattern as the existing `?destination=` filter right above it.
- **CMS controllers added** — Categories, Destinations, Coupons, Banners, Blogs, and Pages all now have full admin CRUD (`Admin\*ManagementController`), plus public read endpoints where it makes sense (`GET /blogs`, `GET /blogs/{slug}`, `GET /pages/{slug}`, `GET /banners`). Also added: `Admin\BookingOverviewController` (the missing global cross-agency bookings view) and `Admin\UserManagementController` (list/deactivate customers). Verified with real CRUD against MySQL 8 — including confirming the coupon `code` unique constraint actually rejects a duplicate, the banner active-date-window query returns the right rows, and the settings upsert (`Setting::set()`) correctly updates an existing key rather than erroring — not just that the migrations exist.
- **Payments (SabPaisa)** — replaced the original Razorpay integration with SabPaisa's PG 3.0 REST API: `payments` table (now with `checkout_url`/`expires_at`), `Payment` model, `PaymentService`, and `PaymentController` (`create-order`, `verify`, `webhook`). Unlike Razorpay's widget + client-signed HMAC, SabPaisa is a hosted-redirect flow — the backend creates a payment session and returns a `checkout_url`, and the *only* trustworthy confirmation is a server-side call to SabPaisa's Transaction Enquiry API (return-URL params and webhook payloads are never trusted directly, per SabPaisa's own docs). This environment can't reach SabPaisa's API (`merchant-api.sabpaisa.in`) or run PHP, so none of this has been executed yet — set `SABPAISA_API_KEY` / `SABPAISA_SECRET_KEY` / `SABPAISA_MERCHANT_ID` / `SABPAISA_BASE_URL` and `FRONTEND_URL` in `.env`, run `composer install` (no SDK needed — plain REST via Laravel's `Http` facade) and `php artisan migrate`, then walk a real booking through checkout before trusting this in production.
- **`BookingResource`** now also returns `customer_city`, `special_request`, `agency_notes`, and `cancelled_reason` — added while wiring the agency dashboard's booking detail drawer on the frontend, which needed them and wasn't getting them.
- **`AgencyResource`** now also returns `status` (not just the derived `verified` boolean), `rejection_reason`, `owner_email`, `created_at`, and `verifications` (when eager-loaded) — added while wiring the admin approval queue, which needs to distinguish pending/rejected/suspended, not just verified-or-not. Public endpoints (`GET /api/agencies`, `GET /api/agencies/{slug}`) don't eager-load `owner`/`verifications`, so those two fields stay absent from public responses automatically — only the admin's `AgencyApprovalController` loads them.

## How this was verified

This sandbox can reach `packagist.org` for **no** package installs (only
npm/pip/crates/apt mirrors are allowlisted), so I could not run
`composer install` or `php artisan migrate` end-to-end here. To still ship
something you can trust rather than untested guesses, I verified the two
things most likely to silently break:

1. **The schema is real, not just plausible-looking.** `storage/sql/schema.sql`
   is a hand-written mirror of every migration in `database/migrations/`. I
   installed MySQL 8 in this sandbox, ran that SQL against it, and confirmed
   all 24 tables (and every foreign key, unique constraint, and the `reviews`
   rating CHECK constraint) actually get created — then inserted a full
   `user → agency → tour → tour_date → booking` chain and joined it back to
   confirm the relationships hold, and confirmed a `DELETE` on a
   still-referenced destination and an out-of-range rating both get **rejected**
   by the database, not just by application code.
2. **Every PHP file parses.** All 88 files under `app/`, `database/`, `routes/`,
   and `bootstrap/` pass `php -l` (installed PHP 8.3 in this sandbox for this
   purpose) with zero syntax errors.

What this *doesn't* prove: that the full Laravel framework boots cleanly with
these files wired together (route model binding, service container resolution,
middleware registration) — that needs a real `composer install`, which needs
your internet connection, not this sandbox's. Run `composer install` and
`php artisan route:list` as your first sanity check after unzipping.

## Setup

```bash
composer install
cp .env.example .env
php artisan key:generate

# Create the database (or use the reference dump directly):
mysql -u root -e "CREATE DATABASE travel_marketplace CHARACTER SET utf8mb4;"

php artisan migrate
php artisan db:seed

php artisan install:api   # publishes Sanctum's migration/config if not already present
php artisan serve
```

Seeded logins (all use password `password`):
- Admin: `admin@voyagr.test`
- Agency owner: `high-altitude-expeditions@voyagr.test` (and 4 more — see `DatabaseSeeder`)

## Architecture

```
app/
  Enums/            Type-safe status values (UserRole, BookingStatus, TourStatus, ...)
  Models/           Eloquent models — one per table, with relationships + scopes
  Services/         BookingService (transactional booking + email dispatch), ActivityLogger
  Mail/             5 Mailables with a shared branded HTML layout
  Policies/         TourPolicy, BookingPolicy, AgencyPolicy — role + ownership checks
  Http/
    Controllers/Api/          Public + authenticated customer endpoints
    Controllers/Api/Agency/   Agency-dashboard endpoints (scoped to the caller's own agency)
    Controllers/Api/Admin/    Super Admin endpoints (approval, dashboard)
    Requests/                 Form Request validation classes
    Resources/                JSON response shaping
    Middleware/                EnsureUserHasRole (role:agency / role:admin)
database/
  migrations/       24 tables, in dependency order
  seeders/          Mirrors the frontend's mock content (same agencies/categories/destinations)
storage/sql/schema.sql   Human-readable, MySQL-validated mirror of the migrations
```

### How the business rules map to code

| Rule | Where it's enforced |
|---|---|
| Every agency manages only its own tours/bookings (rules #2, #8) | `Agency\TourManagementController` and `Agency\BookingManagementController` always query through `$request->user()->agency->tours()` / `->bookings()` — never a client-supplied `agency_id`. `TourPolicy`/`BookingPolicy` back this up on single-record routes. |
| Every booking gets a unique ID (#5) | `Booking::generateBookingNumber()`, called from a `booted()` model hook, so it's impossible to create a booking without one. |
| Booking → 3-way email (customer, agency, admin) (#6) | `BookingService::dispatchCreationEmails()`, called inside the same DB transaction as booking creation. |
| Customers can only review completed tours (#7) | `Booking::isReviewEligible()` + `reviews.booking_id` is `UNIQUE`, so a booking can only ever produce one review, and only once its status is `completed`. |
| Every tour needs admin approval before going public (#10) | New/edited tours are forced to `pending_approval`; only `TourApprovalController::approve` (admin-only, via `TourPolicy::approve`) can set `published`. Public `TourController::index/show` only ever query `Tour::published()`. |
| Every agency needs verification before publishing (#11) | `StoreTourRequest::authorize()` checks `$user->agency?->isVerified()` before an agency can even submit a tour; new agencies register in `pending` status. |

## API reference (high level)

**Public**
- `GET /api/tours` — search/filter/sort (`q`, `category`, `destination`, `max_price`, `transport`, `hotel_rating`, `free_cancellation`, `instant_confirmation`, `meals_included`, `verified_only`, `sort`)
- `GET /api/tours/featured`, `GET /api/tours/trending`
- `GET /api/tours/{slug}` — full detail payload (gallery, itinerary, dates, reviews)
- `GET /api/tours/{slug}/reviews`
- `POST /api/tours/{slug}/bookings` — booking form submit (guest or authenticated)
- `POST /api/bookings/{id}/payment/create-order`, `POST /api/bookings/{id}/payment/verify` — SabPaisa checkout flow
- `POST /api/webhooks/sabpaisa` — server-to-server payment confirmation (register this URL in the SabPaisa dashboard)
- `GET /api/agencies`, `GET /api/agencies/{slug}`, `POST /api/agencies/register`
- `GET /api/categories`, `GET /api/destinations`
- `POST /api/auth/register`, `/login`, `/google`, `/forgot-password`

**Authenticated customer** (`Authorization: Bearer <token>`)
- `GET /api/auth/me`, `POST /api/auth/logout`
- `GET /api/me/bookings`, `GET /api/me/bookings/{id}`, `PATCH /api/me/bookings/{id}/cancel`
- `GET/POST/DELETE /api/me/wishlist[/{slug}]`
- `GET/POST/DELETE /api/me/compare[/{slug}]`
- `POST /api/bookings/{id}/review`

**Agency dashboard** (role: `agency`)
- `GET/POST /api/agency/tours`, `PUT/DELETE /api/agency/tours/{id}`, `POST /api/agency/tours/{id}/duplicate`
- `POST /api/agency/tours/{id}/dates`, `PATCH /api/agency/tours/{id}/dates/{dateId}/close`
- `GET /api/agency/bookings`, `GET /api/agency/bookings/export`, `PATCH /api/agency/bookings/{id}/status`
- `POST /api/agency/reviews/{id}/reply`

**Super Admin** (role: `admin`)
- `GET /api/admin/dashboard`
- `GET/POST /api/admin/agencies[/{id}/approve|reject|suspend]`
- `GET/POST /api/admin/tours[/{id}/approve|reject]`, `PATCH /api/admin/tours/{id}/featured`
- `GET /api/admin/bookings` — global, cross-agency
- `GET /api/admin/users`, `PATCH /api/admin/users/{id}/toggle-active`
- `GET/POST/PUT/DELETE /api/admin/categories[/{id}]`
- `GET/POST/PUT/DELETE /api/admin/destinations[/{id}]`
- `GET/POST/PUT/DELETE /api/admin/coupons[/{id}]`
- `GET/POST/PUT/DELETE /api/admin/banners[/{id}]`
- `GET/POST/PUT/DELETE /api/admin/blogs[/{id}]`
- `GET/POST/PUT/DELETE /api/admin/pages[/{id}]`
- `GET/PUT /api/admin/settings`

**Public CMS**
- `GET /api/blogs`, `GET /api/blogs/{slug}` — published only
- `GET /api/pages/{slug}` — published only
- `GET /api/banners` — active only, filterable by `?position=`

**Support tickets**
- `GET/POST /api/me/support-tickets`, `GET /api/me/support-tickets/{id}`, `POST /api/me/support-tickets/{id}/replies`
- `GET /api/admin/support-tickets`, `PATCH .../status`, `PATCH .../assign`, `POST .../replies`

## What's not in this phase

- File uploads (logo/cover/gallery/documents) — routes accept a `path` string
  today; wiring `Storage::disk('s3')` uploads is straightforward but not done.
- Coupons aren't yet applied at booking time (the model, table, and admin CRUD
  are ready; `BookingService::create()` doesn't take a coupon code yet).
- Notifications table exists but nothing writes to it yet — email is wired,
  in-app notifications aren't.
- No automated tests. Given the network constraints in this build
  environment, verification here was schema validation + syntax linting
  (see above) rather than a real PHPUnit run against a booted app — writing
  Feature tests for the booking flow, agency scoping, and the approval
  workflow would be the natural next step.
