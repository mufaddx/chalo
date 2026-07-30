import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/api/api_exception.dart';
import '../../core/models/tour.dart';
import '../../shared/widgets/error_view.dart';
import '../../shared/widgets/loading_view.dart';
import '../../shared/widgets/main_bottom_nav.dart';
import 'tours_repository.dart';
import 'widgets/tour_card.dart';

class SearchScreen extends ConsumerStatefulWidget {
  const SearchScreen({super.key});

  @override
  ConsumerState<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends ConsumerState<SearchScreen> {
  final _queryController = TextEditingController();
  TourSearchParams _params = const TourSearchParams(sort: 'popular');
  List<Tour> _tours = [];
  bool _loading = true;
  bool _loadingMore = false;
  bool _hasMore = false;
  Object? _error;

  @override
  void initState() {
    super.initState();
    _runSearch();
  }

  @override
  void dispose() {
    _queryController.dispose();
    super.dispose();
  }

  Future<void> _runSearch({bool resetPage = true}) async {
    setState(() {
      _loading = true;
      _error = null;
      if (resetPage) _params = _params.copyWith(page: 1);
    });

    try {
      final result = await ref.read(toursRepositoryProvider).search(_params);
      setState(() {
        _tours = result.items;
        _hasMore = result.hasMore;
      });
    } catch (e) {
      setState(() => _error = e);
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _loadMore() async {
    setState(() => _loadingMore = true);
    try {
      final next = _params.copyWith(page: _params.page + 1);
      final result = await ref.read(toursRepositoryProvider).search(next);
      setState(() {
        _params = next;
        _tours = [..._tours, ...result.items];
        _hasMore = result.hasMore;
      });
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e is ApiException ? e.message : 'Could not load more results.')),
        );
      }
    } finally {
      if (mounted) setState(() => _loadingMore = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: TextField(
          controller: _queryController,
          decoration: const InputDecoration(hintText: 'Search tours...', border: InputBorder.none),
          onSubmitted: (v) {
            _params = _params.copyWith(query: v);
            _runSearch();
          },
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {
              _params = _params.copyWith(query: _queryController.text);
              _runSearch();
            },
          ),
        ],
      ),
      body: Column(
        children: [
          _buildFilterBar(),
          const Divider(height: 1),
          Expanded(child: _buildResults()),
        ],
      ),
      bottomNavigationBar: const MainBottomNav(currentIndex: 1),
    );
  }

  Widget _buildFilterBar() {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      child: Row(
        children: [
          DropdownButton<String>(
            value: _params.sort,
            items: const [
              DropdownMenuItem(value: 'popular', child: Text('Popular')),
              DropdownMenuItem(value: 'price-low', child: Text('Price: low to high')),
              DropdownMenuItem(value: 'price-high', child: Text('Price: high to low')),
              DropdownMenuItem(value: 'rating', child: Text('Top rated')),
              DropdownMenuItem(value: 'newest', child: Text('Newest')),
            ],
            onChanged: (v) {
              _params = _params.copyWith(sort: v);
              _runSearch();
            },
          ),
          const SizedBox(width: 12),
          FilterChip(
            label: const Text('Free cancellation'),
            selected: _params.freeCancellation,
            onSelected: (v) {
              _params = _params.copyWith(freeCancellation: v);
              _runSearch();
            },
          ),
          const SizedBox(width: 8),
          FilterChip(
            label: const Text('Instant confirmation'),
            selected: _params.instantConfirmation,
            onSelected: (v) {
              _params = _params.copyWith(instantConfirmation: v);
              _runSearch();
            },
          ),
        ],
      ),
    );
  }

  Widget _buildResults() {
    if (_loading) return const LoadingView();
    if (_error != null) return ErrorView(error: _error!, onRetry: _runSearch);
    if (_tours.isEmpty) return const Center(child: Text('No tours match your search.'));

    return ListView.builder(
      padding: const EdgeInsets.all(12),
      itemCount: _tours.length + (_hasMore ? 1 : 0),
      itemBuilder: (context, i) {
        if (i >= _tours.length) {
          return Padding(
            padding: const EdgeInsets.all(16),
            child: Center(
              child: _loadingMore
                  ? const CircularProgressIndicator()
                  : OutlinedButton(onPressed: _loadMore, child: const Text('Load more')),
            ),
          );
        }
        return Padding(padding: const EdgeInsets.only(bottom: 12), child: TourCard(tour: _tours[i]));
      },
    );
  }
}
