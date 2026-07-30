import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/api/api_client.dart';
import '../../core/models/booking.dart';
import '../../core/models/paginated.dart';

final bookingsRepositoryProvider = Provider<BookingsRepository>((ref) {
  return BookingsRepository(ref.watch(apiClientProvider));
});

class CreateBookingPayload {
  const CreateBookingPayload({
    required this.tourDateId,
    required this.customerName,
    required this.customerEmail,
    required this.customerPhone,
    required this.adults,
    this.customerCity,
    this.children = 0,
    this.specialRequest,
  });

  final int tourDateId;
  final String customerName;
  final String customerEmail;
  final String customerPhone;
  final String? customerCity;
  final int adults;
  final int children;
  final String? specialRequest;

  Map<String, dynamic> toJson() {
    return {
      'tour_date_id': tourDateId,
      'customer_name': customerName,
      'customer_email': customerEmail,
      'customer_phone': customerPhone,
      if (customerCity != null && customerCity!.isNotEmpty) 'customer_city': customerCity,
      'adults': adults,
      'children': children,
      if (specialRequest != null && specialRequest!.isNotEmpty) 'special_request': specialRequest,
    };
  }
}

/// Mirrors frontend/lib/api/bookings.ts. Booking creation is guest-allowed
/// (skipAuth) — matches the backend's guest-checkout business rule — while
/// listing/cancelling a customer's own bookings requires the bearer token.
class BookingsRepository {
  BookingsRepository(this._client);

  final ApiClient _client;

  Future<Booking> create(String tourSlug, CreateBookingPayload payload) async {
    final json = await _client.post('/tours/$tourSlug/bookings', body: payload.toJson(), skipAuth: true)
        as Map<String, dynamic>;
    return Booking.fromJson(json['data'] as Map<String, dynamic>);
  }

  Future<Paginated<Booking>> mine({String? status, int page = 1}) async {
    final json = await _client.get('/me/bookings', query: {if (status != null) 'status': status, 'page': page})
        as Map<String, dynamic>;
    return Paginated.fromJson(json, Booking.fromJson);
  }

  Future<Booking> show(int bookingId) async {
    final json = await _client.get('/me/bookings/$bookingId') as Map<String, dynamic>;
    return Booking.fromJson(json['data'] as Map<String, dynamic>);
  }

  Future<Booking> cancel(int bookingId, {String? reason}) async {
    final json = await _client.patch('/me/bookings/$bookingId/cancel', body: {if (reason != null) 'reason': reason})
        as Map<String, dynamic>;
    return Booking.fromJson(json['data'] as Map<String, dynamic>);
  }
}

/// `status` of `null` maps to the "All" tab on the My Bookings screen.
final myBookingsProvider = FutureProvider.family<Paginated<Booking>, String?>((ref, status) {
  return ref.watch(bookingsRepositoryProvider).mine(status: status);
});

final bookingDetailProvider = FutureProvider.family<Booking, int>((ref, bookingId) {
  return ref.watch(bookingsRepositoryProvider).show(bookingId);
});
