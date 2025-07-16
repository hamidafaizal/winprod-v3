import React, { useState, useEffect } from 'react';
import { FaDownload } from 'react-icons/fa';

const PwaInstallButton = () => {
  const [installPrompt, setInstallPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      // Mencegah browser menampilkan prompt default
      event.preventDefault();
      // Simpan event agar bisa digunakan nanti
      setInstallPrompt(event);
    };

    // Tambahkan event listener saat komponen dimuat
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Hapus event listener saat komponen di-unmount
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) {
      return;
    }

    // Tampilkan prompt instalasi
    const result = await installPrompt.prompt();
    console.log(`Hasil prompt instalasi: ${result.outcome}`);

    // Kosongkan state setelah prompt ditampilkan
    setInstallPrompt(null);
  };

  // Jika tidak ada prompt instalasi, jangan render apa-apa
  if (!installPrompt) {
    return null;
  }

  // Tampilkan tombol instalasi
  return (
    <button
      onClick={handleInstallClick}
      className="fixed bottom-16 right-4 z-50 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg flex items-center"
      title="Install Aplikasi"
    >
      <FaDownload className="mr-2" />
      Install
    </button>
  );
};

export default PwaInstallButton;
