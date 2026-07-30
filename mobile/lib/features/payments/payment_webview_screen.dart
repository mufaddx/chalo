import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:webview_flutter/webview_flutter.dart';

import 'payment_repository.dart';

/// SabPaisa's returnUrl (set server-side by PaymentService::returnUrlFor)
/// always points at the *web* frontend's `/dashboard/bookings/{id}/payment/return`
/// page — there is no mobile-specific deep link configured on the backend.
/// Rather than changing that (it's correct for the web app), this screen
/// loads checkout in an in-app WebView and watches outgoing navigation for
/// that same URL pattern: the moment SabPaisa tries to redirect there, the
/// navigation is cancelled before it ever loads, the WebView is closed, and
/// the app verifies payment itself instead of the web page doing it.
class PaymentWebViewScreen extends StatefulWidget {
  const PaymentWebViewScreen({super.key, required this.order});

  final PaymentOrder order;

  @override
  State<PaymentWebViewScreen> createState() => _PaymentWebViewScreenState();
}

class _PaymentWebViewScreenState extends State<PaymentWebViewScreen> {
  late final WebViewController _controller;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setNavigationDelegate(
        NavigationDelegate(
          onPageStarted: (_) => setState(() => _loading = true),
          onPageFinished: (_) => setState(() => _loading = false),
          onNavigationRequest: (request) {
            if (request.url.contains('/payment/return')) {
              _goToResult();
              return NavigationDecision.prevent;
            }
            return NavigationDecision.navigate;
          },
        ),
      )
      ..loadRequest(Uri.parse(widget.order.checkoutUrl));
  }

  void _goToResult() {
    if (!mounted) return;
    context.pushReplacement('/payment-result', extra: widget.order.bookingId);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Pay for ${widget.order.bookingNumber}'),
        actions: [
          TextButton(
            onPressed: _goToResult,
            child: const Text("I've completed payment", style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
      body: Stack(
        children: [
          WebViewWidget(controller: _controller),
          if (_loading) const LinearProgressIndicator(),
        ],
      ),
    );
  }
}
