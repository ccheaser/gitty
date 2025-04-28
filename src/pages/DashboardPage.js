import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import AirtableData from '../components/AirtableData';
import AirtableList from '../components/AirtableList';
import AirtableChart from '../components/AirtableChart';
import AddParticipant from '../components/AddParticipant';
import RegisterForm from '../components/RegisterForm';
import QrReader from '../components/QrReader';
import LogsPage from './LogsPage';

function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('table');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Simüle edilmiş yükleme
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-background-dark">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 dark:border-primary-dark"></div>
          <p className="mt-4 text-gray-600 dark:text-muted-dark">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-background-dark">
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 overflow-hidden pt-16"> {/* pt-16 eklendi - navbar için boşluk */}
        <Sidebar 
          isOpen={isSidebarOpen} 
          setActiveTab={setActiveTab}
          activeTab={activeTab}
        />
        <div className="flex-1 overflow-x-hidden">
          <div className="p-6"> {/* py-6 yerine p-6 kullanıldı */}
            {activeTab === 'table' && <AirtableData />}
            {activeTab === 'list' && <AirtableList />}
            {activeTab === 'chart' && <AirtableChart />}
            {activeTab === 'add' && <AddParticipant />}
            {activeTab === 'register' && <RegisterForm />}
            {activeTab === 'qr' && <QrReader />}
            {activeTab === 'logs' && <LogsPage />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;