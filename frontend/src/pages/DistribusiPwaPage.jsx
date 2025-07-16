import React, { useState, useEffect, useCallback } from 'react';
import { FaShareAlt, FaSpinner, FaLaptopCode, FaLink } from 'react-icons/fa';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { getPwaDistribusiState } from '../api.js'; // Menggunakan fungsi API yang sebenarnya

const DistribusiPwaPage = () => {
  const [linksInGudang, setLinksInGudang] = useState(0);
  const [pwaDevices, setPwaDevices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDistributing, setIsDistributing] = useState(false);

  // Fungsi untuk mengambil semua data dari backend
  const fetchState = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getPwaDistribusiState();
      const { linksInGudang, pwaDevices } = response.data;
      setLinksInGudang(linksInGudang);
      setPwaDevices(pwaDevices);
    } catch (error) {
      console.error("Gagal memuat state distribusi PWA:", error);
      alert("Gagal memuat data dari server.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Panggil fetchState saat komponen pertama kali dimuat
  useEffect(() => {
    fetchState();
  }, [fetchState]);
  
  const handleDistributeLinks = async () => {
    setIsDistributing(true);
    // TODO: Ganti dengan fungsi API yang sebenarnya
    // try {
    //   await distributeLinksToPwa();
    //   await fetchState();
    // } catch (error) {
    //   console.error("Gagal mendistribusikan link:", error);
    //   alert("Gagal mendistribusikan link.");
    // } finally {
    //   setIsDistributing(false);
    // }
    alert("Fungsi distribusi belum diimplementasikan.");
    setIsDistributing(false);
  };


  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Distribusi Link ke PWA</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">Bagikan link dari gudang ke perangkat PWA yang terdaftar.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 gap-6">
        <div className="text-center sm:text-left">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Link di Gudang</h3>
          <p className="text-3xl font-bold text-blue-500">{linksInGudang}</p>
        </div>

        <button
          onClick={handleDistributeLinks}
          disabled={linksInGudang === 0 || isDistributing}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isDistributing ? <FaSpinner className="animate-spin mr-3" /> : <FaShareAlt className="mr-3" />}
          {isDistributing ? 'Membagikan...' : 'Bagi Link ke Semua PWA'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {pwaDevices.map(device => (
          <div key={device.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex flex-col justify-between">
             <h3 className="font-bold text-lg text-gray-800 dark:text-white flex items-center">
                <FaLaptopCode className="mr-2" />
                {device.name}
            </h3>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 space-y-2">
                <div className="flex items-center">
                    <FaLink className="mr-2" />
                    <span>{device.links_count} Link</span>
                </div>
            </div>
          </div>
        ))}
        {pwaDevices.length === 0 && !isLoading && (
            <p className="text-gray-500 dark:text-gray-400 col-span-full text-center">
                Belum ada perangkat PWA yang terdaftar.
            </p>
        )}
      </div>
    </div>
  );
};

export default DistribusiPwaPage;
