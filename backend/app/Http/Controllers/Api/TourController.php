<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TourDetailResource;
use App\Http\Resources\TourResource;
use App\Models\Tour;
use Illuminate\Http\Request;

class TourController extends Controller
{
    /**
     * GET /api/tours — search + filter + sort, matching the public search page.
     */
    public function index(Request $request)
    {
        $query = Tour::query()
            ->published()
            ->with(['destination', 'agency', 'categories', 'images' => fn ($q) => $q->limit(1)])
            ->search($request->query('q'));

        if ($category = $request->query('category')) {
            $query->inCategory($category);
        }

        if ($destinationSlug = $request->query('destination')) {
            $query->whereHas('destination', fn ($d) => $d->where('slug', $destinationSlug));
        }

        if ($agencySlug = $request->query('agency')) {
            $query->whereHas('agency', fn ($a) => $a->where('slug', $agencySlug));
        }

        if ($maxBudget = $request->query('max_price')) {
            $query->where('price', '<=', $maxBudget);
        }

        if ($transport = $request->query('transport')) {
            $query->whereJsonContains('transport', $transport);
        }

        if ($minHotelRating = $request->query('hotel_rating')) {
            $query->where('hotel_rating', '>=', $minHotelRating);
        }

        foreach (['free_cancellation', 'instant_confirmation', 'meals_included'] as $flag) {
            if ($request->boolean($flag)) {
                $query->where($flag, true);
            }
        }

        if ($request->boolean('verified_only')) {
            $query->whereHas('agency', fn ($a) => $a->verified());
        }

        $query = match ($request->query('sort', 'popular')) {
            'price-low' => $query->orderBy('price'),
            'price-high' => $query->orderByDesc('price'),
            'rating' => $query->orderByDesc('rating_avg'),
            'newest' => $query->orderByDesc('created_at'),
            default => $query->orderByDesc('review_count'),
        };

        return TourResource::collection($query->paginate($request->integer('per_page', 12)));
    }

    public function featured()
    {
        return TourResource::collection(
            Tour::published()->featured()->with(['destination', 'agency', 'images'])->limit(8)->get()
        );
    }

    public function trending()
    {
        return TourResource::collection(
            Tour::published()->trending()->with(['destination', 'agency', 'images'])->limit(8)->get()
        );
    }

    /**
     * GET /api/tours/{tour:slug} — full detail page payload.
     */
    public function show(Tour $tour)
    {
        abort_unless($tour->status->value === 'published', 404);

        $tour->increment('views_count');
        $tour->load(['destination', 'agency', 'categories', 'images', 'itineraryDays', 'tourDates', 'reviews.user']);

        return new TourDetailResource($tour);
    }
}
