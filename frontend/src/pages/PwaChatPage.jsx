import React from 'react';
import { FaCopy, FaTrash } from 'react-icons/fa';

// Halaman ini adalah placeholder untuk tampilan "chat" di PWA.
const PwaChatPage = () => {
  // Data dummy untuk sementara
  const links = [
    { id: 1, url: 'https://shopee.co.id/product/12345' },
    { id: 2, url: 'https://tokopedia.com/product/67890' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      <header className="bg-white dark:bg-gray-800 p-4 shadow-md">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white text-center">
          Link Produk
        </h1>
      </header>
      
      <main className="flex-1 p-4 space-y-4">
        {links.map((link) => (
          <div key={link.id} className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow flex items-center justify-between">
            <p className="text-gray-800 dark:text-gray-200 truncate mr-4">{link.url}</p>
            <div className="flex space-x-3">
              <button className="text-blue-500 hover:text-blue-700">
                <FaCopy size={18} />
              </button>
              <button className="text-red-500 hover:text-red-700">
                <FaTrash size={18} />
              </button>
            </div>
          </div>
        ))}
         {links.length === 0 && (
            <div className="text-center text-gray-500 dark:text-gray-400 pt-10">
                Tidak ada link baru.
            </div>
        )}
      </main>
    </div>
  );
};

export default PwaChatPage;
