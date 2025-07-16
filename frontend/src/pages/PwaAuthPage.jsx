import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { FaMobileAlt } from 'react-icons/fa';

const PwaAuthPage = () => {
  const [deviceId, setDeviceId] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [qrValue, setQrValue] = useState('');

  useEffect(() => {
    // Cek apakah sudah ada device ID di localStorage
    let storedDeviceId = localStorage.getItem('pwa_device_id');
    if (!storedDeviceId) {
      // Jika tidak ada, buat ID baru dan simpan
      storedDeviceId = crypto.randomUUID();
      localStorage.setItem('pwa_device_id', storedDeviceId);
    }
    setDeviceId(storedDeviceId);
  }, []);

  useEffect(() => {
    // Update nilai QR code setiap kali nama perangkat atau ID berubah
    if (deviceName && deviceId) {
      const data = {
        name: deviceName,
        device_id: deviceId,
      };
      setQrValue(JSON.stringify(data));
    } else {
      setQrValue('');
    }
  }, [deviceName, deviceId]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 text-center">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm">
        <FaMobileAlt className="mx-auto text-5xl text-blue-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Daftarkan Perangkat Ini</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Beri nama perangkat ini, lalu pindai QR Code dari aplikasi web utama Anda di menu "Manajemen PWA".
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

        {qrValue ? (
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md inline-block">
            <QRCodeCanvas value={qrValue} size={200} />
          </div>
        ) : (
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md flex items-center justify-center h-[232px] w-[232px] mx-auto">
            <p className="text-gray-500 dark:text-gray-400">Masukkan nama perangkat untuk membuat QR Code.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PwaAuthPage;
