import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import whiteLogo from '../assets/images/Gitty_logo_white.png';
import darkLogo from '../assets/images/Gitty_logo_dark.png';

function Navbar({ toggleSidebar, isSidebarOpen }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const isDashboard = location.pathname === '/dashboard';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-900 text-white z-50 shadow-lg">
      <div className="flex justify-between items-center px-4 py-3 md:px-6">
        <div className="flex items-center space-x-4">
          {isDashboard && (
            <button
              onClick={toggleSidebar}
              className="md:hidden text-white focus:outline-none"
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
                  d={isSidebarOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                />
              </svg>
            </button>
          )}
          <Link to="/" className="flex items-center">
            <img
              src={whiteLogo}
              alt="Gitty Logo"
              className="h-8 w-auto"
            />
          </Link>
        </div>

        {isDashboard ? (
          <div className="flex items-center">
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors duration-300"
            >
              Çıkış Yap
            </button>
          </div>
        ) : (
          <>
            <div className="hidden md:flex space-x-6">
              <Link
                to="/"
                className="text-white hover:text-green-500 transition-colors duration-300 font-medium text-lg"
              >
                Anasayfa
              </Link>
              <Link
                to="/about"
                className="text-white hover:text-green-500 transition-colors duration-300 font-medium text-lg"
              >
                Hakkımda
              </Link>
              <Link
                to="/services"
                className="text-white hover:text-green-500 transition-colors duration-300 font-medium text-lg"
              >
                Hizmetler
              </Link>
              <Link
                to="/contact"
                className="text-white hover:text-green-500 transition-colors duration-300 font-medium text-lg"
              >
                İletişim
              </Link>
            </div>

            <div className="hidden md:flex space-x-4">
              <Link
                to="/login"
                className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors duration-300 font-medium text-lg"
              >
                Giriş Yap
              </Link>
              <Link
                to="/quote"
                className="bg-white text-green-600 py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors duration-300 font-medium text-lg"
              >
                Teklif Al
              </Link>
            </div>
          </>
        )}

        {!isDashboard && (
          <button
            onClick={handleMenuToggle}
            className="md:hidden text-white focus:outline-none"
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
                d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>
        )}
      </div>

      {!isDashboard && isMenuOpen && (
        <div className="md:hidden bg-gray-900 text-white px-4 py-2">
          <Link
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className="block py-2 text-white hover:text-green-500 transition-colors duration-300 font-medium text-lg"
          >
            Anasayfa
          </Link>
          <Link
            to="/about"
            onClick={() => setIsMenuOpen(false)}
            className="block py-2 text-white hover:text-green-500 transition-colors duration-300 font-medium text-lg"
          >
            Hakkımda
          </Link>
          <Link
            to="/services"
            onClick={() => setIsMenuOpen(false)}
            className="block py-2 text-white hover:text-green-500 transition-colors duration-300 font-medium text-lg"
          >
            Hizmetler
          </Link>
          <Link
            to="/contact"
            onClick={() => setIsMenuOpen(false)}
            className="block py-2 text-white hover:text-green-500 transition-colors duration-300 font-medium text-lg"
          >
            İletişim
          </Link>
          <Link
            to="/login"
            onClick={() => setIsMenuOpen(false)}
            className="block py-2 bg-green-500 text-white text-center rounded-lg hover:bg-green-600 transition-colors duration-300 font-medium text-lg mt-2"
          >
            Giriş Yap
          </Link>
          <Link
            to="/quote"
            onClick={() => setIsMenuOpen(false)}
            className="block py-2 bg-white text-green-600 text-center rounded-lg hover:bg-gray-100 transition-colors duration-300 font-medium text-lg mt-2"
          >
            Teklif Al
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;