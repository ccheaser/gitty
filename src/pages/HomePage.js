import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import InfoSection from '../components/InfoSection';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import Pricing from '../components/Pricing';
import Footer from '../components/Footer';

function HomePage() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <Navbar toggleSidebar={() => {}} isSidebarOpen={false} />
      <main className="pt-16">
        <Hero />
        <InfoSection />
        <Features />
        <HowItWorks />
        <Pricing />
      </main>
    </div>
  );
}

export default HomePage;