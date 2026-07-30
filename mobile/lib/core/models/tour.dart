/// Mirrors backend/app/Http/Resources/TourResource.php. Several fields
/// (destination, agency, categories, coverImage, nextDepartures) are only
/// present when the controller eager-loaded that relation — different
/// endpoints (index/featured/trending/wishlist) load different subsets, so
/// every one of these is nullable here, never assumed present.
class Tour {
  Tour({
    required this.id,
    required this.slug,
    required this.title,
    required this.price,
    required this.originalPrice,
    required this.discountPercent,
    required this.duration,
    required this.hotelRating,
    required this.transport,
    required this.mealsIncluded,
    required this.freeCancellation,
    required this.instantConfirmation,
    required this.ratingAvg,
    required this.reviewCount,
    required this.featured,
    required this.trending,
    this.destinationName,
    this.destinationCountry,
    this.agencyName,
    this.agencySlug,
    this.agencyVerified,
    this.categories,
    this.coverImage,
    this.nextDepartures,
  });

  factory Tour.fromJson(Map<String, dynamic> json) {
    final destination = json['destination'] as Map<String, dynamic>?;
    final agency = json['agency'] as Map<String, dynamic>?;

    return Tour(
      id: json['id'] as int,
      slug: json['slug'] as String,
      title: json['title'] as String,
      price: (json['price'] as num).toDouble(),
      originalPrice: (json['original_price'] as num).toDouble(),
      discountPercent: json['discount_percent'] as int? ?? 0,
      duration: json['duration'] as String? ?? '',
      hotelRating: (json['hotel_rating'] as num?)?.toDouble() ?? 0,
      transport: (json['transport'] as List?)?.map((e) => e.toString()).toList() ?? const [],
      mealsIncluded: json['meals_included'] as bool? ?? false,
      freeCancellation: json['free_cancellation'] as bool? ?? false,
      instantConfirmation: json['instant_confirmation'] as bool? ?? false,
      ratingAvg: (json['rating_avg'] as num?)?.toDouble() ?? 0,
      reviewCount: json['review_count'] as int? ?? 0,
      featured: json['featured'] as bool? ?? false,
      trending: json['trending'] as bool? ?? false,
      destinationName: destination?['name'] as String?,
      destinationCountry: destination?['country'] as String?,
      agencyName: agency?['name'] as String?,
      agencySlug: agency?['slug'] as String?,
      agencyVerified: agency?['verified'] as bool?,
      categories: (json['categories'] as List?)?.map((e) => e.toString()).toList(),
      coverImage: json['cover_image'] as String?,
      nextDepartures: (json['next_departures'] as List?)?.map((e) => e.toString()).toList(),
    );
  }

  final int id;
  final String slug;
  final String title;
  final double price;
  final double originalPrice;
  final int discountPercent;
  final String duration;
  final double hotelRating;
  final List<String> transport;
  final bool mealsIncluded;
  final bool freeCancellation;
  final bool instantConfirmation;
  final double ratingAvg;
  final int reviewCount;
  final bool featured;
  final bool trending;
  final String? destinationName;
  final String? destinationCountry;
  final String? agencyName;
  final String? agencySlug;
  final bool? agencyVerified;
  final List<String>? categories;
  final String? coverImage;
  final List<String>? nextDepartures;
}
