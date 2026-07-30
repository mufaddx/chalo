import 'review.dart';
import 'tour.dart';

class GalleryItem {
  GalleryItem({required this.path, required this.type});

  factory GalleryItem.fromJson(Map<String, dynamic> json) {
    return GalleryItem(path: json['path'] as String, type: json['type'] as String);
  }

  final String path;
  final String type; // "image" | "video"
}

class ItineraryDay {
  ItineraryDay({required this.day, required this.title, this.description, this.meals, this.stay});

  factory ItineraryDay.fromJson(Map<String, dynamic> json) {
    return ItineraryDay(
      day: json['day'] as int,
      title: json['title'] as String,
      description: json['description'] as String?,
      meals: (json['meals'] as List?)?.map((e) => e.toString()).toList(),
      stay: json['stay'] as String?,
    );
  }

  final int day;
  final String title;
  final String? description;
  final List<String>? meals;
  final String? stay;
}

/// A bookable departure date for a tour — `id` is what gets sent back as
/// `tour_date_id` when creating a booking.
class TourDateOption {
  TourDateOption({required this.id, required this.departureDate, required this.seatsAvailable, required this.status});

  factory TourDateOption.fromJson(Map<String, dynamic> json) {
    return TourDateOption(
      id: json['id'] as int,
      departureDate: json['departure_date'] as String,
      seatsAvailable: json['seats_available'] as int,
      status: json['status'] as String,
    );
  }

  final int id;
  final String departureDate;
  final int seatsAvailable;
  final String status;

  bool get isBookable => status == 'open' && seatsAvailable > 0;
}

/// Mirrors backend/app/Http/Resources/TourDetailResource.php — everything
/// TourResource has, plus the full detail-page fields.
class TourDetail extends Tour {
  TourDetail({
    required super.id,
    required super.slug,
    required super.title,
    required super.price,
    required super.originalPrice,
    required super.discountPercent,
    required super.duration,
    required super.hotelRating,
    required super.transport,
    required super.mealsIncluded,
    required super.freeCancellation,
    required super.instantConfirmation,
    required super.ratingAvg,
    required super.reviewCount,
    required super.featured,
    required super.trending,
    required this.highlights,
    required this.inclusions,
    required this.exclusions,
    required this.thingsToCarry,
    required this.gallery,
    required this.itinerary,
    required this.tourDates,
    required this.reviews,
    super.destinationName,
    super.destinationCountry,
    super.agencyName,
    super.agencySlug,
    super.agencyVerified,
    super.categories,
    super.coverImage,
    super.nextDepartures,
    this.description,
    this.cancellationPolicy,
  });

  factory TourDetail.fromJson(Map<String, dynamic> json) {
    final base = Tour.fromJson(json);

    return TourDetail(
      id: base.id,
      slug: base.slug,
      title: base.title,
      price: base.price,
      originalPrice: base.originalPrice,
      discountPercent: base.discountPercent,
      duration: base.duration,
      hotelRating: base.hotelRating,
      transport: base.transport,
      mealsIncluded: base.mealsIncluded,
      freeCancellation: base.freeCancellation,
      instantConfirmation: base.instantConfirmation,
      ratingAvg: base.ratingAvg,
      reviewCount: base.reviewCount,
      featured: base.featured,
      trending: base.trending,
      destinationName: base.destinationName,
      destinationCountry: base.destinationCountry,
      agencyName: base.agencyName,
      agencySlug: base.agencySlug,
      agencyVerified: base.agencyVerified,
      categories: base.categories,
      coverImage: base.coverImage,
      nextDepartures: base.nextDepartures,
      description: json['description'] as String?,
      cancellationPolicy: json['cancellation_policy'] as String?,
      highlights: (json['highlights'] as List?)?.map((e) => e.toString()).toList() ?? const [],
      inclusions: (json['inclusions'] as List?)?.map((e) => e.toString()).toList() ?? const [],
      exclusions: (json['exclusions'] as List?)?.map((e) => e.toString()).toList() ?? const [],
      thingsToCarry: (json['things_to_carry'] as List?)?.map((e) => e.toString()).toList() ?? const [],
      gallery: (json['gallery'] as List? ?? const [])
          .map((e) => GalleryItem.fromJson(e as Map<String, dynamic>))
          .toList(),
      itinerary: (json['itinerary'] as List? ?? const [])
          .map((e) => ItineraryDay.fromJson(e as Map<String, dynamic>))
          .toList(),
      tourDates: (json['tour_dates'] as List? ?? const [])
          .map((e) => TourDateOption.fromJson(e as Map<String, dynamic>))
          .toList(),
      reviews: (json['reviews'] as List? ?? const []).map((e) => Review.fromJson(e as Map<String, dynamic>)).toList(),
    );
  }

  final String? description;
  final String? cancellationPolicy;
  final List<String> highlights;
  final List<String> inclusions;
  final List<String> exclusions;
  final List<String> thingsToCarry;
  final List<GalleryItem> gallery;
  final List<ItineraryDay> itinerary;
  final List<TourDateOption> tourDates;
  final List<Review> reviews;
}
