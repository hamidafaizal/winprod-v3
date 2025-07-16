<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Gudang;
use App\Models\BatchConfig;
use App\Models\Kontak;
use App\Models\CacheLink;
use App\Models\RiwayatPengiriman;
use App\Models\PwaDevice; // Menambahkan model PwaDevice
use App\Models\PwaLink;   // Menambahkan model PwaLink
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class DistribusiController extends Controller
{
    /**
     * Mengambil state awal untuk halaman distribusi (WhatsApp) milik pengguna.
     */
    public function getState()
    {
        $user = Auth::user();

        $linksInGudangCount = Gudang::where('user_id', $user->id)->whereNull('batch_config_id')->count();
        
        $batches = BatchConfig::where('user_id', $user->id)
            ->with('assignedContact')
            ->withCount(['links as links_count'])
            ->orderBy('id', 'asc')
            ->get();

        $contacts = Kontak::where('user_id', $user->id)->orderBy('nama', 'asc')->get();

        return response()->json([
            'linksInGudang' => $linksInGudangCount,
            'batches' => $batches,
            'contacts' => $contacts,
        ]);
    }

    /**
     * Mengambil state awal untuk halaman distribusi PWA.
     */
    public function getPwaState()
    {
        $user = Auth::user();

        $linksInGudangCount = Gudang::where('user_id', $user->id)->whereNull('batch_config_id')->count();
        
        // Mengambil perangkat PWA milik pengguna beserta jumlah link yang sudah ditugaskan
        $pwaDevices = PwaDevice::where('user_id', $user->id)
            ->withCount('pwaLinks as links_count')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'linksInGudang' => $linksInGudangCount,
            'pwaDevices' => $pwaDevices,
        ]);
    }


    /**
     * Mengatur (menambah/mengurangi) jumlah batch sesuai input user.
     */
    public function setupBatches(Request $request)
    {
        $request->validate(['jumlah_hp' => 'required|integer|min:0']);
        $newCount = $request->input('jumlah_hp');
        $user = Auth::user();

        DB::transaction(function () use ($newCount, $user) {
            $currentBatches = BatchConfig::where('user_id', $user->id)->orderBy('id', 'asc')->get();
            $currentCount = $currentBatches->count();

            if ($newCount > $currentCount) {
                for ($i = $currentCount + 1; $i <= $newCount; $i++) {
                    BatchConfig::create([
                        'user_id' => $user->id,
                        'nama' => 'Batch #' . $i,
                        'kapasitas' => 100,
                    ]);
                }
            } elseif ($newCount < $currentCount) {
                $batchesToDelete = $currentBatches->slice($newCount);
                $batchIdsToDelete = $batchesToDelete->pluck('id');

                Gudang::where('user_id', $user->id)
                      ->whereIn('batch_config_id', $batchIdsToDelete)
                      ->update(['batch_config_id' => null]);

                BatchConfig::whereIn('id', $batchIdsToDelete)->delete();
            }
        });

        return response()->json(['message' => 'Jumlah batch berhasil diperbarui.']);
    }

    /**
     * Mendistribusikan link dari gudang ke batch (WhatsApp) milik pengguna.
     */
    public function distributeLinks()
    {
        $user = Auth::user();

        DB::transaction(function () use ($user) {
            $availableLinks = Gudang::where('user_id', $user->id)->whereNull('batch_config_id')->get();
            $batches = BatchConfig::where('user_id', $user->id)->withCount('links as current_links_count')->orderBy('id', 'asc')->get();

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
                Gudang::where('user_id', $user->id)->whereIn('id', $linkIds)->update(['batch_config_id' => $batch->id]);

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
        if ($batch->user_id !== Auth::id()) {
            return response()->json(['message' => 'Tidak diizinkan'], 403);
        }

        $validated = $request->validate([
            'kontak_id' => 'nullable|exists:kontaks,id,user_id,' . Auth::id(),
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
        if ($batch->user_id !== Auth::id()) {
            return response()->json(['message' => 'Tidak diizinkan'], 403);
        }
        return response()->json($batch->links()->get());
    }
    
    /**
     * Mencatat link yang sudah terkirim ke cache dan membuat riwayat.
     */
    public function logSentLinks(Request $request)
    {
        $user = Auth::user();
        $request->validate([
            'batch_id' => 'required|exists:batch_configs,id,user_id,' . $user->id,
        ]);
        $batchId = $request->input('batch_id');

        DB::transaction(function () use ($batchId, $user) {
            $batch = BatchConfig::where('user_id', $user->id)->find($batchId);
            $sentLinks = Gudang::where('user_id', $user->id)->where('batch_config_id', $batchId)->get();

            if ($sentLinks->isEmpty() || !$batch->kontak_id) {
                return;
            }

            RiwayatPengiriman::create([
                'user_id' => $user->id,
                'kontak_id' => $batch->kontak_id,
                'batch_config_id' => $batch->id,
                'jumlah_link' => $sentLinks->count(),
            ]);

            $linksToCache = $sentLinks->map(function ($link) use ($user) {
                return [
                    'user_id' => $user->id,
                    'product_link' => $link->product_link, 
                    'created_at' => now(), 
                    'updated_at' => now()
                ];
            })->all();
            CacheLink::insert($linksToCache);

            Gudang::where('user_id', $user->id)->whereIn('id', $sentLinks->pluck('id'))->delete();
        });

        return response()->json(['message' => 'Link terkirim berhasil dicatat.']);
    }
}
