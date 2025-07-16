import React, { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const QrScannerModal = ({ isOpen, onClose, onScan }) => {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    // Konfigurasi scanner
    const config = {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 10, // Frames per second
      rememberLastUsedCamera: true,
    };

    // Membuat instance scanner baru
    const scanner = new Html5QrcodeScanner(
      'qr-reader-container', // ID dari elemen div di bawah
      config,
      /* verbose= */ false
    );

    // Fungsi yang akan dijalankan saat QR code berhasil dipindai
    const handleSuccess = (decodedText, decodedResult) => {
      // Hentikan scanner dan panggil fungsi onScan dari parent
      scanner.clear().then(() => {
        onScan(decodedText);
      }).catch(error => {
        console.error("Gagal membersihkan scanner.", error);
        onScan(decodedText); // Tetap panggil onScan meskipun clear gagal
      });
    };

    // Fungsi untuk menangani error (bisa diabaikan)
    const handleError = (errorMessage) => {
      // console.error("QR Scanner Error:", errorMessage);
    };

    // Mulai rendering scanner
    scanner.render(handleSuccess, handleError);

    // Fungsi cleanup untuk menghentikan scanner saat modal ditutup
    return () => {
      // Pastikan scanner.clear() ada sebelum dipanggil
      if (scanner && typeof scanner.clear === 'function') {
        scanner.clear().catch(error => {
          console.error("Gagal membersihkan scanner saat unmount.", error);
        });
      }
    };
  }, [isOpen, onScan, onClose]); // Dependensi effect

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl w-full max-w-md relative">
        <h2 className="text-xl font-bold mb-4 text-center text-gray-800 dark:text-white">
          Pindai QR Code
        </h2>
        {/* Elemen ini adalah tempat scanner akan dirender */}
        <div id="qr-reader-container" className="w-full"></div>
        <div className="mt-4 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
};

export default QrScannerModal;
