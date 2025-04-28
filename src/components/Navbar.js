import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';
import { logAction } from '../utils/logAction';
import logo from '../assets/images/Gitty_logo_dark.png';

function Navbar({ toggleSidebar }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await logAction('logout', { email: user?.email || 'unknown' });
      await logout();
    } catch (err) {
      console.error('Çıkış yaparken hata oluştu:', err);
    }
  };

  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <nav className="fixed top-0 left-0 w-full bg-card-light dark:bg-card-dark shadow-soft dark:shadow-soft-dark z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {isDashboard && (
            <button
              onClick={toggleSidebar}
              className="text-text-light dark:text-text-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors duration-300"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          )}
          <Link to="/">
            <img src={logo} alt="Logo" className="h-10 w-auto" />
          </Link>
        </div>

        <div className="hidden md:flex space-x-6 items-center">
          <Link
            to="/"
            className="text-text-light dark:text-text-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors duration-300 font-medium"
          >
            Anasayfa
          </Link>
          <Link
            to="/hakkimda"
            className="text-text-light dark:text-text-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors duration-300 font-medium"
          >
            Hakkımda
          </Link>
          {isDashboard ? (
            user && (
              <button
                onClick={handleLogout}
                className="bg-primary-light dark:bg-primary-dark text-white px-4 py-2 rounded-lg hover:bg-green-600 dark:hover:bg-purple-700 transition-colors duration-300 font-medium"
              >
                Çıkış Yap
              </button>
            )
          ) : (
            <>
              <Link
                to="/login"
                className="bg-primary-light dark:bg-primary-dark text-white px-4 py-2 rounded-lg hover:bg-green-600 dark:hover:bg-purple-700 transition-colors duration-300 font-medium"
              >
                Giriş Yap
              </Link>
              <Link
                to="/teklif-al"
                className="bg-secondary-light dark:bg-secondary-dark text-white px-4 py-2 rounded-lg hover:bg-orange-600 dark:hover:bg-orange-700 transition-colors duration-300 font-medium"
              >
                Teklif Al
              </Link>
            </>
          )}
          <button
            onClick={toggleTheme}
            className="text-text-light dark:text-text-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors duration-300"
          >
            {theme === 'dark' ? <FaSun size={20} /> : <FaMoon size={20} />}
          </button>
        </div>

        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-text-light dark:text-text-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors duration-300"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-card-light dark:bg-card-dark shadow-soft dark:shadow-soft-dark">
          <Link
            to="/"
            className="block px-4 py-2 text-text-light dark:text-text-dark hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
            onClick={toggleMenu}
          >
            Anasayfa
          </Link>
          <Link
            to="/hakkimda"
            className="block px-4 py-2 text-text-light dark:text-text-dark hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
            onClick={toggleMenu}
          >
            Hakkımda
          </Link>
          {isDashboard ? (
            user && (
              <button
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                className="block w-full text-left px-4 py-2 text-white bg-primary-light dark:bg-primary-dark hover:bg-green-600 dark:hover:bg-purple-700 transition-colors duration-300"
              >
                Çıkış Yap
              </button>
            )
          ) : (
            <>
              <Link
                to="/login"
                className="block px-4 py-2 text-white bg-primary-light dark:bg-primary-dark hover:bg-green-600 dark:hover:bg-purple-700 transition-colors duration-300"
                onClick={toggleMenu}
              >
                Giriş Yap
              </Link>
              <Link
                to="/teklif-al"
                className="block px-4 py-2 text-white bg-secondary-light dark:bg-secondary-dark hover:bg-orange-600 dark:hover:bg-orange-700 transition-colors duration-300"
                onClick={toggleMenu}
              >
                Teklif Al
              </Link>
            </>
          )}
          <button
            onClick={() => {
              toggleTheme();
              toggleMenu();
            }}
            className="block w-full text-left px-4 py-2 text-text-light dark:text-text-dark hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300 flex items-center space-x-2"
          >
            {theme === 'dark' ? <FaSun size={20} /> : <FaMoon size={20} />}
            <span>{theme === 'dark' ? 'Açık Mod' : 'Koyu Mod'}</span>
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;