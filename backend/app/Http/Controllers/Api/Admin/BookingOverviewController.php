<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\BookingResource;
use App\Models\Booking;
use Illuminate\Http\Request;

class BookingOverviewController extends Controller
{
    public function index(Request $request)
    {
        $bookings = Booking::with(['tour', 'agency', 'tourDate'])
            ->when($request->query('status'), fn ($q, $status) => $q->where('status', $status))
            ->when($request->query('agency_id'), fn ($q, $id) => $q->where('agency_id', $id))
            ->when($request->query('q'), fn ($q, $term) => $q->where(function ($sub) use ($term) {
                $sub->where('booking_number', 'like', "%{$term}%")
                    ->orWhere('customer_name', 'like', "%{$term}%");
            }))
            ->latest()
            ->paginate(20);

        return BookingResource::collection($bookings);
    }
}
