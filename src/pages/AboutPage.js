import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function AboutPage() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <Navbar toggleSidebar={() => {}} isSidebarOpen={false} />
      <div className="pt-16">
        <div className="container mx-auto py-20 px-6">
          <h1 className="text-4xl font-bold text-center text-text-light dark:text-text-dark mb-8">
            Hakkımızda
          </h1>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg text-muted-light dark:text-muted-dark mb-6">
              Gitty, etkinlik yönetimini kolaylaştırmak için tasarlanmış modern bir platformdur. Amacımız, organizatörlerin etkinliklerini daha verimli bir şekilde yönetmelerine olanak tanımak ve katılımcıların deneyimini en üst düzeye çıkarmaktır.
            </p>
            <p className="text-lg text-muted-light dark:text-muted-dark mb-6">
              2025 yılında kurulan Gitty, kullanıcı dostu arayüzü, güçlü veri analitiği ve iletişim araçlarıyla etkinlik yönetiminde yeni bir standart belirliyor. Ekibimiz, teknoloji ve organizasyon alanındaki uzmanlığını birleştirerek her türlü etkinlik için en iyi çözümleri sunmayı hedefliyor.
            </p>
            <div className="mt-8">
              <a
                href="/contact"
                className="bg-primary-light dark:bg-primary-dark text-white py-3 px-6 rounded-lg hover:bg-green-600 dark:hover:bg-purple-700 transition-colors duration-300 font-medium text-lg"
              >
                Bizimle İletişime Geçin
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;