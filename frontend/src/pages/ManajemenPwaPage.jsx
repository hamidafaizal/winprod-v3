import React, { useState, useEffect } from 'react';
import { FaQrcode, FaTrash } from 'react-icons/fa';
import { getPwaDevices, generatePairingToken, deletePwaDevice } from '../api.js'; // Menggunakan fungsi API baru
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import QrDisplayModal from '../components/QrDisplayModal.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx'; // Import dialog konfirmasi

const ManajemenPwaPage = () => {
  const [devices, setDevices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [pairingToken, setPairingToken] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingDeviceId, setDeletingDeviceId] = useState(null);

  const fetchDevices = async () => {
    setIsLoading(true);
    try {
      const response = await getPwaDevices();
      setDevices(response.data);
    } catch (error) {
      console.error("Gagal memuat perangkat PWA:", error);
      alert('Gagal memuat data perangkat dari server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleTambahPerangkat = async () => {
    setIsQrModalOpen(true);
    setPairingToken(null);
    try {
      const response = await generatePairingToken();
      setPairingToken(response.data.token);
    } catch (error) {
      console.error("Gagal membuat token pairing:", error);
      alert("Gagal membuat QR Code. Silakan coba lagi.");
      setIsQrModalOpen(false);
    }
  };

  const handleDeleteClick = (id) => {
    setDeletingDeviceId(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingDeviceId) return;
    try {
      await deletePwaDevice(deletingDeviceId);
      alert('Perangkat berhasil dihapus.');
      fetchDevices(); // Muat ulang daftar perangkat
    } catch (error) {
      console.error("Gagal menghapus perangkat:", error);
      alert("Gagal menghapus perangkat. Silakan coba lagi.");
    } finally {
      setIsConfirmOpen(false);
      setDeletingDeviceId(null);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Manajemen Perangkat PWA</h1>
          <button
            onClick={handleTambahPerangkat}
            className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
          >
            <FaQrcode className="mr-2" />
            Tambah Perangkat
          </button>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">Nama Perangkat</th>
                  <th scope="col" className="px-6 py-3">Tanggal Terdaftar</th>
                  <th scope="col" className="px-6 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {devices.length > 0 ? (
                  devices.map((device) => (
                    <tr key={device.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                        {device.name}
                      </th>
                      <td className="px-6 py-4">{formatDate(device.created_at)}</td>
                      <td className="px-6 py-4 flex justify-center space-x-4">
                        <button onClick={() => handleDeleteClick(device.id)} className="text-red-500 hover:text-red-700">
                          <FaTrash size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center py-4 text-gray-500">
                      Belum ada perangkat PWA yang terdaftar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <QrDisplayModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        token={pairingToken}
      />

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Konfirmasi Hapus"
        message="Apakah Anda yakin ingin menghapus perangkat ini?"
      />
    </>
  );
};

export default ManajemenPwaPage;
