/// Mirrors backend/app/Http/Resources/BookingResource.php. `tour`/`agency`/
/// `travel_date` are only present when those relations were eager-loaded —
/// true for every current endpoint, but kept nullable defensively.
class Booking {
  Booking({
    required this.id,
    required this.bookingNumber,
    required this.status,
    required this.paymentStatus,
    required this.customerName,
    required this.customerEmail,
    required this.customerPhone,
    required this.adults,
    required this.children,
    required this.totalAmount,
    required this.createdAt,
    this.tourTitle,
    this.tourSlug,
    this.agencyName,
    this.agencySlug,
    this.travelDate,
    this.customerCity,
    this.specialRequest,
    this.agencyNotes,
    this.cancelledReason,
  });

  factory Booking.fromJson(Map<String, dynamic> json) {
    final tour = json['tour'] as Map<String, dynamic>?;
    final agency = json['agency'] as Map<String, dynamic>?;

    return Booking(
      id: json['id'] as int,
      bookingNumber: json['booking_number'] as String,
      status: json['status'] as String,
      paymentStatus: json['payment_status'] as String,
      customerName: json['customer_name'] as String,
      customerEmail: json['customer_email'] as String,
      customerPhone: json['customer_phone'] as String,
      adults: json['adults'] as int,
      children: json['children'] as int? ?? 0,
      totalAmount: (json['total_amount'] as num).toDouble(),
      createdAt: DateTime.parse(json['created_at'] as String),
      tourTitle: tour?['title'] as String?,
      tourSlug: tour?['slug'] as String?,
      agencyName: agency?['name'] as String?,
      agencySlug: agency?['slug'] as String?,
      travelDate: json['travel_date'] as String?,
      customerCity: json['customer_city'] as String?,
      specialRequest: json['special_request'] as String?,
      agencyNotes: json['agency_notes'] as String?,
      cancelledReason: json['cancelled_reason'] as String?,
    );
  }

  final int id;
  final String bookingNumber;
  final String status; // pending | confirmed | cancelled | completed
  final String paymentStatus; // unpaid | partial | paid | refunded
  final String customerName;
  final String customerEmail;
  final String customerPhone;
  final int adults;
  final int children;
  final double totalAmount;
  final DateTime createdAt;
  final String? tourTitle;
  final String? tourSlug;
  final String? agencyName;
  final String? agencySlug;
  final String? travelDate;
  final String? customerCity;
  final String? specialRequest;
  final String? agencyNotes;
  final String? cancelledReason;

  bool get isCancellable => status == 'pending' || status == 'confirmed';
  bool get needsPayment => paymentStatus == 'unpaid' && isCancellable;
}
