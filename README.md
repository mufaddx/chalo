# Voyagr — Travel Marketplace (Full Project)

Everything in one place: the Next.js frontend (public site + customer/agency/
admin dashboards) and the Laravel backend (REST API, database schema, email,
payments) that powers it.

```
voyagr-complete/
├── frontend/   Next.js 15 + TypeScript + Tailwind — see frontend/README.md
└── backend/    Laravel 11 REST API — see backend/README.md
```

Each folder has its own detailed README with setup steps, architecture notes,
and — importantly — an honest account of what's been verified vs. not, and
exactly what's still mock/unfinished and why. Read those before diving in;
this file is just the map.

## Quick start (both together)

```bash
# 1. Backend
cd backend
composer install
cp .env.example .env
php artisan key:generate
mysql -u root -e "CREATE DATABASE travel_marketplace CHARACTER SET utf8mb4;"
php artisan migrate
php artisan db:seed
php artisan install:api
php artisan serve   # -> http://localhost:8000

# 2. Frontend (separate terminal)
cd frontend
npm install
cp .env.local.example .env.local   # NEXT_PUBLIC_API_URL=http://localhost:8000/api
npm run dev                         # -> http://localhost:3000
```

Seeded logins (password `password` for all):
- **Admin**: `admin@voyagr.test`
- **Agency owner**: `high-altitude-expeditions@voyagr.test`
- Or register a fresh customer account at `/register`

## What this is, in one paragraph

A multi-vendor travel marketplace: a public site where customers search,
compare, and book tours from verified travel agencies; a customer dashboard
for managing bookings; an agency dashboard for managing tours and bookings;
and a super-admin panel for approving agencies/tours and running the
platform's CMS (categories, destinations, coupons, banners, blog, pages,
settings). Booking creation, cancellation, and payment (SabPaisa) are wired
end-to-end against the real backend, not just mocked.

## What's real vs. mock, at a glance

Most of the product is wired to the real API at this point — auth, tour
browsing, booking + payment, both dashboards' core CRUD, all admin CMS
sections, and support tickets. A handful of things are still on mock data or
not built (agency tour *editing*, the tour-dates modal, three of the home
page's sections, file uploads, deployment, and automated tests, among a few
others) — `frontend/README.md`'s "What's still mock, and why" section has
the exact list and the specific reason for each one, not just a blanket
disclaimer.

## A note on verification

Neither this frontend nor backend has ever run against each other with a
live network connection between them, because the environment this was built
in can't reach either a real MySQL-connected Laravel server long-term nor
external services like SabPaisa or Packagist. Instead, verification happened
piece by piece as things were built: the database schema was validated
against a real, temporary MySQL instance; PHP files were syntax-linted;
request/response contracts were checked against a hand-written mock server
using real `curl` calls; and the frontend's `next build` was run repeatedly,
which — since there's genuinely no backend reachable in that environment —
means every server-side fetch-with-fallback in the code has already executed
for real against a closed port and exercised its fallback path, not a
hypothetical one. Full details are in each README's own verification notes.
The one thing that hasn't happened is a human clicking through the whole
flow in a browser against a live `php artisan serve` — that's the first
thing to do once you have this running locally.
