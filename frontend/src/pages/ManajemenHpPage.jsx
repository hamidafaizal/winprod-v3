import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import ContactModal from '../components/ContactModal.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';

const ManajemenHpPage = () => {
  // State untuk data kontak, modal, dan dialog konfirmasi
  const [contacts, setContacts] = useState([
    { id: 1, name: 'Budi Santoso', number: '081234567890' },
    { id: 2, name: 'Citra Lestari', number: '089876543210' },
    { id: 3, name: 'Ahmad Dahlan', number: '085512345678' },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingContactId, setDeletingContactId] = useState(null);

  // Fungsi untuk membuka modal (untuk tambah atau edit)
  const handleOpenModal = (contact = null) => {
    setEditingContact(contact);
    setIsModalOpen(true);
  };

  // Fungsi untuk menutup modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingContact(null);
  };

  // Fungsi untuk menyimpan kontak (logika tambah dan edit)
  const handleSaveContact = (contactToSave) => {
    if (contactToSave.id) {
      // Edit kontak
      setContacts(contacts.map(c => (c.id === contactToSave.id ? contactToSave : c)));
    } else {
      // Tambah kontak baru
      const newContact = { ...contactToSave, id: Date.now() }; // Menggunakan timestamp sebagai ID unik sementara
      setContacts([...contacts, newContact]);
    }
    handleCloseModal();
  };

  // Fungsi saat tombol hapus di-klik
  const handleDeleteClick = (id) => {
    setDeletingContactId(id);
    setIsConfirmOpen(true);
  };

  // Fungsi untuk mengkonfirmasi penghapusan
  const handleConfirmDelete = () => {
    setContacts(contacts.filter(c => c.id !== deletingContactId));
    setIsConfirmOpen(false);
    setDeletingContactId(null);
  };

  // Fungsi untuk membatalkan penghapusan
  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
    setDeletingContactId(null);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      {/* Header Halaman */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Manajemen Kontak HP</h1>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
        >
          <FaPlus className="mr-2" />
          Tambah Kontak
        </button>
      </div>

      {/* Tabel Daftar Kontak */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Nama</th>
              <th scope="col" className="px-6 py-3">Nomor HP</th>
              <th scope="col" className="px-6 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                  {contact.name}
                </th>
                <td className="px-6 py-4">{contact.number}</td>
                <td className="px-6 py-4 flex justify-center space-x-4">
                  <button onClick={() => handleOpenModal(contact)} className="text-blue-500 hover:text-blue-700">
                    <FaEdit size={18} />
                  </button>
                  <button onClick={() => handleDeleteClick(contact.id)} className="text-red-500 hover:text-red-700">
                    <FaTrash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal dan Dialog Konfirmasi */}
      <ContactModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveContact}
        contact={editingContact}
      />
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Konfirmasi Hapus"
        message="Apakah Anda yakin ingin menghapus kontak ini?"
      />
    </div>
  );
};

export default ManajemenHpPage;
