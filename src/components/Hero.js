import { motion } from 'framer-motion';
import phoneMockup from '../assets/images/gitty-mockup.png'; // Mockup dosyasını import et

function Hero() {
  // Telefon için animasyon ayarları
  const phoneVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0, transition: { duration: 1, ease: 'easeOut' } },
  };

  // Başlık için animasyon ayarları
  const textVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0, transition: { duration: 1, ease: 'easeOut', delay: 0.3 } },
  };

  return (
    <section className="bg-green-600 text-white py-20 min-h-screen flex items-center">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        {/* Telefon Mockup */}
        <motion.div
          className="w-full md:w-1/2 mb-10 md:mb-0"
          initial="hidden"
          animate="visible"
          variants={phoneVariants}
        >
          <img
            src={phoneMockup}
            alt="Phone Mockup"
            className="w-3/4 mx-auto md:w-full max-w-md"
          />
        </motion.div>

        {/* Başlık ve Metin */}
        <motion.div
          className="w-full md:w-1/2 text-center md:text-left"
          initial="hidden"
          animate="visible"
          variants={textVariants}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
            Demo Sayfasına Hoşgeldiniz.
          </h1>
          <p className="text-xl mb-8">
            Verilerinizi yönetmek için modern ve güçlü bir dashboard çözümü.
          </p>
          <a
            href="/dashboard"
            className="bg-white text-green-600 py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors duration-300 font-medium text-lg"
          >
            Dashboard'a Git
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;