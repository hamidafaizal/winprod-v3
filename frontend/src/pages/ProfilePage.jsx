import React from 'react';

const ProfilePage = () => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Profil Saya</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-300">Di sini Anda dapat mengelola informasi profil Anda.</p>
      {/* Form untuk mengedit profil dapat ditambahkan di sini di masa mendatang */}
    </div>
  );
};

export default ProfilePage;
