import React, { useState, useEffect } from 'react';

const ContactModal = ({ isOpen, onClose, onSave, contact }) => {
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');

  useEffect(() => {
    if (contact) {
      setName(contact.name);
      setNumber(contact.number);
    } else {
      setName('');
      setNumber('');
    }
  }, [contact, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !number) {
      alert('Nama dan Nomor HP tidak boleh kosong.');
      return;
    }
    onSave({ ...contact, name, number });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
          {contact ? 'Edit Kontak' : 'Tambah Kontak Baru'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nama
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama kontak"
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="number" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nomor HP
            </label>
            <input
              type="tel"
              id="number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="Contoh: 081234567890"
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactModal;
