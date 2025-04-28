import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function OfferPage() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <Navbar toggleSidebar={() => {}} isSidebarOpen={false} />
      <div className="pt-16 flex items-center justify-center min-h-screen">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl font-bold text-center text-text-light dark:text-text-dark mb-8">
            Teklif Al
          </h1>
          <div className="bg-card-light dark:bg-card-dark p-8 rounded-xl shadow-soft dark:shadow-soft-dark max-w-lg mx-auto">
            <p className="text-muted-light dark:text-muted-dark text-center">
              Teklif alma işlemi için lütfen bizimle iletişime geçin.
            </p>
            {/* Burada bir form veya başka bir içerik eklenebilir */}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default OfferPage;