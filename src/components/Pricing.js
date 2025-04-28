function Pricing() {
  return (
    <section className="py-20 bg-background-light dark:bg-background-dark">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12 text-text-light dark:text-text-dark">
          Fiyatlandırma
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-card-light dark:bg-card-dark p-8 rounded-xl shadow-soft dark:shadow-soft-dark hover:shadow-lg transition-shadow duration-300 text-center">
            <h3 className="text-2xl font-semibold mb-4 text-text-light dark:text-text-dark">Başlangıç</h3>
            <p className="text-3xl font-bold mb-4 text-text-light dark:text-text-dark">Ücretsiz</p>
            <ul className="text-muted-light dark:text-muted-dark mb-6 space-y-2">
              <li>Temel Dashboard Özellikleri</li>
              <li>Sınırlı Veri Depolama</li>
              <li>E-posta Desteği</li>
            </ul>
            <a
              href="/dashboard"
              className="bg-primary-light dark:bg-primary-dark text-white py-3 px-6 rounded-lg hover:bg-green-600 dark:hover:bg-purple-700 transition-colors duration-300 font-medium text-lg"
            >
              Ücretsiz Başla
            </a>
          </div>
          <div className="bg-card-light dark:bg-card-dark p-8 rounded-xl shadow-soft dark:shadow-soft-dark hover:shadow-lg transition-shadow duration-300 text-center">
            <h3 className="text-2xl font-semibold mb-4 text-text-light dark:text-text-dark">Pro</h3>
            <p className="text-3xl font-bold mb-4 text-text-light dark:text-text-dark">₺99/ay</p>
            <ul className="text-muted-light dark:text-muted-dark mb-6 space-y-2">
              <li>Tüm Dashboard Özellikleri</li>
              <li>Sınırsız Veri Depolama</li>
              <li>Öncelikli Destek</li>
            </ul>
            <a
              href="/dashboard"
              className="bg-primary-light dark:bg-primary-dark text-white py-3 px-6 rounded-lg hover:bg-green-600 dark:hover:bg-purple-700 transition-colors duration-300 font-medium text-lg"
            >
              Pro Satın Al
            </a>
          </div>
          <div className="bg-card-light dark:bg-card-dark p-8 rounded-xl shadow-soft dark:shadow-soft-dark hover:shadow-lg transition-shadow duration-300 text-center">
            <h3 className="text-2xl font-semibold mb-4 text-text-light dark:text-text-dark">Kurumsal</h3>
            <p className="text-3xl font-bold mb-4 text-text-light dark:text-text-dark">Özel Fiyat</p>
            <ul className="text-muted-light dark:text-muted-dark mb-6 space-y-2">
              <li>Özelleştirilmiş Çözümler</li>
              <li>Özel Veri Analitiği</li>
              <li>7/24 Destek</li>
            </ul>
            <a
              href="/dashboard"
              className="bg-primary-light dark:bg-primary-dark text-white py-3 px-6 rounded-lg hover:bg-green-600 dark:hover:bg-purple-700 transition-colors duration-300 font-medium text-lg"
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