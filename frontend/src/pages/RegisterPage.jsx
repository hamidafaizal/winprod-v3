import React, { useState } from 'react';
import FileUpload from '../components/FileUpload.jsx';
import { FaRocket } from 'react-icons/fa';

console.log("Log: RisetPage.jsx script loaded."); // LOG 6

const RisetPage = () => {
  console.log("Log: RisetPage component rendering..."); // LOG 7

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processLog, setProcessLog] = useState([]);

  const handleFilesSelected = (files) => {
    setSelectedFiles(files);
  };

  const handleStartProcessing = () => {
    if (selectedFiles.length === 0) {
      alert('Silakan pilih setidaknya satu file CSV untuk diproses.');
      return;
    }

    setIsProcessing(true);
    setProcessLog([`Memulai proses untuk ${selectedFiles.length} file...`]);

    // Simulasi proses backend
    setTimeout(() => {
      const newLogs = [`Memulai proses untuk ${selectedFiles.length} file...`];
      selectedFiles.forEach((file, index) => {
        setTimeout(() => {
          const successCount = Math.floor(Math.random() * 100);
          const duplicateCount = Math.floor(Math.random() * 20);
          newLogs.push(`[File ${index + 1}: ${file.name}] Selesai. Ditemukan ${successCount} link baru, ${duplicateCount} duplikat diabaikan.`);
          setProcessLog([...newLogs]);
        }, (index + 1) * 1500);
      });

      setTimeout(() => {
        newLogs.push('Semua proses selesai.');
        setProcessLog([...newLogs]);
        setIsProcessing(false);
        setSelectedFiles([]);
      }, selectedFiles.length * 1500 + 500);
    }, 1000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Proses Riset Produk</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">Unggah file CSV hasil riset Anda untuk diekstrak dan disimpan ke gudang.</p>
      </div>

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
