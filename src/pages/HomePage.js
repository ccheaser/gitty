import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import InfoSection from '../components/InfoSection';
import Pricing from '../components/Pricing';
import Footer from '../components/Footer';
import { useLocation } from 'react-router-dom';

function HomePage() {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar toggleSidebar={() => {}} isSidebarOpen={false} />
      <div className={isDashboard ? 'md:ml-64' : ''}>
        <Hero />
        <InfoSection />
        <Pricing />
        <Footer />
      </div>
    </div>
  );
}

export default HomePage;