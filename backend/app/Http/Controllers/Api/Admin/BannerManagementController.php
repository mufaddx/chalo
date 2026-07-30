<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class BannerManagementController extends Controller
{
    public function index()
    {
        return Banner::orderBy('sort_order')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => ['nullable', 'string', 'max:180'],
            'image_path' => ['required', 'string'],
            'link_url' => ['nullable', 'string', 'max:255'],
            'position' => ['required', Rule::in(['homepage_hero', 'homepage_secondary', 'category_page'])],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['boolean'],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
        ]);

        return response()->json(Banner::create($data), 201);
    }

    public function update(Request $request, Banner $banner)
    {
        $data = $request->validate([
            'title' => ['nullable', 'string', 'max:180'],
            'image_path' => ['sometimes', 'string'],
            'link_url' => ['nullable', 'string', 'max:255'],
            'position' => ['sometimes', Rule::in(['homepage_hero', 'homepage_secondary', 'category_page'])],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['boolean'],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
        ]);

        $banner->update($data);

        return $banner;
    }

    public function destroy(Banner $banner)
    {
        $banner->delete();

        return response()->json(['message' => 'Banner deleted.']);
    }
}
