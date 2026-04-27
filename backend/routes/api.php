<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\TaskController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    // User Endpoint
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Auth Endpoints
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Category Endpoints
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::post('/categories/store', [CategoryController::class, 'store']);
    Route::get('/categories/{category}', [CategoryController::class, 'show']);
    Route::put('/categories/{category}/update', [CategoryController::class, 'update']);
    Route::delete('/categories/{category}/delete', [CategoryController::class, 'destroy']);

    // Task Endpoints
    Route::get('/tasks', [TaskController::class, 'index']);
    Route::post('/tasks/store', [TaskController::class, 'store']);
    Route::get('/tasks/{task}', [TaskController::class, 'show']);
    Route::put('/tasks/{task}/update', [TaskController::class, 'update']);
    Route::delete('/tasks/{task}/delete', [TaskController::class, 'destroy']);

});
