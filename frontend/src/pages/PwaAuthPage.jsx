import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { FaMobileAlt, FaQrcode } from 'react-icons/fa';
import { pairPwaDevice } from '../api';

const PwaAuthPage = () => {
  const [deviceName, setDeviceName] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');

  const deviceId = localStorage.getItem('pwa_device_id') || crypto.randomUUID();

  // Pastikan deviceId tersimpan di localStorage saat komponen pertama kali dimuat
  useEffect(() => {
    if (!localStorage.getItem('pwa_device_id')) {
      localStorage.setItem('pwa_device_id', deviceId);
    }
  }, [deviceId]);

  // useEffect ini akan mengontrol scanner
  useEffect(() => {
    if (!isScanning) {
      return;
    }

    // Konfigurasi baru untuk langsung menggunakan kamera belakang
    const config = {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 10,
      // Opsi ini meminta browser untuk menggunakan kamera belakang
      videoConstraints: {
        facingMode: { exact: "environment" }
      }
    };

    const scanner = new Html5QrcodeScanner(
      'qr-reader-pwa', // ID dari div container
      config,
      /* verbose= */ false
    );

    const handleScanSuccess = (decodedText) => {
      // Hentikan scanner dan proses hasilnya
      scanner.clear().then(() => {
        processScannedData(decodedText);
      }).catch(err => {
        console.error("Gagal membersihkan scanner:", err);
        processScannedData(decodedText); // Tetap proses meskipun clear gagal
      });
    };

    scanner.render(handleScanSuccess, () => {}); // Error handler diabaikan

    // Cleanup function untuk menghentikan scanner
    return () => {
      // Cek apakah scanner masih aktif sebelum mencoba membersihkannya
      if (scanner && scanner.getState() === 2) { // 2 = SCANNING
        scanner.clear().catch(err => {
          console.error("Gagal membersihkan scanner saat unmount.", err);
        });
      }
    };
  }, [isScanning]); // Hanya dijalankan saat nilai isScanning berubah

  const startScanning = () => {
    if (!deviceName) {
      alert('Silakan masukkan nama perangkat terlebih dahulu.');
      return;
    }
    setError('');
    setIsScanning(true);
  };

  const processScannedData = async (decodedText) => {
    try {
      const dataToSend = {
        name: deviceName,
        device_id: deviceId,
        pairing_token: decodedText,
      };
      
      await pairPwaDevice(dataToSend);
      
      localStorage.setItem('pwa_is_paired', 'true');
      alert('Perangkat berhasil ditautkan! Aplikasi akan dimulai ulang.');
      
      window.location.reload();

    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Gagal menautkan perangkat. Token mungkin tidak valid atau sudah kedaluwarsa.';
      setError(errorMessage);
      setIsScanning(false); // Kembali ke tampilan input jika gagal
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 text-center">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm">
        <FaMobileAlt className="mx-auto text-5xl text-blue-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Daftarkan Perangkat Ini</h1>
        
        {error && <p className="text-red-500 text-sm my-4">{error}</p>}

        {!isScanning ? (
          <>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Beri nama perangkat ini, lalu klik tombol untuk memindai QR Code yang ada di aplikasi web utama Anda.
            </p>
            <div className="mb-6">
              <label htmlFor="deviceName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nama Perangkat
              </label>
              <input
                type="text"
                id="deviceName"
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
                placeholder="Contoh: HP Pribadi"
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
              />
            </div>
            <button
              onClick={startScanning}
              disabled={!deviceName}
              className="w-full flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-400"
            >
              <FaQrcode className="mr-2" />
              Pindai QR untuk Menautkan
            </button>
          </>
        ) : (
          <div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Arahkan kamera ke QR Code di layar PC Anda.
            </p>
            <div id="qr-reader-pwa" className="w-full rounded-lg overflow-hidden"></div>
            <button
              onClick={() => setIsScanning(false)}
              className="mt-4 px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              Batal
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PwaAuthPage;
