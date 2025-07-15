import React from 'react';
import Sidebar from '../components/Sidebar.jsx';
import { Outlet } from 'react-router-dom';

console.log("Log: MainLayout.jsx script loaded."); // LOG 4

const MainLayout = () => {
  console.log("Log: MainLayout component rendering..."); // LOG 5
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
