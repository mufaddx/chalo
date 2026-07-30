<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Agency;
use App\Models\Booking;
use App\Models\Tour;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        return response()->json([
            'agencies' => [
                'total' => Agency::count(),
                'pending' => Agency::where('status', 'pending')->count(),
                'verified' => Agency::where('status', 'verified')->count(),
            ],
            'tours' => [
                'total' => Tour::count(),
                'pending_approval' => Tour::where('status', 'pending_approval')->count(),
                'published' => Tour::where('status', 'published')->count(),
            ],
            'bookings' => [
                'total' => Booking::count(),
                'pending' => Booking::where('status', 'pending')->count(),
                'confirmed' => Booking::where('status', 'confirmed')->count(),
                'revenue_this_month' => Booking::where('status', '!=', 'cancelled')
                    ->whereMonth('created_at', now()->month)
                    ->sum('total_amount'),
            ],
            'customers' => User::where('role', 'customer')->count(),
            'recent_bookings' => Booking::with(['tour', 'agency'])->latest()->limit(10)->get(),
        ]);
    }
}
