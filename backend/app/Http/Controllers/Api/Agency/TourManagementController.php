<?php

namespace App\Http\Controllers\Api\Agency;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTourRequest;
use App\Http\Resources\TourDetailResource;
use App\Http\Resources\TourResource;
use App\Models\Tour;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TourManagementController extends Controller
{
    /**
     * GET /api/agency/tours — business rule #2/#8: an agency only ever sees
     * its own tours. Scoping to `$request->user()->agency` (not a client-
     * supplied agency_id) is what makes that rule actually hold.
     */
    public function index(Request $request)
    {
        $tours = $request->user()->agency->tours()
            ->with(['destination', 'categories'])
            ->when($request->query('status'), fn ($q, $status) => $q->where('status', $status))
            ->latest()
            ->paginate(10);

        return TourResource::collection($tours);
    }

    public function store(StoreTourRequest $request)
    {
        $agency = $request->user()->agency;

        $tour = $agency->tours()->create([
            ...$request->safe()->except(['category_ids', 'itinerary']),
            'slug' => Str::slug($request->validated('title')).'-'.Str::random(6),
            'currency' => 'INR',
            'status' => 'pending_approval', // business rule #10: needs admin approval
        ]);

        $tour->categories()->sync($request->validated('category_ids'));

        foreach ($request->validated('itinerary', []) as $day) {
            $tour->itineraryDays()->create($day);
        }

        return new TourDetailResource($tour->load(['destination', 'categories', 'itineraryDays']));
    }

    public function update(StoreTourRequest $request, Tour $tour)
    {
        $this->authorize('update', $tour);

        $tour->update([
            ...$request->safe()->except(['category_ids', 'itinerary']),
            // Edits to a published tour go back to pending_approval so admin
            // reviews the change — prevents a bait-and-switch after approval.
            'status' => $tour->status->value === 'published' ? 'pending_approval' : $tour->status->value,
        ]);

        $tour->categories()->sync($request->validated('category_ids'));

        return new TourDetailResource($tour->load(['destination', 'categories']));
    }

    public function destroy(Tour $tour)
    {
        $this->authorize('delete', $tour);
        $tour->delete();

        return response()->json(['message' => 'Tour deleted.']);
    }

    public function duplicate(Tour $tour)
    {
        $this->authorize('update', $tour);

        $copy = $tour->replicate(['slug', 'status', 'rating_avg', 'review_count', 'views_count']);
        $copy->slug = Str::slug($tour->title).'-copy-'.Str::random(5);
        $copy->status = 'draft';
        $copy->save();
        $copy->categories()->sync($tour->categories->pluck('id'));

        foreach ($tour->itineraryDays as $day) {
            $copy->itineraryDays()->create($day->only(['day_number', 'title', 'description', 'meals', 'stay_name']));
        }

        return new TourDetailResource($copy->load(['destination', 'categories', 'itineraryDays']));
    }

    /**
     * POST /api/agency/tours/{tour}/dates — schedule a new departure date.
     */
    public function addDate(Request $request, Tour $tour)
    {
        $this->authorize('manageAvailability', $tour);

        $data = $request->validate([
            'departure_date' => ['required', 'date', 'after:today'],
            'return_date' => ['nullable', 'date', 'after:departure_date'],
            'seats_total' => ['required', 'integer', 'min:1', 'max:500'],
            'price_override' => ['nullable', 'numeric', 'min:0'],
        ]);

        $tourDate = $tour->tourDates()->create([
            ...$data,
            'seats_available' => $data['seats_total'],
            'status' => 'open',
        ]);

        return response()->json($tourDate, 201);
    }

    public function closeDate(Tour $tour, \App\Models\TourDate $tourDate)
    {
        $this->authorize('manageAvailability', $tour);
        abort_unless($tourDate->tour_id === $tour->id, 404);

        $tourDate->update(['status' => 'closed']);

        return response()->json($tourDate);
    }
}
