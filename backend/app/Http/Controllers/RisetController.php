<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Gudang;
use App\Models\CacheLink;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class RisetController extends Controller
{
    /**
     * Menerima unggahan file CSV, memproses, memfilter, dan menyimpan link unik.
     * Logika ini diadopsi dari contoh yang Anda berikan untuk keandalan.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function processUpload(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'files' => 'required|array',
            'files.*' => 'required|file|mimes:csv,txt',
            'rank' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $rankToTake = $request->input('rank');

            // 1. Ambil semua link yang sudah ada di Gudang dan Cache untuk disaring
            $existingInGudang = Gudang::pluck('product_link')->all();
            $existingInCache = CacheLink::pluck('product_link')->all();
            $allExistingLinks = array_merge($existingInGudang, $existingInCache);

            $allLinksFromFiles = collect();

            foreach ($request->file('files') as $file) {
                $path = $file->getRealPath();
                $file_data = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
                
                // Lewati jika file kosong
                if (count($file_data) < 2) {
                    continue;
                }

                $header = str_getcsv(array_shift($file_data));

                // Validasi header
                $requiredHeaders = ["Tren", "isAd", "Penjualan (30 Hari)", "productLink"];
                if (count(array_intersect($requiredHeaders, $header)) !== count($requiredHeaders)) {
                    continue; // Lewati file jika header tidak lengkap
                }

                // Ubah data CSV menjadi collection
                $rows = collect($file_data)->map(function ($line) use ($header) {
                    $data = str_getcsv($line);
                    // Pastikan jumlah kolom data sama dengan header
                    if (count($header) === count($data)) {
                        return array_combine($header, $data);
                    }
                    return null; // Abaikan baris yang tidak valid
                })->filter(); // Hapus baris yang null

                // Filter baris dengan Tren "TURUN"
                $nonTurun = $rows->filter(fn ($r) => isset($r['Tren']) && strtoupper($r['Tren']) !== 'TURUN');

                // Ambil link iklan
                $adLinks = $nonTurun->filter(fn ($r) => isset($r['isAd']) && strtoupper($r['isAd']) === 'YES')
                                    ->pluck('productLink');

                // Ambil link organik, urutkan, dan ambil sesuai rank
                $organikLinks = $nonTurun->filter(fn ($r) => isset($r['isAd'], $r['Tren']) && strtoupper($r['isAd']) === 'NO' && strtoupper($r['Tren']) === 'NAIK')
                                        ->sortByDesc(fn ($r) => (int) ($r['Penjualan (30 Hari)'] ?? 0))
                                        ->take($rankToTake)
                                        ->pluck('productLink');

                // Gabungkan link dari file ini ke collection utama
                $allLinksFromFiles = $allLinksFromFiles->merge($adLinks)->merge($organikLinks);
            }

            // 2. Filter link yang sudah ada di database (Gudang & Cache)
            $newLinks = $allLinksFromFiles->unique()->diff($allExistingLinks);

            if ($newLinks->isEmpty()) {
                return response()->json(['message' => 'Tidak ada link baru untuk ditambahkan.', 'added' => 0, 'duplicates' => $allLinksFromFiles->unique()->count()], 200);
            }

            // 3. Format data untuk dimasukkan ke tabel GUDANG
            $linksToInsert = $newLinks->map(function ($link) {
                return ['product_link' => $link, 'status' => 'tersedia', 'created_at' => now(), 'updated_at' => now()];
            })->values()->all();

            // 4. Masukkan link baru ke GUDANG
            Gudang::insert($linksToInsert);

            return response()->json([
                'message' => 'Proses riset selesai!',
                'added' => count($linksToInsert),
                'duplicates' => $allLinksFromFiles->unique()->count() - count($linksToInsert),
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error processing research file: ' . $e->getMessage());
            return response()->json(['message' => 'Terjadi kesalahan pada server saat memproses file.'], 500);
        }
    }
}
