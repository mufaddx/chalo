<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ReviewResource;
use App\Models\Booking;
use App\Models\Tour;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function indexForTour(Tour $tour)
    {
        return ReviewResource::collection(
            $tour->reviews()->with('user')->latest()->paginate(10)
        );
    }

    /**
     * POST /api/bookings/{booking}/review — business rule #7: customers can
     * only review tours after the booking is marked completed.
     */
    public function store(Request $request, Booking $booking)
    {
        abort_unless($request->user()->id === $booking->user_id, 403);
        abort_unless($booking->isReviewEligible(), 422, 'You can only review a tour after it is marked completed.');

        $data = $request->validate([
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'review_text' => ['nullable', 'string', 'max:2000'],
            'images' => ['nullable', 'array', 'max:6'],
            'images.*' => ['string'],
        ]);

        $review = $booking->review()->create([
            'tour_id' => $booking->tour_id,
            'user_id' => $booking->user_id,
            'agency_id' => $booking->agency_id,
            ...$data,
        ]);

        $this->recalculateTourRating($booking->tour_id);

        return new ReviewResource($review->load('user'));
    }

    /**
     * POST /api/agency/reviews/{review}/reply — agency responds to feedback.
     */
    public function reply(Request $request, \App\Models\Review $review)
    {
        abort_unless($request->user()->agency?->id === $review->agency_id, 403);

        $data = $request->validate(['reply' => ['required', 'string', 'max:1000']]);

        $review->update(['agency_reply' => $data['reply'], 'agency_replied_at' => now()]);

        return new ReviewResource($review);
    }

    private function recalculateTourRating(int $tourId): void
    {
        $stats = \App\Models\Review::where('tour_id', $tourId)
            ->where('status', 'published')
            ->selectRaw('AVG(rating) as avg_rating, COUNT(*) as total')
            ->first();

        Tour::whereKey($tourId)->update([
            'rating_avg' => round($stats->avg_rating ?? 0, 1),
            'review_count' => $stats->total ?? 0,
        ]);
    }
}
