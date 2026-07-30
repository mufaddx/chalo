/// Wraps Laravel's paginator envelope: `{data, links, meta}`. Non-paginated
/// collection endpoints (featured/trending tours) only ever send `data`, so
/// `meta`/`hasMore` stay null/false for those — callers must not assume a
/// full envelope is always present.
class Paginated<T> {
  Paginated({required this.items, this.currentPage, this.lastPage, this.total});

  factory Paginated.fromJson(Map<String, dynamic> json, T Function(Map<String, dynamic>) fromJsonT) {
    final items = (json['data'] as List).map((e) => fromJsonT(e as Map<String, dynamic>)).toList();
    final meta = json['meta'] as Map<String, dynamic>?;

    return Paginated(
      items: items,
      currentPage: meta?['current_page'] as int?,
      lastPage: meta?['last_page'] as int?,
      total: meta?['total'] as int?,
    );
  }

  final List<T> items;
  final int? currentPage;
  final int? lastPage;
  final int? total;

  bool get hasMore => currentPage != null && lastPage != null && currentPage! < lastPage!;
}
