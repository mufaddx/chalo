<?php

namespace App\Services;

use App\Enums\BookingStatus;
use App\Mail\BookingReceivedAdmin;
use App\Mail\BookingReceivedAgency;
use App\Mail\BookingReceivedCustomer;
use App\Mail\BookingStatusUpdated;
use App\Models\Booking;
use App\Models\Tour;
use App\Models\TourDate;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;

class BookingService
{
    public function __construct(private readonly ActivityLogger $activityLogger)
    {
    }

    /**
     * Create a booking, decrement seat inventory, and fire the three-way
     * email notification required by the platform's business rules:
     * customer, agency, and super admin all get notified. (Business rule #6)
     */
    public function create(Tour $tour, TourDate $tourDate, array $data, ?User $user = null): Booking
    {
        return DB::transaction(function () use ($tour, $tourDate, $data, $user) {
            $lockedDate = TourDate::whereKey($tourDate->id)->lockForUpdate()->firstOrFail();

            $seatsNeeded = $data['adults'] + ($data['children'] ?? 0);
            if (! $lockedDate->hasAvailability($seatsNeeded)) {
                throw ValidationException::withMessages([
                    'tour_date_id' => 'Not enough seats available on this departure date.',
                ]);
            }

            $booking = Booking::create([
                'user_id' => $user?->id,
                'tour_id' => $tour->id,
                'tour_date_id' => $lockedDate->id,
                'agency_id' => $tour->agency_id,
                'customer_name' => $data['customer_name'],
                'customer_email' => $data['customer_email'],
                'customer_phone' => $data['customer_phone'],
                'customer_city' => $data['customer_city'] ?? null,
                'adults' => $data['adults'],
                'children' => $data['children'] ?? 0,
                'special_request' => $data['special_request'] ?? null,
                'total_amount' => ($lockedDate->price_override ?? $tour->price) * $seatsNeeded,
                'status' => BookingStatus::Pending,
            ]);

            foreach ($data['travellers'] ?? [] as $traveller) {
                $booking->travellers()->create($traveller);
            }

            $lockedDate->decrement('seats_available', $seatsNeeded);
            if ($lockedDate->seats_available <= 0) {
                $lockedDate->update(['status' => 'full']);
            }

            $this->activityLogger->log(
                action: 'booking.created',
                subject: $booking,
                userId: $user?->id,
                description: "Booking {$booking->booking_number} created for {$tour->title}",
            );

            $this->dispatchCreationEmails($booking);

            return $booking;
        });
    }

    public function updateStatus(Booking $booking, BookingStatus $status, ?string $reason = null): Booking
    {
        $booking->status = $status;
        match ($status) {
            BookingStatus::Confirmed => $booking->confirmed_at = now(),
            BookingStatus::Cancelled => [$booking->cancelled_at = now(), $booking->cancelled_reason = $reason],
            BookingStatus::Completed => $booking->completed_at = now(),
            default => null,
        };
        $booking->save();

        // Cancellations release the held seats back to inventory.
        if ($status === BookingStatus::Cancelled) {
            $booking->tourDate?->increment('seats_available', $booking->totalTravellers());
            $booking->tourDate?->update(['status' => 'open']);
        }

        $this->activityLogger->log(
            action: "booking.{$status->value}",
            subject: $booking,
            description: "Booking {$booking->booking_number} marked {$status->value}",
        );

        Mail::to($booking->customer_email)->queue(new BookingStatusUpdated($booking));

        return $booking;
    }

    private function dispatchCreationEmails(Booking $booking): void
    {
        Mail::to($booking->customer_email)->queue(new BookingReceivedCustomer($booking));
        Mail::to($booking->agency->email)->queue(new BookingReceivedAgency($booking));

        foreach (User::where('role', 'admin')->pluck('email') as $adminEmail) {
            Mail::to($adminEmail)->queue(new BookingReceivedAdmin($booking));
        }
    }
}
