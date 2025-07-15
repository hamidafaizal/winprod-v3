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
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
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

// Route untuk Force Restart
Route::post('/dashboard/force-restart', [DashboardController::class, 'forceRestart']);
