<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;

class BlogManagementController extends Controller
{
    public function index(Request $request)
    {
        return Blog::with('author')
            ->when($request->query('status'), fn ($q, $status) => $q->where('status', $status))
            ->latest()
            ->paginate(15);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:200'],
            'excerpt' => ['nullable', 'string', 'max:300'],
            'content' => ['required', 'string'],
            'cover_image' => ['nullable', 'string'],
            'category' => ['required', Rule::in(['travel_tips', 'destination_guide', 'visa_articles', 'adventure'])],
            'tags' => ['nullable', 'array'],
            'status' => ['required', Rule::in(['draft', 'published'])],
            'meta_title' => ['nullable', 'string', 'max:180'],
            'meta_description' => ['nullable', 'string', 'max:255'],
        ]);

        $data['author_id'] = $request->user()->id;
        $data['slug'] = Str::slug($data['title']).'-'.Str::random(5);
        if ($data['status'] === 'published') {
            $data['published_at'] = now();
        }

        return response()->json(Blog::create($data)->load('author'), 201);
    }

    public function update(Request $request, Blog $blog)
    {
        $data = $request->validate([
            'title' => ['sometimes', 'string', 'max:200'],
            'excerpt' => ['nullable', 'string', 'max:300'],
            'content' => ['sometimes', 'string'],
            'cover_image' => ['nullable', 'string'],
            'category' => ['sometimes', Rule::in(['travel_tips', 'destination_guide', 'visa_articles', 'adventure'])],
            'tags' => ['nullable', 'array'],
            'status' => ['sometimes', Rule::in(['draft', 'published'])],
            'meta_title' => ['nullable', 'string', 'max:180'],
            'meta_description' => ['nullable', 'string', 'max:255'],
        ]);

        if (($data['status'] ?? null) === 'published' && $blog->status !== 'published') {
            $data['published_at'] = now();
        }

        $blog->update($data);

        return $blog->load('author');
    }

    public function destroy(Blog $blog)
    {
        $blog->delete();

        return response()->json(['message' => 'Blog post deleted.']);
    }
}
