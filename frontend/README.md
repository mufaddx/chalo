# Voyagr — Multi-Vendor Travel Marketplace (Public Website)

This is the **public customer-facing frontend** for the Travel Marketplace project —
Phase 1 of the build. It covers the home page, search/listing with working filters,
tour detail pages, and travel agency profile pages, all built on real (mock) data
so every page is populated with realistic content rather than placeholders.

## Stack

- **Next.js 16** (App Router, Turbopack)
- **TypeScript**
- **Tailwind CSS v4** (token-based theme in `app/globals.css`)
- **lucide-react** for icons
- Mock data layer in `lib/data.ts` — no backend yet (see "What's not included" below)

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000. This requires internet access on first run so
`next/font/google` can fetch Bricolage Grotesque, Inter and JetBrains Mono.

```bash
npm run build   # production build
npm run start   # serve the production build
```

## Design system

The visual direction is deliberately not the generic "AI website" look
(cream + serif + terracotta, or near-black + neon). Tokens live in
`app/globals.css` under `:root` / `@theme inline`:

- **Ink** `#0e1420` — primary dark surface & text
- **Paper** `#fcfcfb` — base background (cool white, not cream)
- **Gold** `#e4a64b` / **Gold Deep** `#c1852f` — the one accent color, used sparingly
- **Teal** `#123c3d` — trust / verification color (badges, policy call-outs)
- **Slate** `#626b78` — secondary text

Typography: **Bricolage Grotesque** (display), **Inter** (body), **JetBrains Mono**
(prices, coordinates, booking IDs — anywhere a number needs to read as data).

The signature motif is the **route line** (`components/shared/route-line.tsx`) —
a dashed flight-path SVG used in the hero and, rotated, as the connector between
itinerary days on the tour detail page. Destination cards carry real coordinate
labels (e.g. `34.15°N, 77.58°E`) instead of decorative numbering, since these
pages are genuinely about places with coordinates.

## Pages included

