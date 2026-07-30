import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../core/models/booking.dart';
import '../core/models/tour_detail.dart';
import '../features/account/account_screen.dart';
import '../features/auth/auth_controller.dart';
import '../features/auth/login_screen.dart';
import '../features/auth/register_screen.dart';
import '../features/auth/splash_screen.dart';
import '../features/bookings/booking_confirmation_screen.dart';
import '../features/bookings/booking_detail_screen.dart';
import '../features/bookings/booking_form_screen.dart';
import '../features/bookings/my_bookings_screen.dart';
import '../features/payments/payment_repository.dart';
import '../features/payments/payment_result_screen.dart';
import '../features/payments/payment_webview_screen.dart';
import '../features/tours/home_screen.dart';
import '../features/tours/search_screen.dart';
import '../features/tours/tour_detail_screen.dart';

/// go_router needs a Listenable to know when to re-run `redirect` after
/// Riverpod's auth state changes (e.g. login completing, or logout) — it
/// has no native awareness of Riverpod providers on its own.
class _AuthRefreshNotifier extends ChangeNotifier {
  _AuthRefreshNotifier(Ref ref) {
    ref.listen(authControllerProvider, (_, __) => notifyListeners());
  }
}

const _protectedPrefixes = ['/bookings', '/account'];

final routerProvider = Provider<GoRouter>((ref) {
  final refreshNotifier = _AuthRefreshNotifier(ref);

  return GoRouter(
    initialLocation: '/splash',
    refreshListenable: refreshNotifier,
    redirect: (context, state) {
      final authAsync = ref.read(authControllerProvider);
      final loc = state.matchedLocation;

      // Still resolving the stored-token check — park on /splash until it's done.
      if (authAsync.isLoading) {
        return loc == '/splash' ? null : '/splash';
      }

      final loggedIn = authAsync.valueOrNull?.isAuthenticated ?? false;
      final isProtected = _protectedPrefixes.any((p) => loc.startsWith(p));
      final isAuthPage = loc == '/login' || loc == '/register';

      if (!loggedIn && isProtected) {
        return '/login?next=${Uri.encodeComponent(loc)}';
      }
      if (loggedIn && (isAuthPage || loc == '/splash')) {
        return '/home';
      }
      if (!loggedIn && loc == '/splash') {
        // Browsing tours doesn't require an account — only checkout/account do.
        return '/home';
      }
      return null;
    },
    routes: [
      GoRoute(path: '/splash', builder: (context, state) => const SplashScreen()),
      GoRoute(
        path: '/login',
        builder: (context, state) => LoginScreen(next: state.uri.queryParameters['next']),
      ),
      GoRoute(path: '/register', builder: (context, state) => const RegisterScreen()),
      GoRoute(path: '/home', builder: (context, state) => const HomeScreen()),
      GoRoute(path: '/search', builder: (context, state) => const SearchScreen()),
      GoRoute(path: '/account', builder: (context, state) => const AccountScreen()),
      GoRoute(
        path: '/tours/:slug',
        builder: (context, state) => TourDetailScreen(slug: state.pathParameters['slug']!),
      ),
      GoRoute(
        path: '/book',
        builder: (context, state) {
          final extra = state.extra as Map<String, Object?>;
          return BookingFormScreen(
            tour: extra['tour'] as TourDetail,
            dates: extra['dates'] as List<TourDateOption>,
          );
        },
      ),
      GoRoute(
        path: '/booking-confirmation',
        builder: (context, state) => BookingConfirmationScreen(booking: state.extra as Booking),
      ),
      GoRoute(
        path: '/bookings',
        builder: (context, state) => const MyBookingsScreen(),
      ),
      GoRoute(
        path: '/bookings/:id',
        builder: (context, state) => BookingDetailScreen(bookingId: int.parse(state.pathParameters['id']!)),
      ),
      GoRoute(
        path: '/payment',
        builder: (context, state) => PaymentWebViewScreen(order: state.extra as PaymentOrder),
      ),
      GoRoute(
        path: '/payment-result',
        builder: (context, state) => PaymentResultScreen(bookingId: state.extra as int),
      ),
    ],
  );
});
