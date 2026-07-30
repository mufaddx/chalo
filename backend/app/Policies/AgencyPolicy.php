<?php

namespace App\Policies;

use App\Models\Agency;
use App\Models\User;

class AgencyPolicy
{
    public function update(User $user, Agency $agency): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $user->isAgencyOwner() && $user->id === $agency->user_id;
    }

    public function approve(User $user, Agency $agency): bool
    {
        return $user->isAdmin();
    }

    public function suspend(User $user, Agency $agency): bool
    {
        return $user->isAdmin();
    }
}
