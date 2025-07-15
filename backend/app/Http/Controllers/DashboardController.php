<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema; // Import Schema Facade
use App\Models\Gudang;
use App\Models\CacheLink;
use App\Models\BatchConfig;
use App\Models\RiwayatPengiriman;

class DashboardController extends Controller
{
    /**
     * Mereset semua data transaksional dengan aman.
     */
    public function forceRestart()
    {
        try {
            // Nonaktifkan foreign key checks untuk sementara
            Schema::disableForeignKeyConstraints();

            // Gunakan truncate untuk mereset tabel dengan cepat
            Gudang::truncate();
            CacheLink::truncate();
            BatchConfig::truncate();
            RiwayatPengiriman::truncate();

            // Aktifkan kembali foreign key checks
            Schema::enableForeignKeyConstraints();

            return response()->json(['message' => 'Sistem berhasil direset. Semua data link dan batch telah dihapus.'], 200);
        } catch (\Exception $e) {
            // Jika terjadi error, pastikan foreign key checks diaktifkan kembali
            Schema::enableForeignKeyConstraints();
            \Log::error('Force Restart Failed: ' . $e->getMessage());
            return response()->json(['message' => 'Gagal mereset sistem.'], 500);
        }
    }

    /**
     * Mengambil data riwayat pengiriman.
     */
    public function getHistory()
    {
        $history = RiwayatPengiriman::with('kontak')
            ->orderBy('created_at', 'desc')
            ->take(20)
            ->get();

        return response()->json($history);
    }
}
