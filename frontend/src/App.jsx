import { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout.jsx';
import AuthLayout from './layouts/AuthLayout.jsx';

// Components
import LoadingSpinner from './components/LoadingSpinner.jsx';

// Halaman (Lazy Loaded)
// Memperbaiki path import untuk memastikan konsistensi
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const RegisterPage = lazy(() => import('./pages/RegisterPage.jsx'));
const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'));
const ManajemenHpPage = lazy(() => import('./pages/ManajemenHpPage.jsx'));
const RisetPage = lazy(() => import('./pages/RisetPage.jsx')); // Pastikan path ini benar
const DistribusiLinkPage = lazy(() => import('./pages/DistribusiLinkPage.jsx'));
const ProfilePage = lazy(() => import('./pages/ProfilePage.jsx'));

// Icons
import { FaSun, FaMoon } from 'react-icons/fa';

function App() {
  const isAuthenticated = true;
  const [theme, setTheme] = useState('light');

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
      <button
        onClick={toggleTheme}
        className="fixed bottom-4 right-4 z-50 bg-gray-200 dark:bg-gray-700 p-2 rounded-full text-lg shadow-md"
      >
        {theme === 'light' ? <FaMoon /> : <FaSun />}
      </button>

      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route element={!isAuthenticated ? <AuthLayout /> : <Navigate to="/dashboard" />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          <Route element={isAuthenticated ? <MainLayout /> : <Navigate to="/login" />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/manajemen-hp" element={<ManajemenHpPage />} />
            <Route path="/riset" element={<RisetPage />} />
            <Route path="/distribusi-link" element={<DistribusiLinkPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
