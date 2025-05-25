<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/users', [AuthController::class, 'getUser']);
    Route::delete('/users/{id}', [AuthController::class, 'deleteUser']);
    Route::put('/users/{id}', [AuthController::class, 'updateUser']);

    // Routes cho quản lý sản phẩm trong AuthController
    Route::post('/products', [AuthController::class, 'storeProduct']);
    Route::put('/products/{id}', [AuthController::class, 'updateProduct']);
    Route::delete('/products/{id}', [AuthController::class, 'deleteProduct']);
    Route::get('/products', [AuthController::class, 'index']); // Để lấy danh sách sản phẩm
});