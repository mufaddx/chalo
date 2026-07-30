/// Mirrors backend/app/Http/Resources/ReviewResource.php.
class Review {
  Review({
    required this.id,
    required this.rating,
    required this.createdAt,
    this.author,
    this.reviewText,
    this.images,
    this.agencyReply,
  });

  factory Review.fromJson(Map<String, dynamic> json) {
    return Review(
      id: json['id'] as int,
      rating: json['rating'] as int,
      createdAt: DateTime.parse(json['created_at'] as String),
      author: json['author'] as String?,
      reviewText: json['review_text'] as String?,
      images: (json['images'] as List?)?.map((e) => e.toString()).toList(),
      agencyReply: json['agency_reply'] as String?,
    );
  }

  final int id;
  final int rating;
  final DateTime createdAt;
  final String? author;
  final String? reviewText;
  final List<String>? images;
  final String? agencyReply;
}
