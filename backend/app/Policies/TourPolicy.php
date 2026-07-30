<?php

namespace App\Policies;

use App\Models\Tour;
use App\Models\User;

class TourPolicy
{
    /**
     * Business rule #8: agencies cannot see or modify other agencies' data.
     */
    public function update(User $user, Tour $tour): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $user->isAgencyOwner() && $user->agency?->id === $tour->agency_id;
    }

    public function delete(User $user, Tour $tour): bool
    {
        return $this->update($user, $tour);
    }

    public function manageAvailability(User $user, Tour $tour): bool
    {
        return $this->update($user, $tour);
    }

    public function approve(User $user, Tour $tour): bool
    {
        return $user->isAdmin();
    }
}
