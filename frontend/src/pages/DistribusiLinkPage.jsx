import React, { useState, useEffect } from 'react';
import BatchCard from '../components/BatchCard.jsx';
import { FaShareAlt } from 'react-icons/fa';

// Data dummy, nantinya akan berasal dari API
const initialGudangLinks = Array.from({ length: 35 }, (_, i) => `https://winprod.com/produk/${1000 + i}`);
const initialContacts = [
  { id: 1, name: 'Budi Santoso', number: '6281234567890' },
  { id: 2, name: 'Citra Lestari', number: '6289876543210' },
  { id: 3, name: 'Ahmad Dahlan', number: '6285512345678' },
  { id: 4, name: 'Dewi Anggraini', number: '6287788990011' },
  { id: 5, name: 'Eko Prasetyo', number: '6281122334455' },
];

const DistribusiLinkPage = () => {
  const [gudang, setGudang] = useState(initialGudangLinks);
  const [jumlahHp, setJumlahHp] = useState(5); // State untuk Jumlah HP
  const [batches, setBatches] = useState([]);
  const [contacts] = useState(initialContacts);
  const [isSending, setIsSending] = useState(false);

  // Efek untuk menginisialisasi atau memperbarui batch saat jumlahHp berubah
  useEffect(() => {
    // Di aplikasi nyata, ini akan memanggil API untuk membuat/menyesuaikan batch
    console.log(`Jumlah HP diatur ke ${jumlahHp}. Membuat batch baru.`);
    const newBatches = Array.from({ length: jumlahHp }, (_, i) => ({
        id: i + 1,
        name: `Batch #${i + 1}`,
        capacity: 10, // Kapasitas bisa dibuat dinamis di masa depan
        links: [],
        assignedContactId: null,
    }));
    setBatches(newBatches);
  }, [jumlahHp]);

  const handleDistributeLinks = () => {
    let availableLinks = [...gudang];
    const updatedBatches = batches.map(batch => {
      const linksNeeded = batch.capacity - batch.links.length;
      if (linksNeeded > 0 && availableLinks.length > 0) {
        const linksToAssign = availableLinks.splice(0, linksNeeded);
        return { ...batch, links: [...batch.links, ...linksToAssign] };
      }
      return batch;
    });
    setBatches(updatedBatches);
    setGudang(availableLinks);
  };

  const handleAssignContact = (batchId, contactId) => {
    setBatches(batches.map(b => (b.id === batchId ? { ...b, assignedContactId: contactId } : b)));
  };

  const handleSendSuccess = (batchId) => {
    console.log(`Simulasi: Link dari Batch #${batchId} telah dikirim dan dicatat.`);
    setBatches(batches.map(b => (b.id === batchId ? { ...b, links: [] } : b)));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Distribusi Link</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">Atur jumlah HP, bagi link, lalu kirimkan ke kontak Anda.</p>
      </div>

      {/* Panel Statistik dan Aksi */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 gap-6">
        <div className="text-center sm:text-left">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Link di Gudang</h3>
          <p className="text-3xl font-bold text-blue-500">{gudang.length}</p>
        </div>

        <div className="text-center sm:text-left">
            <label htmlFor="jumlah-hp" className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                Jumlah HP
            </label>
            <input
                type="number"
                id="jumlah-hp"
                value={jumlahHp}
                onChange={(e) => setJumlahHp(parseInt(e.target.value) || 0)}
                className="mt-1 block w-full sm:w-24 px-3 py-2 text-center text-xl font-bold bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
                min="0"
            />
        </div>

        <button
          onClick={handleDistributeLinks}
          disabled={gudang.length === 0}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <FaShareAlt className="mr-3" />
          Bagi Link ke Batch
        </button>
      </div>

      {/* Daftar Batch */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {batches.map(batch => (
          <BatchCard
            key={batch.id}
            batch={batch}
            contacts={contacts}
            onAssignContact={handleAssignContact}
            onSend={handleSendSuccess}
            isSending={isSending}
          />
        ))}
      </div>
    </div>
  );
};

export default DistribusiLinkPage;
