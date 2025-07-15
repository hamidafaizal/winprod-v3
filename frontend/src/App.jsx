import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout.jsx';
import AuthLayout from './layouts/AuthLayout.jsx';

// Pages
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ManajemenHpPage from './pages/ManajemenHpPage.jsx';

// Icons
import { FaSun, FaMoon } from 'react-icons/fa';

// Komponen ini mendefinisikan rute-rute yang akan ditampilkan di dalam MainLayout.
// Kita ekspor agar bisa digunakan oleh MainLayout.jsx nanti.
export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/manajemen-hp" element={<ManajemenHpPage />} />
      {/* Jika tidak ada path yang cocok di dalam MainLayout, arahkan ke dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

function App() {
  // Simulasi status otentikasi, untuk sementara di-set true
  const isAuthenticated = true;

  // State untuk mengelola tema
  const [theme, setTheme] = useState('light');

  // useEffect untuk mengubah kelas pada elemen <html> saat tema berubah
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <>
      {/* Tombol ganti tema, sekarang di pojok kanan bawah */}
      <button
        onClick={toggleTheme}
        className="fixed bottom-4 right-4 z-50 bg-gray-200 dark:bg-gray-700 p-2 rounded-full text-lg shadow-md"
      >
        {theme === 'light' ? <FaMoon /> : <FaSun />}
      </button>

      {/* Konfigurasi routing utama aplikasi */}
      <Routes>
        {/* Rute untuk login dan register, hanya bisa diakses jika belum login */}
        <Route
          path="/login"
          element={!isAuthenticated ? <AuthLayout><LoginPage /></AuthLayout> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/register"
          element={!isAuthenticated ? <AuthLayout><RegisterPage /></AuthLayout> : <Navigate to="/dashboard" />}
        />

        {/* Rute utama, menampilkan MainLayout jika sudah login, atau arahkan ke login jika belum */}
        <Route
          path="/*"
          element={isAuthenticated ? <MainLayout /> : <Navigate to="/login" />}
        />
      </Routes>
    </>
  );
}

export default App;