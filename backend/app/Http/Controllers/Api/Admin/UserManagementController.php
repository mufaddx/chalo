<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserManagementController extends Controller
{
    public function index(Request $request)
    {
        return User::where('role', 'customer')
            ->withCount('bookings')
            ->when($request->query('q'), fn ($q, $term) => $q->where(function ($sub) use ($term) {
                $sub->where('name', 'like', "%{$term}%")->orWhere('email', 'like', "%{$term}%");
            }))
            ->latest()
            ->paginate(20);
    }

    public function toggleActive(User $user)
    {
        abort_if($user->role !== 'customer', 403, 'Only customer accounts can be managed here.');

        $user->update(['is_active' => ! $user->is_active]);

        return $user;
    }
}
