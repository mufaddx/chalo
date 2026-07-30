<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Destination;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class DestinationManagementController extends Controller
{
    public function index()
    {
        return Destination::withCount('tours')->orderBy('name')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'country' => ['required', 'string', 'max:120'],
            'image_path' => ['nullable', 'string'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'description' => ['nullable', 'string'],
            'is_active' => ['boolean'],
        ]);

        $data['slug'] = Str::slug($data['name']);

        return response()->json(Destination::create($data), 201);
    }

    public function update(Request $request, Destination $destination)
    {
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:120'],
            'country' => ['sometimes', 'string', 'max:120'],
            'image_path' => ['nullable', 'string'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'description' => ['nullable', 'string'],
            'is_active' => ['boolean'],
        ]);

        if (isset($data['name'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        $destination->update($data);

        return $destination;
    }

    public function destroy(Destination $destination)
    {
        abort_if($destination->tours()->exists(), 422, 'Cannot delete a destination with tours attached to it.');
        $destination->delete();

        return response()->json(['message' => 'Destination deleted.']);
    }
}
