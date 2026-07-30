import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/api/api_exception.dart';
import '../../core/models/booking.dart';
import '../../shared/widgets/error_view.dart';
import '../../shared/widgets/loading_view.dart';
import '../../shared/widgets/main_bottom_nav.dart';
import '../../shared/widgets/status_badge.dart';
import '../payments/widgets/pay_now_button.dart';
import 'bookings_repository.dart';

const _tabs = [
  (label: 'All', status: null),
  (label: 'Pending', status: 'pending'),
  (label: 'Confirmed', status: 'confirmed'),
  (label: 'Completed', status: 'completed'),
  (label: 'Cancelled', status: 'cancelled'),
];

class MyBookingsScreen extends ConsumerStatefulWidget {
  const MyBookingsScreen({super.key});

  @override
  ConsumerState<MyBookingsScreen> createState() => _MyBookingsScreenState();
}

class _MyBookingsScreenState extends ConsumerState<MyBookingsScreen> with SingleTickerProviderStateMixin {
  late final TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: _tabs.length, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Bookings'),
        bottom: TabBar(
          controller: _tabController,
          isScrollable: true,
          tabs: _tabs.map((t) => Tab(text: t.label)).toList(),
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: _tabs.map((t) => _BookingsList(status: t.status)).toList(),
      ),
      bottomNavigationBar: const MainBottomNav(currentIndex: 2),
    );
  }
}

class _BookingsList extends ConsumerWidget {
  const _BookingsList({required this.status});

  final String? status;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final async = ref.watch(myBookingsProvider(status));

    return async.when(
      loading: () => const LoadingView(),
      error: (error, _) => ErrorView(error: error, onRetry: () => ref.invalidate(myBookingsProvider(status))),
      data: (page) {
        if (page.items.isEmpty) {
          return const Center(child: Text('No bookings here yet.'));
        }
        return RefreshIndicator(
          onRefresh: () async => ref.invalidate(myBookingsProvider(status)),
          child: ListView.separated(
            padding: const EdgeInsets.all(12),
            itemCount: page.items.length,
            separatorBuilder: (_, __) => const SizedBox(height: 10),
            itemBuilder: (context, i) => _BookingCard(booking: page.items[i]),
          ),
        );
      },
    );
  }
}

class _BookingCard extends ConsumerWidget {
  const _BookingCard({required this.booking});

  final Booking booking;

  Future<void> _cancel(BuildContext context, WidgetRef ref) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Cancel this booking?'),
        content: const Text('This will release your seats back to the tour.'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Keep booking')),
          FilledButton(onPressed: () => Navigator.pop(context, true), child: const Text('Cancel booking')),
        ],
      ),
    );
    if (confirmed != true) return;

    try {
      await ref.read(bookingsRepositoryProvider).cancel(booking.id);
      ref.invalidate(myBookingsProvider(null));
      ref.invalidate(myBookingsProvider('pending'));
      ref.invalidate(myBookingsProvider('confirmed'));
      ref.invalidate(myBookingsProvider('cancelled'));
    } on ApiException catch (e) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.message)));
      }
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Card(
      child: InkWell(
        onTap: () => context.push('/bookings/${booking.id}'),
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(booking.tourTitle ?? 'Tour', style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 15.5)),
              const SizedBox(height: 4),
              Text(
                [booking.bookingNumber, booking.agencyName, booking.travelDate].whereType<String>().join(' · '),
                style: const TextStyle(color: Colors.grey, fontSize: 12.5),
              ),
              const SizedBox(height: 10),
              Row(
                children: [
                  StatusBadge.bookingStatus(booking.status),
                  const SizedBox(width: 6),
                  StatusBadge.paymentStatus(booking.paymentStatus),
                  const Spacer(),
                  Text('₹${booking.totalAmount.toStringAsFixed(0)}', style: const TextStyle(fontWeight: FontWeight.bold)),
                ],
              ),
              if (booking.needsPayment || booking.isCancellable) ...[
                const SizedBox(height: 10),
                Row(
                  children: [
                    if (booking.needsPayment)
                      Expanded(
                        child: PayNowButton(
                          bookingId: booking.id,
                          onStartPayment: (order) => context.push('/payment', extra: order),
                        ),
                      ),
                    if (booking.needsPayment && booking.isCancellable) const SizedBox(width: 8),
                    if (booking.isCancellable)
                      OutlinedButton(onPressed: () => _cancel(context, ref), child: const Text('Cancel')),
                  ],
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
