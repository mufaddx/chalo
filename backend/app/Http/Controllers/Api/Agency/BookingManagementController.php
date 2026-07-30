<?php

namespace App\Http\Controllers\Api\Agency;

use App\Enums\BookingStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\BookingResource;
use App\Models\Booking;
use App\Services\BookingService;
use Illuminate\Http\Request;

class BookingManagementController extends Controller
{
    public function __construct(private readonly BookingService $bookings)
    {
    }

    /**
     * GET /api/agency/bookings — again scoped through the authenticated
     * agency, never a client-supplied id, so one agency can't page through
     * another's customer list.
     */
    public function index(Request $request)
    {
        $bookings = $request->user()->agency->bookings()
            ->with(['tour', 'tourDate', 'user'])
            ->when($request->query('status'), fn ($q, $status) => $q->where('status', $status))
            ->latest()
            ->paginate(15);

        return BookingResource::collection($bookings);
    }

    public function updateStatus(Request $request, Booking $booking)
    {
        $this->authorize('updateStatus', $booking);

        $data = $request->validate([
            'status' => ['required', 'in:confirmed,cancelled,completed'],
            'reason' => ['nullable', 'string', 'max:255'],
            'agency_notes' => ['nullable', 'string', 'max:500'],
        ]);

        if (isset($data['agency_notes'])) {
            $booking->update(['agency_notes' => $data['agency_notes']]);
        }

        $updated = $this->bookings->updateStatus($booking, BookingStatus::from($data['status']), $data['reason'] ?? null);

        return new BookingResource($updated);
    }

    public function exportCsv(Request $request)
    {
        $bookings = $request->user()->agency->bookings()->with('tour')->get();

        $csv = "Booking ID,Tour,Customer,Phone,Travellers,Amount,Status\n";
        foreach ($bookings as $b) {
            $csv .= implode(',', [
                $b->booking_number,
                '"'.str_replace('"', '""', $b->tour->title).'"',
                '"'.str_replace('"', '""', $b->customer_name).'"',
                $b->customer_phone,
                $b->totalTravellers(),
                $b->total_amount,
                $b->status->value,
            ])."\n";
        }

        return response($csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="bookings.csv"',
        ]);
    }
}
