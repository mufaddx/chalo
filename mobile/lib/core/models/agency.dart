/// Mirrors backend/app/Http/Resources/AgencyResource.php. Not surfaced by
/// its own screen in this MVP pass (no agency-profile screen yet) but
/// modeled now since GET /agencies/{slug} already returns this shape and a
/// later phase (linking a tour's agency badge to a profile page) will need
/// it without another round of backend-contract research.
class Agency {
  Agency({
    required this.id,
    required this.slug,
    required this.name,
    required this.verified,
    required this.ratingAvg,
    required this.reviewCount,
    this.logoPath,
    this.coverPath,
    this.about,
    this.city,
    this.phone,
    this.email,
    this.website,
    this.yearsExperience,
    this.tourCount,
  });

  factory Agency.fromJson(Map<String, dynamic> json) {
    return Agency(
      id: json['id'] as int,
      slug: json['slug'] as String,
      name: json['name'] as String,
      verified: json['verified'] as bool? ?? false,
      ratingAvg: (json['rating_avg'] as num?)?.toDouble() ?? 0,
      reviewCount: json['review_count'] as int? ?? 0,
      logoPath: json['logo_path'] as String?,
      coverPath: json['cover_path'] as String?,
      about: json['about'] as String?,
      city: json['city'] as String?,
      phone: json['phone'] as String?,
      email: json['email'] as String?,
      website: json['website'] as String?,
      yearsExperience: json['years_experience'] as int?,
      tourCount: json['tour_count'] as int?,
    );
  }

  final int id;
  final String slug;
  final String name;
  final bool verified;
  final double ratingAvg;
  final int reviewCount;
  final String? logoPath;
  final String? coverPath;
  final String? about;
  final String? city;
  final String? phone;
  final String? email;
  final String? website;
  final int? yearsExperience;
  final int? tourCount;
}
