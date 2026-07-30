<?php

namespace App\Policies;

use App\Models\Booking;
use App\Models\User;

class BookingPolicy
{
    public function view(User $user, Booking $booking): bool
    {
        if ($user->isAdmin()) {
            return true;
        }
        if ($user->isAgencyOwner()) {
            return $user->agency?->id === $booking->agency_id;
        }

        return $user->id === $booking->user_id;
    }

    /**
     * Only the owning agency (or an admin) can change a booking's status —
     * customers request cancellation but don't set status directly.
     */
    public function updateStatus(User $user, Booking $booking): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $user->isAgencyOwner() && $user->agency?->id === $booking->agency_id;
    }

    public function requestCancellation(User $user, Booking $booking): bool
    {
        return $user->id === $booking->user_id;
    }
}
