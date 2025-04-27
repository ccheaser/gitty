import { FaTable, FaList, FaChartBar, FaUserPlus, FaQrcode, FaWpforms } from 'react-icons/fa';
import whiteLogo from '../assets/images/Gitty_logo_white.png';

function Sidebar({ isOpen, toggleSidebar, activeTab, setActiveTab }) {
  return (
    <div
      className={`fixed top-0 left-0 w-64 bg-gray-900 text-white flex flex-col p-4 min-h-screen z-40 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 md:w-64 md:static md:min-h-screen md:transition-none shadow-lg`}
    >
      <div className="flex justify-end items-center mb-6">
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <button
        onClick={() => setActiveTab('table')}
        className={`flex items-center py-2 px-4 mb-2 rounded text-left ${
          activeTab === 'table' ? 'bg-green-500 text-white' : 'hover:bg-gray-700'
        } transition-colors duration-300`}
      >
        <FaTable className="mr-3" />
        Tablo
      </button>
      <button
        onClick={() => setActiveTab('list')}
        className={`flex items-center py-2 px-4 mb-2 rounded text-left ${
          activeTab === 'list' ? 'bg-green-500 text-white' : 'hover:bg-gray-700'
        } transition-colors duration-300`}
      >
        <FaList className="mr-3" />
        Liste
      </button>
      <button
        onClick={() => setActiveTab('chart')}
        className={`flex items-center py-2 px-4 mb-2 rounded text-left ${
          activeTab === 'chart' ? 'bg-green-500 text-white' : 'hover:bg-gray-700'
        } transition-colors duration-300`}
      >
        <FaChartBar className="mr-3" />
        Grafik
      </button>
      <button
        onClick={() => setActiveTab('add')}
        className={`flex items-center py-2 px-4 mb-2 rounded text-left ${
          activeTab === 'add' ? 'bg-green-500 text-white' : 'hover:bg-gray-700'
        } transition-colors duration-300`}
      >
        <FaUserPlus className="mr-3" />
        Yeni Katılımcı Ekle
      </button>
      <button
        onClick={() => setActiveTab('register')}
        className={`flex items-center py-2 px-4 mb-2 rounded text-left ${
          activeTab === 'register' ? 'bg-green-500 text-white' : 'hover:bg-gray-700'
        } transition-colors duration-300`}
      >
        <FaWpforms className="mr-3" />
        Katılım Formu
      </button>
      <button
        onClick={() => setActiveTab('qr')}
        className={`flex items-center py-2 px-4 mb-2 rounded text-left ${
          activeTab === 'qr' ? 'bg-green-500 text-white' : 'hover:bg-gray-700'
        } transition-colors duration-300`}
      >
        <FaQrcode className="mr-3" />
        QR Okut
      </button>
    </div>
  );
}

export default Sidebar;