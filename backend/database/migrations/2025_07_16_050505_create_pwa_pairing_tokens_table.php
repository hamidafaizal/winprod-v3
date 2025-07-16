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
        Schema::create('pwa_pairing_tokens', function (Blueprint $table) {
            $table->id();
            // Menambahkan foreign key ke tabel users untuk mengetahui siapa yang membuat token
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            // Token unik yang akan ditampilkan sebagai QR code
            $table->string('token')->unique();
            // Waktu kedaluwarsa token untuk keamanan (misalnya, 5 menit)
            $table->timestamp('expires_at');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pwa_pairing_tokens');
    }
};
