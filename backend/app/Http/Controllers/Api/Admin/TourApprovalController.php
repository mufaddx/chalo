<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\TourDetailResource;
use App\Models\Tour;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;

class TourApprovalController extends Controller
{
    public function __construct(private readonly ActivityLogger $activityLogger)
    {
    }

    public function index(Request $request)
    {
        $tours = Tour::with(['agency', 'destination'])
            ->when($request->query('status', 'pending_approval'), fn ($q, $status) => $q->where('status', $status))
            ->latest()
            ->paginate(15);

        return TourDetailResource::collection($tours);
    }

    public function approve(Request $request, Tour $tour)
    {
        $this->authorize('approve', $tour);

        $tour->update([
            'status' => 'published',
            'approved_by' => $request->user()->id,
            'approved_at' => now(),
            'rejection_reason' => null,
        ]);

        $this->activityLogger->log('tour.approved', $tour, description: "Approved {$tour->title}");

        return new TourDetailResource($tour);
    }

    public function reject(Request $request, Tour $tour)
    {
        $this->authorize('approve', $tour);

        $data = $request->validate(['reason' => ['required', 'string', 'max:255']]);
        $tour->update(['status' => 'rejected', 'rejection_reason' => $data['reason']]);

        $this->activityLogger->log('tour.rejected', $tour, description: $data['reason']);

        return new TourDetailResource($tour);
    }

    public function toggleFeatured(Tour $tour)
    {
        $this->authorize('approve', $tour);
        $tour->update(['featured' => ! $tour->featured]);

        return new TourDetailResource($tour);
    }
}
