import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Menambahkan plugin VitePWA dengan konfigurasi yang diperbarui
    VitePWA({
      registerType: 'autoUpdate',
      // Menyertakan logo.png Anda yang ada di public/
      includeAssets: ['logo.png'],
      // Konfigurasi untuk file manifest.json
      manifest: {
        name: 'WinProd PWA',
        short_name: 'WinProd',
        description: 'Aplikasi untuk distribusi link produk.',
        theme_color: '#ffffff',
        // Menggunakan logo.png Anda untuk ikon PWA
        icons: [
          {
            src: 'logo.png',
            sizes: '192x192', // Ukuran ini bisa disesuaikan jika logo Anda berbeda
            type: 'image/png'
          },
          {
            src: 'logo.png',
            sizes: '512x512', // Ukuran ini bisa disesuaikan jika logo Anda berbeda
            type: 'image/png'
          },
          {
            src: 'logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
