import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const ManajemenHpPage = () => {
  // Data kontak dummy disimpan dalam state
  const [contacts, setContacts] = useState([
    { id: 1, name: 'Budi Santoso', number: '081234567890' },
    { id: 2, name: 'Citra Lestari', number: '089876543210' },
    { id: 3, name: 'Ahmad Dahlan', number: '085512345678' },
  ]);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      {/* Header Halaman */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Manajemen Kontak HP</h1>
        <button className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">
          <FaPlus className="mr-2" />
          Tambah Kontak
        </button>
      </div>

      {/* Tabel Daftar Kontak */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Nama
              </th>
              <th scope="col" className="px-6 py-3">
                Nomor HP
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                  {contact.name}
                </th>
                <td className="px-6 py-4">
                  {contact.number}
                </td>
                <td className="px-6 py-4 flex justify-center space-x-2">
                  <button className="text-blue-500 hover:text-blue-700">
                    <FaEdit size={18} />
                  </button>
                  <button className="text-red-500 hover:text-red-700">
                    <FaTrash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManajemenHpPage;