<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Gudang;
use App\Models\BatchConfig;
use App\Models\Kontak;
use App\Models\CacheLink;
use Illuminate\Support\Facades\DB;

class DistribusiController extends Controller
{
    /**
     * Mengambil state awal untuk halaman distribusi.
     */
    public function getState()
    {
        $linksInGudangCount = Gudang::whereNull('batch_config_id')->count();
        
        $batches = BatchConfig::with('assignedContact')
            ->withCount(['links as links_count']) // Menghitung link untuk setiap batch
            ->orderBy('id', 'asc')
            ->get();

        $contacts = Kontak::orderBy('nama', 'asc')->get();

        return response()->json([
            'linksInGudang' => $linksInGudangCount,
            'batches' => $batches,
            'contacts' => $contacts,
        ]);
    }

    /**
     * Mengatur (menambah/mengurangi) jumlah batch sesuai input user.
     */
    public function setupBatches(Request $request)
    {
        $request->validate(['jumlah_hp' => 'required|integer|min:0']);
        $newCount = $request->input('jumlah_hp');

        DB::transaction(function () use ($newCount) {
            $currentBatches = BatchConfig::orderBy('id', 'asc')->get();
            $currentCount = $currentBatches->count();

            if ($newCount > $currentCount) {
                // Jika jumlah baru lebih besar, tambahkan batch baru
                for ($i = $currentCount + 1; $i <= $newCount; $i++) {
                    BatchConfig::create([
                        'nama' => 'Batch #' . $i,
                        'kapasitas' => 100,
                    ]);
                }
            } elseif ($newCount < $currentCount) {
                // Jika jumlah baru lebih kecil, hapus batch dari belakang
                $batchesToDelete = $currentBatches->slice($newCount);
                $batchIdsToDelete = $batchesToDelete->pluck('id');

                // Kembalikan link dari batch yang akan dihapus ke gudang
                Gudang::whereIn('batch_config_id', $batchIdsToDelete)->update(['batch_config_id' => null]);

                // Hapus batch
                BatchConfig::whereIn('id', $batchIdsToDelete)->delete();
            }
        });

        return response()->json(['message' => 'Jumlah batch berhasil diperbarui.']);
    }

    /**
     * Mendistribusikan link dari gudang ke batch.
     */
    public function distributeLinks()
    {
        DB::transaction(function () {
            $availableLinks = Gudang::whereNull('batch_config_id')->get();
            $batches = BatchConfig::withCount('links as current_links_count')->orderBy('id', 'asc')->get();

            $linkIndex = 0;

            foreach ($batches as $batch) {
                $linksNeeded = $batch->kapasitas - $batch->current_links_count;
                if ($linksNeeded <= 0) {
                    continue;
                }

                $linksToAssign = $availableLinks->slice($linkIndex, $linksNeeded);
                if ($linksToAssign->isEmpty()) {
                    break; 
                }

                $linkIds = $linksToAssign->pluck('id');
                Gudang::whereIn('id', $linkIds)->update(['batch_config_id' => $batch->id]);

                $linkIndex += $linksToAssign->count();
            }
        });

        return response()->json(['message' => 'Link berhasil didistribusikan ke batch.']);
    }

    /**
     * Memperbarui batch (menugaskan kontak atau mengubah kapasitas).
     */
    public function updateBatch(Request $request, BatchConfig $batch)
    {
        $validated = $request->validate([
            'kontak_id' => 'nullable|exists:kontaks,id',
            'kapasitas' => 'sometimes|required|integer|min:1',
        ]);

        $batch->update($validated);
        
        return response()->json($batch->load('assignedContact'));
    }

    /**
     * Mengambil semua link yang ada di dalam batch tertentu.
     */
    public function getLinksForBatch(BatchConfig $batch)
    {
        return response()->json($batch->links()->get());
    }

    /**
     * Mencatat link yang sudah terkirim ke cache.
     */
    public function logSentLinks(Request $request)
    {
        $request->validate(['batch_id' => 'required|exists:batch_configs,id']);
        $batchId = $request->input('batch_id');

        DB::transaction(function () use ($batchId) {
            $sentLinks = Gudang::where('batch_config_id', $batchId)->get();

            if ($sentLinks->isEmpty()) {
                return;
            }

            // Pindahkan ke cache
            $linksToCache = $sentLinks->map(function ($link) {
                return ['product_link' => $link->product_link, 'created_at' => now(), 'updated_at' => now()];
            })->all();
            CacheLink::insert($linksToCache);

            // Hapus dari gudang
            Gudang::whereIn('id', $sentLinks->pluck('id'))->delete();
        });

        return response()->json(['message' => 'Link terkirim berhasil dicatat.']);
    }
}
