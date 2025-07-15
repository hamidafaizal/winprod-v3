<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Gudang;
use App\Models\CacheLink;
use App\Models\BatchConfig;

class DashboardController extends Controller
{
    /**
     * Mereset semua data transaksional (gudang, cache, batch)
     * tanpa mempengaruhi data kontak.
     */
    public function forceRestart()
    {
        try {
            // Menggunakan truncate untuk mereset tabel dengan cepat
            Gudang::truncate();
            CacheLink::truncate();
            BatchConfig::truncate();

            return response()->json(['message' => 'Sistem berhasil direset. Semua data link dan batch telah dihapus.'], 200);
        } catch (\Exception $e) {
            // Mencatat error jika terjadi
            \Log::error('Force Restart Failed: ' . $e->getMessage());
            return response()->json(['message' => 'Gagal mereset sistem.'], 500);
        }
    }
}
