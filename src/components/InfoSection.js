function InfoSection() {
  return (
    <section className="py-20 bg-background-light dark:bg-background-dark">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12 text-text-light dark:text-text-dark">
          Neden Gitty?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-card-light dark:bg-card-dark p-8 rounded-xl shadow-soft dark:shadow-soft-dark hover:shadow-lg transition-shadow duration-300 text-center">
            <h3 className="text-2xl font-semibold mb-4 text-text-light dark:text-text-dark">Kolay Kullanım</h3>
            <p className="text-muted-light dark:text-muted-dark leading-relaxed">
              Kullanıcı dostu arayüz ile verilerinizi kolayca yönetin.
            </p>
          </div>
          <div className="bg-card-light dark:bg-card-dark p-8 rounded-xl shadow-soft dark:shadow-soft-dark hover:shadow-lg transition-shadow duration-300 text-center">
            <h3 className="text-2xl font-semibold mb-4 text-text-light dark:text-text-dark">Hızlı ve Güvenilir</h3>
            <p className="text-muted-light dark:text-muted-dark leading-relaxed">
              Verilerinize hızlı erişim, güvenli saklama.
            </p>
          </div>
          <div className="bg-card-light dark:bg-card-dark p-8 rounded-xl shadow-soft dark:shadow-soft-dark hover:shadow-lg transition-shadow duration-300 text-center">
            <h3 className="text-2xl font-semibold mb-4 text-text-light dark:text-text-dark">Özelleştirilebilir</h3>
            <p className="text-muted-light dark:text-muted-dark leading-relaxed">
              İhtiyaçlarınıza göre özelleştirilebilir dashboardlar.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default InfoSection;