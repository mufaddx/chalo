import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/api/api_exception.dart';
import 'payment_repository.dart';

enum _ResultState { checking, paid, failed, pending, error }

const _maxAttempts = 3;
const _retryDelay = Duration(seconds: 3);

/// Mirrors frontend/app/dashboard/bookings/[id]/payment/return/page.tsx:
/// SabPaisa's own status is never trusted, only the backend's re-confirmed
/// Transaction Enquiry result. A UPI payment can take a few seconds to
/// settle, so "still processing" gets a few bounded retries before landing
/// on a final "check back later" state.
class PaymentResultScreen extends ConsumerStatefulWidget {
  const PaymentResultScreen({super.key, required this.bookingId});

  final int bookingId;

  @override
  ConsumerState<PaymentResultScreen> createState() => _PaymentResultScreenState();
}

class _PaymentResultScreenState extends ConsumerState<PaymentResultScreen> {
  _ResultState _state = _ResultState.checking;
  String? _error;

  @override
  void initState() {
    super.initState();
    _check(1);
  }

  Future<void> _check(int attempt) async {
    try {
      final result = await ref.read(paymentRepositoryProvider).verify(widget.bookingId);
      if (!mounted) return;

      if (result.isPaid) {
        setState(() => _state = _ResultState.paid);
      } else if (result.isFailed) {
        setState(() => _state = _ResultState.failed);
      } else if (attempt < _maxAttempts) {
        await Future.delayed(_retryDelay);
        if (mounted) _check(attempt + 1);
      } else {
        setState(() => _state = _ResultState.pending);
      }
    } on ApiException catch (e) {
      if (!mounted) return;
      setState(() {
        _state = _ResultState.error;
        _error = e.message;
      });
    }
  }

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
                ..._content(),
                const SizedBox(height: 24),
                FilledButton(onPressed: () => context.go('/bookings'), child: const Text('Go to My Bookings')),
              ],
            ),
          ),
        ),
      ),
    );
  }

  List<Widget> _content() {
    switch (_state) {
      case _ResultState.checking:
        return const [
          CircularProgressIndicator(),
          SizedBox(height: 16),
          Text('Confirming your payment...'),
        ];
      case _ResultState.paid:
        return const [
          Icon(Icons.check_circle, size: 56, color: Colors.green),
          SizedBox(height: 16),
          Text('Payment received', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
          SizedBox(height: 8),
          Text('Your booking is now paid. A confirmation has been sent to your email.', textAlign: TextAlign.center),
        ];
      case _ResultState.failed:
        return const [
          Icon(Icons.cancel, size: 56, color: Colors.red),
          SizedBox(height: 16),
          Text("Payment failed", style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
          SizedBox(height: 8),
          Text("Your payment didn't go through. You can try again from My Bookings.", textAlign: TextAlign.center),
        ];
      case _ResultState.pending:
        return const [
          Icon(Icons.hourglass_top, size: 56, color: Colors.orange),
          SizedBox(height: 16),
          Text('Still processing', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
          SizedBox(height: 8),
          Text("We haven't received a final status yet. Check My Bookings shortly.", textAlign: TextAlign.center),
        ];
      case _ResultState.error:
        return [
          const Icon(Icons.error_outline, size: 56, color: Colors.red),
          const SizedBox(height: 16),
          const Text("Couldn't confirm payment", style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          Text(_error ?? 'Something went wrong.', textAlign: TextAlign.center),
        ];
    }
  }
}
