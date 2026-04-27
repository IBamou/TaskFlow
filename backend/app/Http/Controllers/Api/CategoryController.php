<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Check if this is a test route (no auth required)
        if (request()->is('api/test/*')) {
            $categories = Category::all();
        } else {
            Gate::authorize('view', Category::class);
            $categories = Category::where('user_id', Auth::id())->get();
        }
        return response()->json($categories);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validation = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string'
        ]);

        // Check if this is a test route (no auth required)
        if (request()->is('api/test/*')) {
            $category = Category::create([
                'name' => $request->name,
                'description' => $request->description,
                'user_id' => 1 // Use default user for testing
            ]);
        } else {
            $category = Category::create([
                'name' => $request->name,
                'description' => $request->description,
                'user_id' => Auth::id()
            ]);
        }
        return response()->json($category, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        Gate::authorize('view', $category);
        return response()->json($category);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category)
    {
        Gate::authorize('update', $category);
        $validation = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string'
        ]);
        $category->update($validation);
        return response()->json($category);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        Gate::authorize('delete', $category);
        $category->delete();
        return response()->json(null, 204);
    }
}
