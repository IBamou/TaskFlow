<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class TaskController extends Controller
{
    // GET /api/tasks - Get all tasks for current user
    public function index(Request $request)
    {
        Gate::authorize('view', Task::class);
        $query = Task::where('user_id', Auth::id())
            ->with('category');

        // Filter by category
        if ($request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        // Filter by status
        if ($request->status) {
            $query->where('status', $request->status);
        }

        // Filter by "My Day" (today's tasks)
        if ($request->my_day) {
            $query->whereDate('due_date', today());
        }

        $tasks = $query->orderBy('created_at', 'desc')->get();

        return response()->json($tasks);
    }

    // POST /api/tasks - Create new task
    public function store(Request $request)
    {
        Gate::authorize('create', Task::class);
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
            'priority' => 'in:low,medium,high',
            'due_date' => 'nullable|date',
        ]);

        $task = Task::create([
            ...$validated,
            'user_id' => Auth::id(),
            'status' => 'pending',
            'priority' => $request->priority ?? 'medium',
        ]);

        return response()->json($task->load('category'), 201);
    }

    // GET /api/tasks/{id} - Get single task
    public function show(Task $task)
    {
        Gate::authorize('view', $task);

        return response()->json($task->load('category'));
    }

    // PUT /api/tasks/{id} - Update task
    public function getByCategory(Request $request)
    {
        Gate::authorize('view', Task::class);

        $tasks = Task::where('category_id', $request->category_id)->where('user_id', Auth::id())->get();

        return response()->json($tasks);
    }

    // PUT /api/tasks/{id} - Update task
    public function update(Request $request, Task $task)
    {
        Gate::authorize('update', $task);

        $validated = $request->validate([
            'title' => 'string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'exists:categories,id',
            'status' => 'in:pending,in_progress,completed',
            'priority' => 'in:low,medium,high',
            'due_date' => 'nullable|date',
        ]);

        $task->update($validated);

        return response()->json($task->load('category'));
    }

    // DELETE /api/tasks/{id} - Delete task
    public function destroy(Task $task)
    {
        Gate::authorize('delete', $task);

        $task->delete();

        return response()->json(['message' => 'Task deleted successfully']);
    }
}
