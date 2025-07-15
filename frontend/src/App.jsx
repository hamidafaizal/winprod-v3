import { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout.jsx';
import AuthLayout from './layouts/AuthLayout.jsx';

// Components
import LoadingSpinner from './components/LoadingSpinner.jsx';

// Halaman (Lazy Loaded)
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const RegisterPage = lazy(() => import('./pages/RegisterPage.jsx'));
const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'));
const ManajemenHpPage = lazy(() => import('./pages/ManajemenHpPage.jsx'));
const RisetPage = lazy(() => import('./pages/RisetPage.jsx'));
const DistribusiLinkPage = lazy(() => import('./pages/DistribusiLinkPage.jsx'));
const ProfilePage = lazy(() => import('./pages/ProfilePage.jsx'));

// Icons
import { FaSun, FaMoon } from 'react-icons/fa';

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
      {/* Tombol ganti tema */}
      <button
        onClick={toggleTheme}
        className="fixed bottom-4 right-4 z-50 bg-gray-200 dark:bg-gray-700 p-2 rounded-full text-lg shadow-md"
      >
        {theme === 'light' ? <FaMoon /> : <FaSun />}
      </button>

      {/* Konfigurasi routing utama aplikasi */}
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Rute untuk halaman yang tidak memerlukan login */}
          <Route element={!isAuthenticated ? <AuthLayout /> : <Navigate to="/dashboard" />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Rute untuk halaman yang memerlukan login */}
          <Route element={isAuthenticated ? <MainLayout /> : <Navigate to="/login" />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/manajemen-hp" element={<ManajemenHpPage />} />
            <Route path="/riset" element={<RisetPage />} />
            <Route path="/distribusi-link" element={<DistribusiLinkPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            {/* Arahkan path root ke dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" />} />
            {/* Tangkap semua path lain dan arahkan ke dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