| Route | Description |
|---|---|
| `/` | Home — hero + smart search, categories, featured/trending/last-minute tours, destinations, top agencies, why-choose-us, testimonials, blog preview, FAQ, newsletter, Instagram strip |
| `/search` | Listing page — live client-side filtering (category, budget, transport, hotel rating, free cancellation, instant confirmation, meals, verified-only), sort, grid/list view, mobile filter drawer |
| `/tours/[slug]` | Tour detail — gallery with lightbox, overview, day-wise itinerary accordion, stay/meals, pickup/drop, inclusions/exclusions, things to carry, cancellation policy, reviews with rating breakdown, related tours, sticky booking panel |
| `/agencies/[slug]` | Agency profile — cover, stats, about, active tours, aggregated reviews, contact card |
| `/dashboard` | Customer dashboard — overview, My Bookings (+ detail/timeline/cancel), Wishlist, Compare, Travellers, Profile, Notifications, Support, Settings. Uses mock data (`lib/dashboard-data.ts`); not yet wired to the backend or real auth. |
| `/agency/dashboard` | Agency dashboard — overview (today's bookings, revenue chart, quick actions), Tours (list/create/edit/delete/duplicate/manage dates & seats), Bookings (status pipeline, customer detail drawer, notes, CSV export, print), Customers (list + booking history), Reviews (reply/hide), Agency Profile. Uses mock data (`lib/agency-dashboard-data.ts`); scoped to a single hardcoded logged-in agency for this demo. |
| `/admin` | Super Admin panel — Dashboard (platform stats, revenue chart), Agencies (approve/reject/suspend with document review), Tours (approve/reject, toggle featured), Bookings (global view, CSV export), Users, Categories, Destinations, Coupons, Banners (homepage control), Blogs, Pages (CMS), Support Tickets (global queue), Settings (general/SEO/email templates/newsletter). Uses mock data (`lib/admin-data.ts`); no real auth gate. |
| `/agency/register` | Placeholder page so navigation doesn't 404 — separate build phase |
| `/support` | Placeholder — the dashboard's own in-app ticketing at `/dashboard/support` is fully built; this standalone public help centre is still a stub |

## Connecting the real backend

Once the backend is seeded (`php artisan db:seed`), you can log in as any of the three roles to see each dashboard for real: `admin@voyagr.test`, or an agency owner like `high-altitude-expeditions@voyagr.test` — both use password `password`. A fresh customer account works too via `/register`.

Almost everything is wired to real API calls at this point — auth, tour browsing, booking creation + cancellation + payment, both dashboards' core CRUD, all admin CMS sections, support tickets, and now the home page and agency profile pages too. Here's what's real and how it was verified:

1. **Setup**: get the backend running first (`voyagr-travel-marketplace-backend.zip` → `composer install && php artisan serve`), then `cp .env.local.example .env.local` here and point `NEXT_PUBLIC_API_URL` at it. Log in at `/login` — it redirects by role.
2. **Customer-facing**: auth, search, tour detail, booking creation + payment, My Bookings + cancellation, support tickets.
3. **Home page**: featured/trending/upcoming tour rails fetch from `/api/tours/featured`, `/api/tours/trending`. Destinations, categories, and top agencies sections are still mock (see below).
4. **Agency profile pages** (`/agencies/[slug]`): fetch the agency via `/api/agencies/{slug}` and its tours via the new `GET /api/tours?agency=slug` filter (added to the backend specifically for this). Reviews only render in demo mode — the live tours endpoint returns summaries without full review objects, and showing partial fabricated-looking reviews would be worse than omitting the section.
5. **Agency dashboard**: overview stats, tours list + delete + duplicate, bookings list + status updates + notes, **and now the tour creation form** — "Create tour" fetches live categories/destinations and calls `POST /api/agency/tours` for real. Editing an existing tour still submits as mock only (see below for why).
6. **Admin panel**: dashboard, agency approval, tour approval, global bookings, users, and **all CMS sections** (categories, destinations, coupons, banners, blogs, pages, settings) are live via `/api/admin/*`.
7. **A real backend bug I found and fixed while wiring this**: `BookingResource` and `AgencyResource` were missing fields the dashboards actually needed — see the backend's own changelog for the full list. This is the value of actually wiring a consumer against the contract instead of just writing both sides to a shared spec.
8. **Every fallback is visible, not silent** — the same `LiveDataBanner` / `DemoDataBanner` pattern from earlier passes, now on every page that talks to the API.
9. **Verification**: extended the same Node mock-server approach across every new endpoint this pass touched (support tickets, the agency tour filter, CMS CRUD) and ran real `curl` requests against all of them. `next build` also still passes cleanly — and because this sandbox never has a live backend, every server-side fetch in the home page and all 5 agency profile pages' static generation genuinely executed against a closed port and exercised the real fallback path, not a hypothetical one.

### What's still mock, and why

- **Home page's Destinations, Categories, and Top Agencies sections**: these are separate self-contained components that read `lib/data.ts` directly rather than accepting props; converting them means restructuring how they receive data, not just adding a fetch call. Lower priority since they're navigational, not transactional.
- **Agency dashboard's tour *edit* form**: creating a tour is live, but editing one still shows the mock confirmation. The edit page currently looks up the tour by slug from mock data — wiring it for real needs an agency-scoped "get one tour by slug" endpoint, which doesn't exist yet (only the list endpoint does).
- **Agency dashboard's "manage dates" modal**: still fully local state. The backend has `POST /api/agency/tours/{id}/dates` and `PATCH .../dates/{id}/close` ready; the modal just isn't wired to them yet.
- **Admin's Email Templates and Newsletter tabs**: intentionally read-only/demo — the actual email sending logic lives in the backend's Mail classes, not a database table, so there's nothing to edit from an admin UI without building a template-storage system first.

## Payments (SabPaisa)

Real bookings — the ones created via the live API, not the mock fallback —
can be paid for through SabPaisa's PG 3.0 hosted checkout:

- `components/payment/pay-now-button.tsx` creates a payment session (`POST /api/bookings/{id}/payment/create-order`) and does a full-page redirect to the `checkout_url` it returns. Unlike Razorpay, there's no in-page JS widget — SabPaisa's checkout is a hosted page.
- `app/dashboard/bookings/[id]/payment/return/page.tsx` is where SabPaisa redirects the customer back to after checkout. It calls `POST /api/bookings/{id}/payment/verify`, which re-confirms the payment server-side via SabPaisa's Transaction Enquiry API (return-URL query params are never trusted directly), and shows paid/failed/still-processing accordingly.
- The Pay Now button shows up in two places: right after a successful real booking (in the confirmation screen), and next to any unpaid booking in `/dashboard/bookings`.

**What's genuinely verified vs. not**: session creation and the enquiry check both call SabPaisa's real API (`merchant-api.sabpaisa.in`), which isn't something this sandbox could reach to test. To actually try the full flow, you'll need the SabPaisa merchant credentials in the backend's `.env` (`SABPAISA_API_KEY`, `SABPAISA_SECRET_KEY`, `SABPAISA_MERCHANT_ID`) and a reachable `FRONTEND_URL` for the return redirect.

## Booking flow (frontend-only demo)

The "Book now" and "Send an enquiry" buttons on the tour detail page open a
real form (`components/tour/booking-modal.tsx`) matching the spec — name,
mobile, email, city, adults, children, travel date, special request — and on
submit it generates a mock Booking ID client-side. **Nothing is persisted or
emailed** yet; wiring this to a real backend is the next phase.

## What's not included in this phase

Not built yet, and needed before this is a real product:

- **A handful of specific pieces are still mock** — see "What's still mock, and why" above for exactly which ones (home page's destination/category/agency sections, agency tour *editing*, the manage-dates modal, admin email templates/newsletter).
- **Route protection is client-side only** (`components/auth/require-auth.tsx`), not server middleware — the token lives in `localStorage`, which Next.js middleware can't read, so a determined person could still view page source before the redirect fires. The actual security boundary is the backend: every protected endpoint requires a valid Sanctum token and the right role. See the comment in the file for the full reasoning.
- **Booking creation only goes live when the tour itself came from the live API** — on a mock/demo tour it still shows the old mock confirmation (clearly labeled).
- Real file uploads — logo/banner/document/gallery uploads across all three dashboards add a placeholder image or accept a filename, not a real upload
- Email verification, password reset flow (the backend has a `/forgot-password` endpoint; no frontend page calls it yet), and Google login (the backend supports it; no "Sign in with Google" button exists here)
- Reports/Analytics beyond the dashboards' revenue charts aren't built

## Notes on placeholder images

All photography currently comes from `picsum.photos` with descriptive seeds
(e.g. `picsum.photos/seed/tour-ladakh-1/1200/800`) so every image reliably
resolves without needing image search/licensing. Swap these for real agency
photography by replacing the `image`/`gallery`/`logo`/`cover` URLs in
`lib/data.ts` — the `next.config.ts` `remotePatterns` will need the real image
host(s) added when you do.
