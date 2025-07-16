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
        Schema::create('pwa_links', function (Blueprint $table) {
            $table->id();
            // Foreign key ke perangkat PWA yang akan menerima link ini
            $table->foreignId('pwa_device_id')->constrained()->onDelete('cascade');
            // Menyimpan URL produk
            $table->text('product_link');
            // Status untuk melacak apakah link sudah dilihat atau belum (opsional, bisa dikembangkan nanti)
            $table->string('status')->default('dikirim');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pwa_links');
    }
};
