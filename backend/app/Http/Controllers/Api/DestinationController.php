<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Destination;

class DestinationController extends Controller
{
    public function index()
    {
        return Destination::where('is_active', true)
            ->withCount(['tours' => fn ($q) => $q->published()])
            ->orderByDesc('tours_count')
            ->get();
    }
}
