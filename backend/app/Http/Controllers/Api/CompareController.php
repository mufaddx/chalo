<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TourResource;
use App\Models\Tour;
use Illuminate\Http\Request;

class CompareController extends Controller
{
    private const MAX_COMPARE = 4;

    public function index(Request $request)
    {
        $tourIds = $request->user()->compareTours()->pluck('tour_id');

        return TourResource::collection(
            Tour::whereIn('id', $tourIds)->with(['destination', 'agency'])->get()
        );
    }

    public function store(Request $request, Tour $tour)
    {
        $count = $request->user()->compareTours()->count();
        abort_if($count >= self::MAX_COMPARE, 422, 'You can compare up to '.self::MAX_COMPARE.' tours at a time.');

        $request->user()->compareTours()->firstOrCreate(['tour_id' => $tour->id]);

        return response()->json(['message' => 'Added to comparison.'], 201);
    }

    public function destroy(Request $request, Tour $tour)
    {
        $request->user()->compareTours()->where('tour_id', $tour->id)->delete();

        return response()->json(['message' => 'Removed from comparison.']);
    }
}
