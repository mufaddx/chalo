import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/models/tour_detail.dart';
import '../../shared/widgets/error_view.dart';
import '../../shared/widgets/loading_view.dart';
import 'tours_repository.dart';

class TourDetailScreen extends ConsumerWidget {
  const TourDetailScreen({super.key, required this.slug});

  final String slug;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final asyncTour = ref.watch(tourDetailProvider(slug));

    return asyncTour.when(
      loading: () => const Scaffold(body: LoadingView()),
      error: (error, _) => Scaffold(body: ErrorView(error: error, onRetry: () => ref.invalidate(tourDetailProvider(slug)))),
      data: (tour) => _TourDetailScaffold(tour: tour),
    );
  }
}

class _TourDetailScaffold extends StatelessWidget {
  const _TourDetailScaffold({required this.tour});

  final TourDetail tour;

  @override
  Widget build(BuildContext context) {
    final bookableDates = tour.tourDates.where((d) => d.isBookable).toList();

    return Scaffold(
      body: _TourDetailBody(tour: tour),
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('₹${tour.price.toStringAsFixed(0)}', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                    Text(
                      bookableDates.isEmpty ? 'No dates available' : '${bookableDates.length} dates available',
                      style: TextStyle(color: bookableDates.isEmpty ? Colors.red : Colors.grey, fontSize: 12),
                    ),
                  ],
                ),
              ),
              FilledButton(
                onPressed: bookableDates.isEmpty
                    ? null
                    : () => context.push('/book', extra: {'tour': tour, 'dates': bookableDates}),
                child: const Text('Book now'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _TourDetailBody extends StatelessWidget {
  const _TourDetailBody({required this.tour});

  final TourDetail tour;

  @override
  Widget build(BuildContext context) {
    return CustomScrollView(
      slivers: [
        SliverAppBar(
          expandedHeight: 220,
          pinned: true,
          flexibleSpace: FlexibleSpaceBar(
            background: tour.gallery.isNotEmpty
                ? CachedNetworkImage(imageUrl: tour.gallery.first.path, fit: BoxFit.cover)
                : Container(color: Colors.grey.shade300),
          ),
        ),
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(tour.title, style: Theme.of(context).textTheme.headlineSmall),
                const SizedBox(height: 6),
                if (tour.destinationName != null)
                  Row(
                    children: [
                      const Icon(Icons.place_outlined, size: 16, color: Colors.grey),
                      const SizedBox(width: 4),
                      Text([tour.destinationName, tour.destinationCountry].whereType<String>().join(', ')),
                      const SizedBox(width: 12),
                      const Icon(Icons.star, size: 16, color: Colors.amber),
                      Text(' ${tour.ratingAvg.toStringAsFixed(1)} (${tour.reviewCount})'),
                    ],
                  ),
                if (tour.agencyName != null) ...[
                  const SizedBox(height: 4),
                  Text('By ${tour.agencyName}', style: const TextStyle(color: Colors.grey)),
                ],
                const SizedBox(height: 12),
                Row(
                  children: [
                    Text(
                      '₹${tour.price.toStringAsFixed(0)}',
                      style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(width: 8),
                    Text(tour.duration, style: const TextStyle(color: Colors.grey)),
                  ],
                ),
                const Divider(height: 32),
                if (tour.description != null) ...[
                  Text('About this tour', style: Theme.of(context).textTheme.titleMedium),
                  const SizedBox(height: 8),
                  Text(tour.description!),
                  const SizedBox(height: 20),
                ],
                if (tour.highlights.isNotEmpty) ...[
                  Text('Highlights', style: Theme.of(context).textTheme.titleMedium),
                  const SizedBox(height: 8),
                  ...tour.highlights.map((h) => _BulletLine(text: h)),
                  const SizedBox(height: 20),
                ],
                if (tour.itinerary.isNotEmpty) ...[
                  Text('Itinerary', style: Theme.of(context).textTheme.titleMedium),
                  const SizedBox(height: 8),
                  ...tour.itinerary.map((day) => Padding(
                        padding: const EdgeInsets.only(bottom: 12),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Day ${day.day}: ${day.title}', style: const TextStyle(fontWeight: FontWeight.w600)),
                            if (day.description != null) Text(day.description!),
                          ],
                        ),
                      )),
                  const SizedBox(height: 8),
                ],
                if (tour.inclusions.isNotEmpty) ...[
                  Text('Inclusions', style: Theme.of(context).textTheme.titleMedium),
                  const SizedBox(height: 8),
                  ...tour.inclusions.map((i) => _BulletLine(text: i, icon: Icons.check, color: Colors.green)),
                  const SizedBox(height: 20),
                ],
                if (tour.exclusions.isNotEmpty) ...[
                  Text('Exclusions', style: Theme.of(context).textTheme.titleMedium),
                  const SizedBox(height: 8),
                  ...tour.exclusions.map((e) => _BulletLine(text: e, icon: Icons.close, color: Colors.red)),
                  const SizedBox(height: 20),
                ],
                if (tour.cancellationPolicy != null) ...[
                  Text('Cancellation policy', style: Theme.of(context).textTheme.titleMedium),
                  const SizedBox(height: 8),
                  Text(tour.cancellationPolicy!),
                  const SizedBox(height: 20),
                ],
                const SizedBox(height: 80),
              ],
            ),
          ),
        ),
      ],
    );
  }
}

class _BulletLine extends StatelessWidget {
  const _BulletLine({required this.text, this.icon = Icons.fiber_manual_record, this.color = Colors.grey});

  final String text;
  final IconData icon;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 14, color: color),
          const SizedBox(width: 8),
          Expanded(child: Text(text)),
        ],
      ),
    );
  }
}
