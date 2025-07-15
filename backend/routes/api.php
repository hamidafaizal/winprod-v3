<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\KontakController;
use App\Http\Controllers\RisetController;
use App\Http\Controllers\DistribusiController;
use App\Http\Controllers\DashboardController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Route untuk Manajemen Kontak
Route::apiResource('kontak', KontakController::class);

// Route untuk Proses Riset
Route::post('/riset/upload', [RisetController::class, 'processUpload']);

// Routes untuk Distribusi Link
Route::prefix('distribusi')->group(function () {
    Route::get('/state', [DistribusiController::class, 'getState']);
    Route::post('/setup-batches', [DistribusiController::class, 'setupBatches']);
    Route::post('/distribute', [DistribusiController::class, 'distributeLinks']);
    Route::put('/batch/{batch}', [DistribusiController::class, 'updateBatch']);
    Route::get('/batch/{batch}/links', [DistribusiController::class, 'getLinksForBatch']);
    Route::post('/log-sent', [DistribusiController::class, 'logSentLinks']);
});

// Routes untuk Dashboard
Route::post('/dashboard/force-restart', [DashboardController::class, 'forceRestart']);
Route::get('/dashboard/history', [DashboardController::class, 'getHistory']); // Route baru
