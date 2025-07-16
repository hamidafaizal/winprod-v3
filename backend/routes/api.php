<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\KontakController;
use App\Http\Controllers\RisetController;
use App\Http\Controllers\DistribusiController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PwaDeviceController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Rute publik untuk login, register, dan pairing PWA
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/pwa/pair-device', [PwaDeviceController::class, 'pairDevice']); // Route publik untuk PWA

// Rute yang memerlukan otentikasi
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/user/profile', [AuthController::class, 'updateProfile']);

    Route::apiResource('kontak', KontakController::class);

    Route::post('/riset/upload', [RisetController::class, 'processUpload']);

    Route::prefix('distribusi')->group(function () {
        Route::get('/state', [DistribusiController::class, 'getState']);
        Route::get('/pwa-state', [DistribusiController::class, 'getPwaState']); // Route baru untuk state PWA
        Route::post('/setup-batches', [DistribusiController::class, 'setupBatches']);
        Route::post('/distribute', [DistribusiController::class, 'distributeLinks']);
        Route::put('/batch/{batch}', [DistribusiController::class, 'updateBatch']);
        Route::get('/batch/{batch}/links', [DistribusiController::class, 'getLinksForBatch']);
        Route::post('/log-sent', [DistribusiController::class, 'logSentLinks']);
    });

    Route::post('/dashboard/force-restart', [DashboardController::class, 'forceRestart']);
    Route::get('/dashboard/history', [DashboardController::class, 'getHistory']);

    // Route untuk fungsionalitas PWA yang memerlukan login
    Route::prefix('pwa')->group(function () {
        Route::get('/devices', [PwaDeviceController::class, 'index']);
        Route::post('/generate-pairing-token', [PwaDeviceController::class, 'generatePairingToken']);
        Route::delete('/devices/{pwaDevice}', [PwaDeviceController::class, 'destroy']);
    });
});
