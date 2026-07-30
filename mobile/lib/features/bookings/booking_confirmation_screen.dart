import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../core/models/booking.dart';
import '../payments/payment_repository.dart';
import '../payments/widgets/pay_now_button.dart';

class BookingConfirmationScreen extends StatelessWidget {
  const BookingConfirmationScreen({super.key, required this.booking});

  final Booking booking;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.check_circle, size: 56, color: Colors.green),
                const SizedBox(height: 16),
                Text('Booking request received', style: Theme.of(context).textTheme.headlineSmall, textAlign: TextAlign.center),
                const SizedBox(height: 8),
                const Text(
                  'Your booking is pending confirmation from the agency. Check My Bookings for updates.',
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 16),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  decoration: BoxDecoration(color: Colors.grey.shade100, borderRadius: BorderRadius.circular(10)),
                  child: Text('Booking ID: ${booking.bookingNumber}', style: const TextStyle(fontWeight: FontWeight.w600)),
                ),
                const SizedBox(height: 20),
                Text('Pay now to secure your seats faster, or pay later from My Bookings.', style: Theme.of(context).textTheme.bodySmall),
                const SizedBox(height: 8),
                SizedBox(
                  width: double.infinity,
                  child: PayNowButton(bookingId: booking.id, onStartPayment: (checkout) => context.push('/payment', extra: checkout)),
                ),
                const SizedBox(height: 12),
                TextButton(onPressed: () => context.go('/bookings'), child: const Text('Go to My Bookings')),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
