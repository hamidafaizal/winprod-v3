<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\PwaDevice;
use App\Models\PwaPairingToken; // Menambahkan model baru
use Illuminate\Support\Str;      // Untuk membuat string acak
use Carbon\Carbon;               // Untuk menangani waktu

class PwaDeviceController extends Controller
{
    /**
     * Mengambil daftar perangkat PWA milik pengguna yang sedang login.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $devices = Auth::user()->pwaDevices()->orderBy('created_at', 'desc')->get();
        return response()->json($devices);
    }

    /**
     * Membuat token pairing baru untuk pengguna yang sedang login.
     * Token ini akan ditampilkan sebagai QR code di frontend.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function generatePairingToken()
    {
        $user = Auth::user();

        // Hapus token lama yang mungkin sudah kedaluwarsa untuk pengguna ini
        PwaPairingToken::where('user_id', $user->id)->delete();

        $token = PwaPairingToken::create([
            'user_id' => $user->id,
            'token' => Str::random(40),
            'expires_at' => Carbon::now()->addMinutes(5), // Token berlaku selama 5 menit
        ]);

        return response()->json(['token' => $token->token]);
    }

    /**
     * Menautkan perangkat PWA baru menggunakan token dari QR code.
     * Ini adalah route publik yang dipanggil oleh PWA.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function pairDevice(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'device_id' => 'required|string|unique:pwa_devices,device_id',
            'pairing_token' => 'required|string|exists:pwa_pairing_tokens,token',
        ]);

        // Cari token di database
        $pairingToken = PwaPairingToken::where('token', $validatedData['pairing_token'])->first();

        // Validasi jika token sudah kedaluwarsa
        if ($pairingToken->expires_at < Carbon::now()) {
            $pairingToken->delete(); // Hapus token yang sudah hangus
            return response()->json(['message' => 'QR Code sudah kedaluwarsa. Silakan buat yang baru.'], 410); // 410 Gone
        }

        // Jika token valid, daftarkan perangkat
        $device = PwaDevice::create([
            'user_id' => $pairingToken->user_id,
            'name' => $validatedData['name'],
            'device_id' => $validatedData['device_id'],
        ]);

        // Hapus token setelah berhasil digunakan
        $pairingToken->delete();

        return response()->json([
            'message' => 'Perangkat berhasil ditautkan!',
            'device' => $device,
        ], 200);
    }

    /**
     * Menghapus perangkat PWA yang terdaftar.
     *
     * @param  \App\Models\PwaDevice  $pwaDevice
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(PwaDevice $pwaDevice)
    {
        // Otorisasi: Pastikan perangkat ini milik user yang sedang login
        if ($pwaDevice->user_id !== Auth::id()) {
            return response()->json(['message' => 'Tidak diizinkan'], 403);
        }

        $pwaDevice->delete();

        return response()->json(null, 204); // 204 No Content
    }
}
