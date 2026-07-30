<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBookingRequest;
use App\Http\Resources\BookingResource;
use App\Models\Booking;
use App\Models\Tour;
use App\Models\TourDate;
use App\Services\BookingService;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function __construct(private readonly BookingService $bookings)
    {
    }

    /**
     * GET /api/me/bookings — "My Bookings" for the logged-in customer.
     */
    public function index(Request $request)
    {
        $bookings = $request->user()->bookings()
            ->with(['tour', 'agency', 'tourDate'])
            ->when($request->query('status'), fn ($q, $status) => $q->where('status', $status))
            ->latest()
            ->paginate(10);

        return BookingResource::collection($bookings);
    }

    public function show(Booking $booking)
    {
        $this->authorize('view', $booking);

        return new BookingResource($booking->load(['tour', 'agency', 'tourDate', 'travellers']));
    }

    /**
     * POST /api/tours/{tour:slug}/bookings — the "Book Now" / booking-form submit.
     * Fires the three-way email notification (customer, agency, admin) per
     * business rule #6, inside BookingService.
     */
    public function store(StoreBookingRequest $request, Tour $tour)
    {
        abort_unless($tour->status->value === 'published', 404);

        $tourDate = TourDate::where('tour_id', $tour->id)->findOrFail($request->validated('tour_date_id'));

        $booking = $this->bookings->create($tour, $tourDate, $request->validated(), $request->user());

        return new BookingResource($booking->load(['tour', 'agency', 'tourDate']));
    }

    /**
     * PATCH /api/me/bookings/{booking}/cancel — customer-initiated cancellation request.
     * Sets status to cancelled directly for simplicity; a stricter flow could
     * instead flag `cancellation_requested` for the agency to action.
     */
    public function requestCancellation(Request $request, Booking $booking)
    {
        $this->authorize('requestCancellation', $booking);

        $data = $request->validate(['reason' => ['nullable', 'string', 'max:255']]);

        $updated = $this->bookings->updateStatus($booking, \App\Enums\BookingStatus::Cancelled, $data['reason'] ?? null);

        return new BookingResource($updated);
    }
}
