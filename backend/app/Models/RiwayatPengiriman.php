<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RiwayatPengiriman extends Model
{
    use HasFactory;

    protected $table = 'riwayat_pengiriman';

    protected $fillable = [
        'kontak_id',
        'batch_config_id',
        'jumlah_link',
    ];

    /**
     * Mendefinisikan relasi ke model Kontak.
     */
    public function kontak()
    {
        return $this->belongsTo(Kontak::class);
    }
}
