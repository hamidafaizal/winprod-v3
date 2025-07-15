<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\KontakController;
use App\Http\Controllers\RisetController;
use App\Http\Controllers\DistribusiController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AuthController; // Import AuthController

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Route publik untuk login dan register
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Route yang dilindungi oleh otentikasi (memerlukan login)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Pindahkan semua route lama ke dalam grup ini
    Route::apiResource('kontak', KontakController::class);

    Route::post('/riset/upload', [RisetController::class, 'processUpload']);

    Route::prefix('distribusi')->group(function () {
        Route::get('/state', [DistribusiController::class, 'getState']);
        Route::post('/setup-batches', [DistribusiController::class, 'setupBatches']);
        Route::post('/distribute', [DistribusiController::class, 'distributeLinks']);
        Route::put('/batch/{batch}', [DistribusiController::class, 'updateBatch']);
        Route::get('/batch/{batch}/links', [DistribusiController::class, 'getLinksForBatch']);
        Route::post('/log-sent', [DistribusiController::class, 'logSentLinks']);
    });

    Route::post('/dashboard/force-restart', [DashboardController::class, 'forceRestart']);
    Route::get('/dashboard/history', [DashboardController::class, 'getHistory']);
});
