import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/api/api_client.dart';

class PaymentOrder {
  PaymentOrder({
    required this.checkoutUrl,
    required this.bookingId,
    required this.bookingNumber,
    required this.customerName,
    required this.customerEmail,
    required this.customerPhone,
  });

  factory PaymentOrder.fromJson(int bookingId, Map<String, dynamic> json) {
    return PaymentOrder(
      checkoutUrl: json['checkout_url'] as String,
      bookingId: bookingId,
      bookingNumber: json['booking_number'] as String,
      customerName: json['customer_name'] as String,
      customerEmail: json['customer_email'] as String,
      customerPhone: json['customer_phone'] as String,
    );
  }

  final String checkoutUrl;
  final int bookingId;
  final String bookingNumber;
  final String customerName;
  final String customerEmail;
  final String customerPhone;
}

class PaymentVerification {
  PaymentVerification({required this.message, required this.bookingId, required this.paymentStatus, this.paymentId});

  factory PaymentVerification.fromJson(Map<String, dynamic> json) {
    return PaymentVerification(
      message: json['message'] as String,
      bookingId: json['booking_id'] as int,
      paymentStatus: json['payment_status'] as String,
      paymentId: json['payment_id'] as String?,
    );
  }

  final String message;
  final int bookingId;
  final String paymentStatus; // unpaid | partial | paid | refunded
  final String? paymentId;

  bool get isPaid => paymentStatus == 'paid';
  bool get isFailed => message == 'Payment failed.';
}

final paymentRepositoryProvider = Provider<PaymentRepository>((ref) {
  return PaymentRepository(ref.watch(apiClientProvider));
});

/// Mirrors frontend/lib/api/payments.ts — both calls are guest-accessible
/// (booking id is the only credential needed), and verify() always
/// re-confirms server-side via SabPaisa's Transaction Enquiry API rather
/// than trusting anything the client saw during checkout.
class PaymentRepository {
  PaymentRepository(this._client);

  final ApiClient _client;

  Future<PaymentOrder> createOrder(int bookingId) async {
    final json = await _client.post('/bookings/$bookingId/payment/create-order', skipAuth: true) as Map<String, dynamic>;
    return PaymentOrder.fromJson(bookingId, json);
  }

  Future<PaymentVerification> verify(int bookingId) async {
    final json = await _client.post('/bookings/$bookingId/payment/verify', skipAuth: true) as Map<String, dynamic>;
    return PaymentVerification.fromJson(json);
  }
}
