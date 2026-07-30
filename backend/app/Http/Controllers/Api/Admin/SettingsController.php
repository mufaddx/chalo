<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function index(Request $request)
    {
        $query = Setting::query();
        if ($group = $request->query('group')) {
            $query->where('group', $group);
        }

        return $query->get()->groupBy('group');
    }

    /**
     * PUT /api/admin/settings — bulk upsert. Body: { settings: [{key, value, group}] }
     * so the frontend's tabbed settings form can save everything on one tab
     * in a single request instead of one call per field.
     */
    public function update(Request $request)
    {
        $data = $request->validate([
            'settings' => ['required', 'array', 'min:1'],
            'settings.*.key' => ['required', 'string', 'max:100'],
            'settings.*.value' => ['nullable', 'string'],
            'settings.*.group' => ['nullable', 'string', 'max:60'],
        ]);

        foreach ($data['settings'] as $item) {
            Setting::set($item['key'], $item['value'] ?? null, $item['group'] ?? 'general');
        }

        return response()->json(['message' => 'Settings saved.']);
    }
}
