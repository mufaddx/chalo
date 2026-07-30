<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TourResource;
use App\Models\Tour;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    public function index(Request $request)
    {
        $tourIds = $request->user()->wishlists()->pluck('tour_id');

        return TourResource::collection(Tour::whereIn('id', $tourIds)->with(['destination', 'agency'])->get());
    }

    public function store(Request $request, Tour $tour)
    {
        $request->user()->wishlists()->firstOrCreate(['tour_id' => $tour->id]);

        return response()->json(['message' => 'Added to wishlist.'], 201);
    }

    public function destroy(Request $request, Tour $tour)
    {
        $request->user()->wishlists()->where('tour_id', $tour->id)->delete();

        return response()->json(['message' => 'Removed from wishlist.']);
    }
}
