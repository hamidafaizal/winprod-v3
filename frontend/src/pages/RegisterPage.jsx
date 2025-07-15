import React, { useState } from 'react';
import FileUpload from '../components/FileUpload.jsx';
import { FaRocket } from 'react-icons/fa';
import { uploadRisetFiles } from '../api.js';

const RisetPage = () => {
  const [rank, setRank] = useState(10); // State untuk Rank
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processLog, setProcessLog] = useState([]);

  const handleFilesSelected = (files) => {
    setSelectedFiles(files);
  };

  const handleStartProcessing = async () => {
    if (selectedFiles.length === 0) {
      alert('Silakan pilih setidaknya satu file CSV untuk diproses.');
      return;
    }

    setIsProcessing(true);
    const initialLog = `Mengirim ${selectedFiles.length} file ke server dengan Rank=${rank}...`;
    setProcessLog([initialLog]);

    const formData = new FormData();
    formData.append('rank', rank);
    selectedFiles.forEach(file => {
      // 'files[]' penting agar Laravel dapat membaca ini sebagai array
      formData.append('files[]', file);
    });

    try {
      const response = await uploadRisetFiles(formData);
      const { message, added, duplicates } = response.data;
      
      const newLogs = [
        initialLog,
        `Server: ${message}`,
        `Berhasil menambahkan ${added} link baru ke Gudang.`,
        `Ditemukan dan diabaikan ${duplicates} link duplikat.`,
        'Semua proses selesai.'
      ];
      setProcessLog(newLogs);

    } catch (error) {
      console.error("Error saat mengunggah file:", error.response || error);
      const errorMessage = error.response?.data?.message || 'Terjadi kesalahan saat berkomunikasi dengan server.';
      const newLogs = [
        initialLog,
        `Error: ${errorMessage}`,
        'Proses dihentikan karena ada kesalahan.'
      ];
      setProcessLog(newLogs);
    } finally {
      setIsProcessing(false);
      // Kosongkan file setelah selesai agar tidak terkirim ulang
      setSelectedFiles([]); 
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Proses Riset Produk</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">Atur parameter, lalu unggah file CSV hasil riset Anda untuk diekstrak.</p>
      </div>

      {/* Pengaturan Riset */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Parameter Riset</h3>
        <div className="max-w-xs">
          <label htmlFor="rank" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Rank Produk Organik
          </label>
          <input
            type="number"
            id="rank"
            value={rank}
            onChange={(e) => setRank(parseInt(e.target.value) || 0)}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
            min="1"
          />
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Jumlah produk teratas (non-iklan) yang akan diambil berdasarkan penjualan.</p>
        </div>
      </div>

      {/* Area Unggah File */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <FileUpload onFilesSelected={handleFilesSelected} />
        <div className="mt-6 text-right">
          <button
            onClick={handleStartProcessing}
            disabled={selectedFiles.length === 0 || isProcessing}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <FaRocket className={`mr-3 ${isProcessing ? 'animate-spin' : ''}`} />
            {isProcessing ? 'Sedang Memproses...' : 'Mulai Proses'}
          </button>
        </div>
      </div>

      {/* Log Proses */}
      {processLog.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Log Proses:</h3>
          <div className="bg-gray-900 text-white p-4 rounded-md font-mono text-sm h-48 overflow-y-auto">
            {processLog.map((log, index) => (
              <p key={index}>{'> '}{log}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RisetPage;
