<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PwaLink extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'pwa_links';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'pwa_device_id',
        'product_link',
        'status',
    ];

    /**
     * Mendefinisikan relasi bahwa link ini dimiliki oleh sebuah PwaDevice.
     */
    public function pwaDevice()
    {
        return $this->belongsTo(PwaDevice::class);
    }
}
