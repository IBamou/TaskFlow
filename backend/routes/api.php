<?php
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\TaskController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// User Endpoint
Route::get('/user', function (Request $request) {
    return $request->user();
});

// Category Endpoints
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/create', [CategoryController::class, 'create']);
Route::get('/categories/{category}', [CategoryController::class, 'show']);
Route::get('/categories/{category}/edit', [CategoryController::class, 'edit']);
Route::get('/categories/{category}/update', [CategoryController::class, 'update']);
Route::get('/categories/{category}/delete', [CategoryController::class, 'delete']);

// Task Endpoints
Route::get('/tasks', [TaskController::class, 'index']);
Route::get('/tasks/create', [TaskController::class, 'create']);
Route::get('/tasks/{task}', [TaskController::class, 'show']);
Route::get('/tasks/{task}/edit', [TaskController::class, 'edit']);
Route::get('/tasks/{task}/update', [TaskController::class, 'update']);
Route::get('/tasks/{task}/delete', [TaskController::class, 'delete']);
