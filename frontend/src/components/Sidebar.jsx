import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaMobileAlt, 
  FaChevronLeft, 
  FaUserCircle, 
  FaSignOutAlt, 
  FaBars, 
  FaTimes,
  FaFlask,
  FaLink,
  FaIdCard
} from 'react-icons/fa';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    { icon: <FaTachometerAlt />, text: 'Dashboard', to: '/dashboard' },
    { icon: <FaMobileAlt />, text: 'Manajemen HP', to: '/manajemen-hp' },
    { icon: <FaFlask />, text: 'Riset', to: '/riset' },
    { icon: <FaLink />, text: 'Distribusi Link', to: '/distribusi-link' },
  ];

  const activeLinkClass = 'bg-blue-500 text-white';
  const inactiveLinkClass = 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700';

  return (
    <>
      {/* Tombol Menu Mobile */}
      <button 
        className="md:hidden fixed top-4 left-4 z-30 p-2 bg-white dark:bg-gray-800 rounded-md"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Overlay untuk Mobile */}
      {isMobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black opacity-50 z-10" 
          onClick={() => setIsMobileOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:relative flex flex-col bg-white dark:bg-gray-800 shadow-xl transition-all duration-300 ease-in-out z-20 ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 min-h-screen`}
      >
        {/* Header */}
        <div className="flex items-center p-4">
          <h1 className={`text-xl font-bold text-gray-800 dark:text-white overflow-hidden transition-all duration-300 ease-in-out ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
            WinProd
          </h1>
          <div className="flex-grow" />
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 hidden md:block"
          >
            <FaChevronLeft className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : 'rotate-0'}`} />
          </button>
        </div>

        {/* Navigasi */}
        <nav className="flex-1 px-2 space-y-2">
          {navItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.to}
              onClick={() => isMobileOpen && setIsMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg ${isActive ? activeLinkClass : inactiveLinkClass} ${
                  isCollapsed ? 'justify-center' : 'space-x-3'
                }`
              }
            >
              <span className="text-xl">{item.icon}</span>
              <span className={`overflow-hidden whitespace-nowrap transition-all duration-200 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                {item.text}
              </span>
            </NavLink>
          ))}
        </nav>

        {/* Footer Profil */}
        <div className="p-2 border-t border-gray-200 dark:border-gray-700 relative">
          {/* Popup Profil */}
          {isProfileOpen && (
            <div
              className={`absolute bottom-full mb-2 bg-white dark:bg-gray-700 rounded-lg shadow-lg p-2 transition-all duration-300 ${
                isCollapsed ? 'left-0 w-48' : 'w-full'
              }`}
            >
              <Link
                to="/profile"
                onClick={() => setIsProfileOpen(false)}
                className="w-full flex items-center space-x-2 p-2 text-sm text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md"
              >
                <FaIdCard />
                <span>Profil Saya</span>
              </Link>
              <Link
                to="/login"
                className="w-full flex items-center space-x-2 p-2 text-sm text-red-500 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </Link>
            </div>
          )}

          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={`w-full flex items-center p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 ${
              isCollapsed ? 'justify-center' : 'space-x-3'
            }`}
          >
            <FaUserCircle className="text-2xl text-gray-500" />
            <div className={`text-left overflow-hidden whitespace-nowrap transition-all duration-200 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
              <p className="text-sm font-semibold text-gray-800 dark:text-white">Hamida Dev</p>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
