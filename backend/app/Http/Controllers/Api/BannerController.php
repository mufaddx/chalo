<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class BannerController extends Controller
{
    public function index(Request $request)
    {
        $now = Carbon::now();

        return Banner::where('is_active', true)
            ->when($request->query('position'), fn ($q, $position) => $q->where('position', $position))
            ->where(fn ($q) => $q->whereNull('starts_at')->orWhere('starts_at', '<=', $now))
            ->where(fn ($q) => $q->whereNull('ends_at')->orWhere('ends_at', '>=', $now))
            ->orderBy('sort_order')
            ->get();
    }
}
