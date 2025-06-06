import Navbar from '../components/Navbar';

function ServicesPage() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar toggleSidebar={() => {}} isSidebarOpen={false} />
      <div className="pt-16">
        <div className="container mx-auto py-20 px-4">
          <h1 className="text-4xl font-bold text-center text-gray-900">Hizmetler</h1>
          <p className="text-lg text-gray-600 mt-4 text-center">
            Burası hizmetler sayfası. Daha sonra içerik eklenecek.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ServicesPage;