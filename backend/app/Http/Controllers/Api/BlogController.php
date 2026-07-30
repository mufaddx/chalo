<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use Illuminate\Http\Request;

class BlogController extends Controller
{
    public function index(Request $request)
    {
        return Blog::with('author')
            ->where('status', 'published')
            ->when($request->query('category'), fn ($q, $category) => $q->where('category', $category))
            ->latest('published_at')
            ->paginate(9);
    }

    public function show(Blog $blog)
    {
        abort_unless($blog->status === 'published', 404);

        return $blog->load('author');
    }
}
