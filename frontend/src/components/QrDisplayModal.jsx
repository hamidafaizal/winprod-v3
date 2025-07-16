import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import LoadingSpinner from './LoadingSpinner';

const QrDisplayModal = ({ isOpen, onClose, token }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-sm text-center">
        <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">
          Pindai dengan PWA Anda
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Buka aplikasi WinProd di HP Anda dan pindai QR code ini untuk menautkan perangkat.
        </p>
        {/* Perbaikan: Mengganti 'inline-block' dengan 'mx-auto' untuk centering yang lebih baik */}
        <div className="p-4 bg-white rounded-md mx-auto h-[232px] w-[232px] flex items-center justify-center">
          {token ? (
            <QRCodeCanvas value={token} size={200} />
          ) : (
            <LoadingSpinner />
          )}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-4">
          QR Code ini akan hangus dalam 5 menit.
        </p>
        <div className="mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default QrDisplayModal;
