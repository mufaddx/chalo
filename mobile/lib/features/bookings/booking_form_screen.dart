import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/api/api_exception.dart';
import '../../core/models/tour_detail.dart';
import 'bookings_repository.dart';

class BookingFormScreen extends ConsumerStatefulWidget {
  const BookingFormScreen({super.key, required this.tour, required this.dates});

  final TourDetail tour;
  final List<TourDateOption> dates;

  @override
  ConsumerState<BookingFormScreen> createState() => _BookingFormScreenState();
}

class _BookingFormScreenState extends ConsumerState<BookingFormScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _cityController = TextEditingController();
  final _requestController = TextEditingController();
  int _adults = 2;
  int _children = 0;
  TourDateOption? _selectedDate;
  bool _submitting = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _selectedDate = widget.dates.first;
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _cityController.dispose();
    _requestController.dispose();
    super.dispose();
  }

  double get _estimatedTotal => widget.tour.price * (_adults + _children);

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate() || _selectedDate == null) return;

    setState(() {
      _submitting = true;
      _error = null;
    });

    try {
      final booking = await ref.read(bookingsRepositoryProvider).create(
            widget.tour.slug,
            CreateBookingPayload(
              tourDateId: _selectedDate!.id,
              customerName: _nameController.text.trim(),
              customerEmail: _emailController.text.trim(),
              customerPhone: _phoneController.text.trim(),
              customerCity: _cityController.text.trim(),
              adults: _adults,
              children: _children,
              specialRequest: _requestController.text.trim(),
            ),
          );
      if (!mounted) return;
      context.pushReplacement('/booking-confirmation', extra: booking);
    } on ApiException catch (e) {
      setState(() => _error = e.message);
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Book ${widget.tour.title}')),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                DropdownButtonFormField<TourDateOption>(
                  initialValue: _selectedDate,
                  decoration: const InputDecoration(labelText: 'Travel date', border: OutlineInputBorder()),
                  items: widget.dates
                      .map((d) => DropdownMenuItem(
                            value: d,
                            child: Text('${d.departureDate} · ${d.seatsAvailable} seats left'),
                          ))
                      .toList(),
                  onChanged: (v) => setState(() => _selectedDate = v),
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _nameController,
                  decoration: const InputDecoration(labelText: 'Full name', border: OutlineInputBorder()),
                  validator: (v) => (v == null || v.isEmpty) ? 'Required' : null,
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _phoneController,
                  keyboardType: TextInputType.phone,
                  decoration: const InputDecoration(labelText: 'Mobile number', border: OutlineInputBorder()),
                  validator: (v) => (v == null || v.isEmpty) ? 'Required' : null,
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _emailController,
                  keyboardType: TextInputType.emailAddress,
                  decoration: const InputDecoration(labelText: 'Email address', border: OutlineInputBorder()),
                  validator: (v) => (v == null || v.isEmpty) ? 'Required' : null,
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _cityController,
                  decoration: const InputDecoration(labelText: 'City', border: OutlineInputBorder()),
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(child: _Stepper(label: 'Adults', value: _adults, min: 1, onChanged: (v) => setState(() => _adults = v))),
                    const SizedBox(width: 12),
                    Expanded(child: _Stepper(label: 'Children', value: _children, min: 0, onChanged: (v) => setState(() => _children = v))),
                  ],
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _requestController,
                  maxLines: 3,
                  decoration: const InputDecoration(labelText: 'Special request (optional)', border: OutlineInputBorder()),
                ),
                const SizedBox(height: 16),
                Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(color: Colors.grey.shade100, borderRadius: BorderRadius.circular(10)),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Estimated total (${_adults + _children} traveller${_adults + _children > 1 ? 's' : ''})'),
                      Text('₹${_estimatedTotal.toStringAsFixed(0)}', style: const TextStyle(fontWeight: FontWeight.bold)),
                    ],
                  ),
                ),
                if (_error != null) ...[
                  const SizedBox(height: 12),
                  Text(_error!, style: const TextStyle(color: Colors.red)),
                ],
                const SizedBox(height: 16),
                FilledButton(
                  onPressed: _submitting ? null : _submit,
                  child: _submitting
                      ? const SizedBox(height: 18, width: 18, child: CircularProgressIndicator(strokeWidth: 2))
                      : const Text('Submit booking'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _Stepper extends StatelessWidget {
  const _Stepper({required this.label, required this.value, required this.min, required this.onChanged});

  final String label;
  final int value;
  final int min;
  final ValueChanged<int> onChanged;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(fontSize: 12, color: Colors.grey)),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 8),
          decoration: BoxDecoration(border: Border.all(color: Colors.grey.shade300), borderRadius: BorderRadius.circular(8)),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              IconButton(onPressed: () => onChanged((value - 1).clamp(min, 99)), icon: const Icon(Icons.remove)),
              Text('$value'),
              IconButton(onPressed: () => onChanged((value + 1).clamp(min, 99)), icon: const Icon(Icons.add)),
            ],
          ),
        ),
      ],
    );
  }
}
