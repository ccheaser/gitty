function InfoSection() {
    return (
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Neden ProjeDemosu?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Kolay Kullanım</h3>
              <p className="text-gray-600 leading-relaxed">
                Kullanıcı dostu arayüz ile verilerinizi kolayca yönetin.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Hızlı ve Güvenilir</h3>
              <p className="text-gray-600 leading-relaxed">
                Verilerinize hızlı erişim, güvenli saklama.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Özelleştirilebilir</h3>
              <p className="text-gray-600 leading-relaxed">
                İhtiyaçlarınıza göre özelleştirilebilir dashboardlar.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  export default InfoSection;