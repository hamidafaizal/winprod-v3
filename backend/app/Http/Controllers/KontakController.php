<?php

namespace App\Http\Controllers;

use App\Models\Kontak;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class KontakController extends Controller
{
    /**
     * Menampilkan semua data kontak.
     */
    public function index()
    {
        return Kontak::orderBy('nama', 'asc')->get();
    }

    /**
     * Menyimpan kontak baru ke database.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'nama' => 'required|string|max:255',
            'nomor_hp' => 'required|string|unique:kontaks,nomor_hp',
        ]);

        $kontak = Kontak::create($validatedData);

        return response()->json($kontak, 201);
    }

    /**
     * Menampilkan satu data kontak spesifik.
     */
    public function show(Kontak $kontak)
    {
        return $kontak;
    }

    /**
     * Memperbarui data kontak yang ada.
     */
    public function update(Request $request, Kontak $kontak)
    {
        $validatedData = $request->validate([
            'nama' => 'required|string|max:255',
            'nomor_hp' => [
                'required',
                'string',
                Rule::unique('kontaks')->ignore($kontak->id),
            ],
        ]);

        $kontak->update($validatedData);

        return response()->json($kontak);
    }

    /**
     * Menghapus data kontak dari database.
     */
    public function destroy(Kontak $kontak)
    {
        $kontak->delete();

        return response()->json(null, 204);
    }
}
