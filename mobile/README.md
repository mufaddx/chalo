# Voyagr — customer mobile app (Flutter)

MVP customer app for the Voyagr travel marketplace: browse tours, book, pay
via SabPaisa, manage bookings. Talks to the same `backend/` Laravel API as
`frontend/`, using the same auth/error-handling conventions (see the file
header comments throughout `lib/` for exact cross-references).

**This code was written without a local Flutter SDK available, so it has
never been run or compiled here.** `flutter analyze`/`flutter run` on your
own machine is the first real verification step — see below.

## Setup

This repo has `mobile/android` and `mobile/ios` as empty placeholder
directories (no Flutter SDK was available to generate real platform
scaffolding). Before anything else:

```bash
cd mobile
flutter create --platforms=android,ios .
```

This is safe to run against the existing `lib/` and `pubspec.yaml` — `flutter
create` only fills in missing platform folders, it won't touch your Dart
code. Then:

```bash
flutter pub get
flutter analyze
```

Fix anything `analyze` flags (this is the first real compile-check this code
has had) before running.

## Running

The API base URL defaults to `http://10.0.2.2:8000/api` (Android emulator's
loopback to your host machine). Override it for a physical device or iOS
simulator with your machine's LAN IP, mirroring `frontend`'s
`NEXT_PUBLIC_API_URL`:

```bash
flutter run --dart-define=API_BASE_URL=http://192.168.1.50:8000/api
```

Make sure `backend/.env` has `FRONTEND_URL` reachable from wherever SabPaisa
redirects back to — see the payments note below.

**Android + local HTTP**: Android blocks plain-HTTP traffic by default since
API 28. Your local Laravel server is almost certainly `http://`, not
`https://`, so after running `flutter create`, add this to
`android/app/src/main/AndroidManifest.xml`'s `<application>` tag for local
development (remove/tighten before any real release build):
```xml
<application android:usesCleartextTraffic="true" ...>
```
Without it, every API call will fail as a silent network error with no
useful message — worth ruling out first if nothing loads.

## Payments (SabPaisa) — a real architectural gap

`backend/app/Services/PaymentService.php` builds SabPaisa's `returnUrl` as a
**web page URL** (`{FRONTEND_URL}/dashboard/bookings/{id}/payment/return`),
not a mobile deep link — there's no backend concept of "this client is the
Flutter app." `lib/features/payments/payment_webview_screen.dart` works
around this by loading SabPaisa's checkout in an in-app WebView and watching
outgoing navigation for that same URL pattern: the moment SabPaisa tries to
navigate there, the app intercepts it, closes the WebView, and verifies
payment itself via `POST /bookings/{id}/payment/verify` — the web page never
actually loads. No backend change was needed for this MVP, but it's worth
knowing this is a workaround, not a first-class mobile flow. A cleaner
follow-up would be a mobile-specific `returnUrl` (custom URL scheme like
`voyagr://payment/return/{id}`), which needs a small backend change.

## What's deferred to a later phase

Wishlist, compare, reviews (submitting one), and support tickets all already
have working backend endpoints (see the API research this was built from)
but no screens yet — added when that phase starts.

## Manual verification checklist

1. Register a new account → confirm you land on Home, not stuck on a blank screen.
2. Kill and reopen the app → confirm you're still logged in (token persisted via `flutter_secure_storage`).
3. Search tours, open a tour detail page, pick a real bookable date, submit a booking.
4. Tap Pay Now → confirm the SabPaisa WebView opens with a real `checkout_url`.
5. Complete (or intentionally fail) a sandbox payment → confirm the app detects the return and shows the right result screen without ever loading SabPaisa's web return page inside the WebView.
6. Check My Bookings → the booking's status/payment_status should match what you just did.
7. Cancel a pending booking → confirm it disappears from the "Confirmed/Pending" tabs and appears under "Cancelled".
8. Log out → confirm `/bookings` and `/account` bounce you to `/login` if you try to reach them directly afterward.
