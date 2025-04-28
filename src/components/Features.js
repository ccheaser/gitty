import React from 'react';
import { motion } from 'framer-motion';
import { FaWhatsapp, FaSms, FaEnvelope, FaPhone, FaBell, FaChartBar, FaUsers, FaHeadset } from 'react-icons/fa';

function Features() {
  const features = [
    {
      icon: <div className="flex space-x-2"><FaWhatsapp/><FaSms/><FaEnvelope/><FaPhone/></div>,
      title: "Çoklu Kanal İletişim",
      description: "WhatsApp, SMS, e-posta, sesli arama ile entegre iletişim"
    },
    {
      icon: <FaBell />,
      title: "Otomatik Hatırlatmalar",
      description: "Zamanlanmış bildirimler ve hatırlatmalar"
    },
    {
      icon: <FaChartBar />,
      title: "Detaylı Analizler",
      description: "Katılım oranları ve iletişim performansı takibi"
    },
    {
      icon: <FaUsers />,
      title: "Kolay Yönetim",
      description: "Tek platformda tüm iletişim süreçleri"
    },
    {
      icon: <FaHeadset />,
      title: "7/24 Destek",
      description: "Sürekli teknik destek ve danışmanlık"
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-20 bg-card-light dark:bg-card-dark relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-text-light dark:text-text-dark mb-4">
            Özellikler
          </h2>
          <div className="w-24 h-1 bg-primary-light dark:bg-primary-dark mx-auto rounded-full"></div>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          {/* Üst Satır: 3 Kart */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 justify-items-center"
          >
            {features.slice(0, 3).map((feature, index) => (
              <motion.div
                key={index}
                variants={item}
                className="group p-6 bg-background-light dark:bg-background-dark rounded-xl shadow-soft dark:shadow-soft-dark transition-all duration-300 hover:scale-105 w-full max-w-sm"
              >
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-primary-light/10 dark:bg-primary-dark/10 flex items-center justify-center text-primary-light dark:text-primary-dark group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-text-light dark:text-text-dark text-center">
                  {feature.title}
                </h3>
                <p className="text-muted-light dark:text-muted-dark text-center">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Alt Satır: 2 Kart */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center"
          >
            {features.slice(3, 5).map((feature, index) => (
              <motion.div
                key={index}
                variants={item}
                className="group p-6 bg-background-light dark:bg-background-dark rounded-xl shadow-soft dark:shadow-soft-dark transition-all duration-300 hover:scale-105 w-full max-w-sm"
              >
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-primary-light/10 dark:bg-primary-dark/10 flex items-center justify-center text-primary-light dark:text-primary-dark group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-text-light dark:text-text-dark text-center">
                  {feature.title}
                </h3>
                <p className="text-muted-light dark:text-muted-dark text-center">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Features;