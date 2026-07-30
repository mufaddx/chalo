import 'package:flutter/material.dart';

class StatusBadge extends StatelessWidget {
  const StatusBadge({super.key, required this.label, required this.color});

  factory StatusBadge.bookingStatus(String status) {
    final color = switch (status) {
      'confirmed' => Colors.green,
      'pending' => Colors.orange,
      'completed' => Colors.blue,
      'cancelled' => Colors.red,
      _ => Colors.grey,
    };
    return StatusBadge(label: status, color: color);
  }

  factory StatusBadge.paymentStatus(String status) {
    final color = switch (status) {
      'paid' => Colors.green,
      'partial' => Colors.orange,
      'refunded' => Colors.blueGrey,
      _ => Colors.red, // unpaid
    };
    return StatusBadge(label: status, color: color);
  }

  final String label;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(color: color.withOpacity(0.12), borderRadius: BorderRadius.circular(999)),
      child: Text(
        label[0].toUpperCase() + label.substring(1),
        style: TextStyle(color: color, fontSize: 12, fontWeight: FontWeight.w600),
      ),
    );
  }
}
