import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/api/api_client.dart';
import '../../core/models/paginated.dart';
import '../../core/models/tour.dart';
import '../../core/models/tour_detail.dart';

final toursRepositoryProvider = Provider<ToursRepository>((ref) {
  return ToursRepository(ref.watch(apiClientProvider));
});

class TourSearchParams {
  const TourSearchParams({
    this.query,
    this.sort,
    this.freeCancellation = false,
    this.instantConfirmation = false,
    this.page = 1,
  });

  final String? query;
  final String? sort; // popular | price-low | price-high | rating | newest
  final bool freeCancellation;
  final bool instantConfirmation;
  final int page;

  Map<String, dynamic> toQuery() {
    return {
      if (query != null && query!.isNotEmpty) 'q': query,
      if (sort != null) 'sort': sort,
      if (freeCancellation) 'free_cancellation': true,
      if (instantConfirmation) 'instant_confirmation': true,
      'page': page,
    };
  }

  TourSearchParams copyWith({String? query, String? sort, bool? freeCancellation, bool? instantConfirmation, int? page}) {
    return TourSearchParams(
      query: query ?? this.query,
      sort: sort ?? this.sort,
      freeCancellation: freeCancellation ?? this.freeCancellation,
      instantConfirmation: instantConfirmation ?? this.instantConfirmation,
      page: page ?? this.page,
    );
  }
}

/// Mirrors frontend/lib/api/tours.ts — all guest-accessible (skipAuth).
class ToursRepository {
  ToursRepository(this._client);

  final ApiClient _client;

  Future<Paginated<Tour>> search(TourSearchParams params) async {
    final json = await _client.get('/tours', query: params.toQuery(), skipAuth: true) as Map<String, dynamic>;
    return Paginated.fromJson(json, Tour.fromJson);
  }

  Future<List<Tour>> featured() async {
    final json = await _client.get('/tours/featured', skipAuth: true) as Map<String, dynamic>;
    return (json['data'] as List).map((e) => Tour.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<List<Tour>> trending() async {
    final json = await _client.get('/tours/trending', skipAuth: true) as Map<String, dynamic>;
    return (json['data'] as List).map((e) => Tour.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<TourDetail> detail(String slug) async {
    final json = await _client.get('/tours/$slug', skipAuth: true) as Map<String, dynamic>;
    return TourDetail.fromJson(json['data'] as Map<String, dynamic>);
  }
}

final featuredToursProvider = FutureProvider<List<Tour>>((ref) {
  return ref.watch(toursRepositoryProvider).featured();
});

final trendingToursProvider = FutureProvider<List<Tour>>((ref) {
  return ref.watch(toursRepositoryProvider).trending();
});

final tourDetailProvider = FutureProvider.family<TourDetail, String>((ref, slug) {
  return ref.watch(toursRepositoryProvider).detail(slug);
});
