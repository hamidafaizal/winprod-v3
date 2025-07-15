import React from 'react';
import { FaWhatsapp, FaUser, FaLink } from 'react-icons/fa';

const BatchCard = ({ batch, contacts, onAssignContact, onSend, isSending }) => {
  const assignedContact = contacts.find(c => c.id === batch.assignedContactId);
  const availableContacts = contacts.filter(c => !batch.assignedContactId || c.id === batch.assignedContactId);

  const handleSend = () => {
    if (!assignedContact) {
      alert('Silakan tugaskan kontak ke batch ini terlebih dahulu.');
      return;
    }
    const message = `Halo ${assignedContact.name}, berikut adalah link produk untuk Anda:\n\n${batch.links.join('\n')}`;
    const whatsappUrl = `https://web.whatsapp.com/send?phone=${assignedContact.number}&text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
    onSend(batch.id);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex flex-col justify-between">
      <div>
        <h3 className="font-bold text-lg text-gray-800 dark:text-white">{batch.name.replace('Batch #', '')}</h3>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 space-y-2">
          <div className="flex items-center">
            <FaLink className="mr-2" />
            <span>{batch.links.length} / {batch.capacity} Link</span>
          </div>
          <div className="flex items-center">
            <FaUser className="mr-2" />
            <span>{assignedContact ? assignedContact.name : 'Belum ditugaskan'}</span>
          </div>
        </div>
        <div className="mt-4">
          <select
            value={batch.assignedContactId || ''}
            onChange={(e) => onAssignContact(batch.id, parseInt(e.target.value))}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm"
          >
            <option value="" disabled>Tugaskan ke Kontak</option>
            {contacts.map(contact => (
              <option key={contact.id} value={contact.id}>
                {contact.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-4">
        <button
          onClick={handleSend}
          disabled={!batch.assignedContactId || batch.links.length === 0 || isSending}
          className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <FaWhatsapp className="mr-2" />
          {isSending ? 'Mengirim...' : 'Kirim via WA'}
        </button>
      </div>
    </div>
  );
};

export default BatchCard;
