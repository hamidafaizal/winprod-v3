<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pwa_devices', function (Blueprint $table) {
            $table->id();
            // Menambahkan foreign key ke tabel users untuk mengetahui pemilik perangkat
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            // Nama yang diberikan oleh pengguna untuk perangkat ini (misal: "HP Samsung A52")
            $table->string('name');
            // ID unik yang dihasilkan oleh PWA untuk identifikasi
            $table->string('device_id')->unique();
            // Untuk melacak kapan perangkat terakhir kali aktif atau digunakan
            $table->timestamp('last_used_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pwa_devices');
    }
};
