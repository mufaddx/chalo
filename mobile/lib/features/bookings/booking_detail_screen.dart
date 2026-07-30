import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/models/booking.dart';
import '../../shared/widgets/error_view.dart';
import '../../shared/widgets/loading_view.dart';
import '../../shared/widgets/status_badge.dart';
import '../payments/widgets/pay_now_button.dart';
import 'bookings_repository.dart';

class BookingDetailScreen extends ConsumerWidget {
  const BookingDetailScreen({super.key, required this.bookingId});

  final int bookingId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final async = ref.watch(bookingDetailProvider(bookingId));

    return Scaffold(
      appBar: AppBar(title: const Text('Booking details')),
      body: async.when(
        loading: () => const LoadingView(),
        error: (error, _) => ErrorView(error: error, onRetry: () => ref.invalidate(bookingDetailProvider(bookingId))),
        data: (booking) => _BookingDetailBody(booking: booking),
      ),
    );
  }
}

class _BookingDetailBody extends StatelessWidget {
  const _BookingDetailBody({required this.booking});

  final Booking booking;

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Text(booking.tourTitle ?? 'Tour', style: Theme.of(context).textTheme.headlineSmall),
        const SizedBox(height: 4),
        Text(booking.bookingNumber, style: const TextStyle(color: Colors.grey)),
        const SizedBox(height: 12),
        Row(children: [StatusBadge.bookingStatus(booking.status), const SizedBox(width: 8), StatusBadge.paymentStatus(booking.paymentStatus)]),
        const Divider(height: 32),
        _Row(label: 'Agency', value: booking.agencyName ?? '—'),
        _Row(label: 'Travel date', value: booking.travelDate ?? '—'),
        _Row(label: 'Travellers', value: '${booking.adults} adult${booking.adults > 1 ? 's' : ''}${booking.children > 0 ? ', ${booking.children} children' : ''}'),
        _Row(label: 'Total amount', value: '₹${booking.totalAmount.toStringAsFixed(0)}'),
        const Divider(height: 32),
        Text('Contact details', style: Theme.of(context).textTheme.titleMedium),
        const SizedBox(height: 8),
        _Row(label: 'Name', value: booking.customerName),
        _Row(label: 'Email', value: booking.customerEmail),
        _Row(label: 'Phone', value: booking.customerPhone),
        if (booking.customerCity != null) _Row(label: 'City', value: booking.customerCity!),
        if (booking.specialRequest != null && booking.specialRequest!.isNotEmpty) ...[
          const SizedBox(height: 12),
          Text('Special request', style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 4),
          Text(booking.specialRequest!),
        ],
        if (booking.agencyNotes != null && booking.agencyNotes!.isNotEmpty) ...[
          const SizedBox(height: 12),
          Text('Note from agency', style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 4),
          Text(booking.agencyNotes!),
        ],
        if (booking.cancelledReason != null && booking.cancelledReason!.isNotEmpty) ...[
          const SizedBox(height: 12),
          Text('Cancellation reason', style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 4),
          Text(booking.cancelledReason!),
        ],
        if (booking.needsPayment) ...[
          const SizedBox(height: 24),
          PayNowButton(bookingId: booking.id, onStartPayment: (order) => context.push('/payment', extra: order)),
        ],
      ],
    );
  }
}

class _Row extends StatelessWidget {
  const _Row({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(width: 110, child: Text(label, style: const TextStyle(color: Colors.grey))),
          Expanded(child: Text(value)),
        ],
      ),
    );
  }
}
