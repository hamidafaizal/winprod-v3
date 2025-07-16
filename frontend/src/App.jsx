import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout.jsx';
import AuthLayout from './layouts/AuthLayout.jsx';

// Components
import LoadingSpinner from './components/LoadingSpinner.jsx';
import ThemeToggle from './components/ThemeToggle.jsx';
import PwaInstallButton from './components/PwaInstallButton.jsx';

// Halaman (Lazy Loaded)
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const RegisterPage = lazy(() => import('./pages/RegisterPage.jsx'));
const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'));
const ManajemenHpPage = lazy(() => import('./pages/ManajemenHpPage.jsx'));
const RisetPage = lazy(() => import('./pages/RisetPage.jsx'));
const DistribusiLinkPage = lazy(() => import('./pages/DistribusiLinkPage.jsx'));
const ProfilePage = lazy(() => import('./pages/ProfilePage.jsx'));
const ManajemenPwaPage = lazy(() => import('./pages/ManajemenPwaPage.jsx'));
// Menambahkan halaman PWA
const PwaAuthPage = lazy(() => import('./pages/PwaAuthPage.jsx'));
const PwaChatPage = lazy(() => import('./pages/PwaChatPage.jsx'));

// Komponen untuk rute yang dilindungi
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Komponen untuk rute otentikasi (login/register)
const AuthRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};


// Komponen utama yang menangani routing
function AppRoutes() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isPwaMode = window.matchMedia('(display-mode: standalone)').matches;
    
    if (isPwaMode) {
      // Logika untuk PWA yang terinstal
      const isPaired = !!localStorage.getItem('pwa_is_paired'); // Nanti kita buat logika ini lebih canggih
      
      if (isPaired && location.pathname !== '/pwa-chat') {
        navigate('/pwa-chat', { replace: true });
      } else if (!isPaired && location.pathname !== '/pwa-auth') {
        navigate('/pwa-auth', { replace: true });
      }
    }
  }, [navigate, location.pathname]);

  return (
    <Routes>
      {/* Rute khusus PWA */}
      <Route path="/pwa-auth" element={<PwaAuthPage />} />
      <Route path="/pwa-chat" element={<PwaChatPage />} />

      {/* Rute untuk aplikasi web utama */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<AuthRoute><LoginPage /></AuthRoute>} />
        <Route path="/register" element={<AuthRoute><RegisterPage /></AuthRoute>} />
      </Route>

      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/manajemen-hp" element={<ProtectedRoute><ManajemenHpPage /></ProtectedRoute>} />
        <Route path="/manajemen-pwa" element={<ProtectedRoute><ManajemenPwaPage /></ProtectedRoute>} />
        <Route path="/riset" element={<ProtectedRoute><RisetPage /></ProtectedRoute>} />
        <Route path="/distribusi-link" element={<ProtectedRoute><DistribusiLinkPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Route>
    </Routes>
  );
}


function App() {
  return (
    <>
      <ThemeToggle />
      <PwaInstallButton />
      <Suspense fallback={<LoadingSpinner />}>
        <AppRoutes />
      </Suspense>
    </>
  );
}

export default App;
