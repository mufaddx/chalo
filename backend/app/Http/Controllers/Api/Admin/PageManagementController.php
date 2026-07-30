<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class PageManagementController extends Controller
{
    public function index()
    {
        return Page::latest()->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:180'],
            'slug' => ['nullable', 'string', 'max:200', 'unique:pages,slug'],
            'content' => ['required', 'string'],
            'meta_title' => ['nullable', 'string', 'max:180'],
            'meta_description' => ['nullable', 'string', 'max:255'],
            'status' => ['required', Rule::in(['draft', 'published'])],
        ]);

        $data['slug'] = $data['slug'] ?? Str::slug($data['title']);

        return response()->json(Page::create($data), 201);
    }

    public function update(Request $request, Page $page)
    {
        $data = $request->validate([
            'title' => ['sometimes', 'string', 'max:180'],
            'slug' => ['sometimes', 'string', 'max:200', Rule::unique('pages', 'slug')->ignore($page->id)],
            'content' => ['sometimes', 'string'],
            'meta_title' => ['nullable', 'string', 'max:180'],
            'meta_description' => ['nullable', 'string', 'max:255'],
            'status' => ['sometimes', Rule::in(['draft', 'published'])],
        ]);

        $page->update($data);

        return $page;
    }

    public function destroy(Page $page)
    {
        $page->delete();

        return response()->json(['message' => 'Page deleted.']);
    }
}
