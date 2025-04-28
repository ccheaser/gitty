import React from 'react';

function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Etkinliğinizi tanımlayın",
      description: "Davet adı, tarih ve detayları girin."
    },
    {
      number: "2",
      title: "Kişi listenizi yükleyin",
      description: "İletişim bilgileriyle birlikte katılımcı listesini ekleyin."
    },
    {
      number: "3",
      title: "Mesaj türünü seçin",
      description: "WhatsApp, SMS, e-posta veya arama ile gönderim yapın."
    },
    {
      number: "4",
      title: "Zamanlayın ve gönderin",
      description: "Gitty mesajları otomatik olarak iletir."
    },
    {
      number: "5",
      title: "Takip edin",
      description: "Kim daveti aldı, kim yanıtladı, anlık olarak görün."
    }
  ];

  return (
    <section className="py-16 bg-background-light dark:bg-background-dark">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-text-light dark:text-text-dark">
          Nasıl Çalışır?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary-light dark:bg-primary-dark text-white flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-text-light dark:text-text-dark">
                {step.title}
              </h3>
              <p className="text-muted-light dark:text-muted-dark">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;