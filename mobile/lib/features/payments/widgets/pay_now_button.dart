import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/api/api_exception.dart';
import '../payment_repository.dart';

/// Mirrors frontend/components/payment/pay-now-button.tsx: creates a SabPaisa
/// checkout session, then hands the resulting order off to the caller —
/// which pushes the WebView screen — instead of opening anything itself.
class PayNowButton extends ConsumerStatefulWidget {
  const PayNowButton({super.key, required this.bookingId, required this.onStartPayment});

  final int bookingId;
  final void Function(PaymentOrder order) onStartPayment;

  @override
  ConsumerState<PayNowButton> createState() => _PayNowButtonState();
}

class _PayNowButtonState extends ConsumerState<PayNowButton> {
  bool _loading = false;
  String? _error;

  Future<void> _pay() async {
    setState(() {
      _loading = true;
      _error = null;
    });

    try {
      final order = await ref.read(paymentRepositoryProvider).createOrder(widget.bookingId);
      if (!mounted) return;
      widget.onStartPayment(order);
    } on ApiException catch (e) {
      setState(() => _error = e.message);
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        FilledButton.icon(
          onPressed: _loading ? null : _pay,
          icon: _loading
              ? const SizedBox(height: 16, width: 16, child: CircularProgressIndicator(strokeWidth: 2))
              : const Icon(Icons.payment),
          label: Text(_loading ? 'Opening payment...' : 'Pay now'),
        ),
        if (_error != null) ...[
          const SizedBox(height: 8),
          Text(_error!, style: const TextStyle(color: Colors.red, fontSize: 12.5), textAlign: TextAlign.center),
        ],
      ],
    );
  }
}
