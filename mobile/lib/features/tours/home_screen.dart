import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/models/tour.dart';
import '../../shared/widgets/error_view.dart';
import '../../shared/widgets/loading_view.dart';
import '../../shared/widgets/main_bottom_nav.dart';
import 'tours_repository.dart';
import 'widgets/tour_card.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final featured = ref.watch(featuredToursProvider);
    final trending = ref.watch(trendingToursProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Voyagr')),
      body: RefreshIndicator(
        onRefresh: () async {
          ref.invalidate(featuredToursProvider);
          ref.invalidate(trendingToursProvider);
        },
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            _SearchEntry(onTap: () => context.push('/search')),
            const SizedBox(height: 20),
            _TourSection(title: 'Featured tours', asyncTours: featured),
            const SizedBox(height: 20),
            _TourSection(title: 'Trending now', asyncTours: trending),
          ],
        ),
      ),
      bottomNavigationBar: const MainBottomNav(currentIndex: 0),
    );
  }
}

class _SearchEntry extends StatelessWidget {
  const _SearchEntry({required this.onTap});

  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        decoration: BoxDecoration(
          border: Border.all(color: Colors.grey.shade300),
          borderRadius: BorderRadius.circular(12),
        ),
        child: const Row(
          children: [
            Icon(Icons.search, color: Colors.grey),
            SizedBox(width: 10),
            Text('Search tours, destinations...', style: TextStyle(color: Colors.grey)),
          ],
        ),
      ),
    );
  }
}

class _TourSection extends StatelessWidget {
  const _TourSection({required this.title, required this.asyncTours});

  final String title;
  final AsyncValue<List<Tour>> asyncTours;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(title, style: Theme.of(context).textTheme.titleLarge),
        const SizedBox(height: 12),
        asyncTours.when(
          loading: () => const SizedBox(height: 220, child: LoadingView()),
          error: (error, _) => SizedBox(height: 160, child: ErrorView(error: error)),
          data: (tours) {
            if (tours.isEmpty) {
              return const Padding(padding: EdgeInsets.all(12), child: Text('Nothing here yet.'));
            }
            return SizedBox(
              height: 240,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                itemCount: tours.length,
                separatorBuilder: (_, __) => const SizedBox(width: 12),
                itemBuilder: (context, i) => SizedBox(width: 220, child: TourCard(tour: tours[i])),
              ),
            );
          },
        ),
      ],
    );
  }
}
