function Pricing() {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Fiyatlandırma
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Başlangıç</h3>
              <p className="text-3xl font-bold mb-4 text-gray-900">Ücretsiz</p>
              <ul className="text-gray-600 mb-6 space-y-2">
                <li>Temel Dashboard Özellikleri</li>
                <li>Sınırlı Veri Depolama</li>
                <li>E-posta Desteği</li>
              </ul>
              <a
                href="/dashboard"
                className="bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition-colors duration-300 font-medium text-lg"
              >
                Ücretsiz Başla
              </a>
            </div>
            <div className="bg-gray-50 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Pro</h3>
              <p className="text-3xl font-bold mb-4 text-gray-900">₺99/ay</p>
              <ul className="text-gray-600 mb-6 space-y-2">
                <li>Tüm Dashboard Özellikleri</li>
                <li>Sınırsız Veri Depolama</li>
                <li>Öncelikli Destek</li>
              </ul>
              <a
                href="/dashboard"
                className="bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition-colors duration-300 font-medium text-lg"
              >
                Pro Satın Al
              </a>
            </div>
            <div className="bg-gray-50 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Kurumsal</h3>
              <p className="text-3xl font-bold mb-4 text-gray-900">Özel Fiyat</p>
              <ul className="text-gray-600 mb-6 space-y-2">
                <li>Özelleştirilmiş Çözümler</li>
                <li>Özel Veri Analitiği</li>
                <li>7/24 Destek</li>
              </ul>
              <a
                href="/dashboard"
                className="bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition-colors duration-300 font-medium text-lg"
              >
                Teklif Al
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  export default Pricing;