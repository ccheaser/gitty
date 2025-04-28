import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import mockupImage from '../assets/images/gitty-mockup.png';

function Hero() {
  return (
    <section className="relative overflow-hidden py-20 bg-background-light dark:bg-background-dark">
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary-light/20 dark:bg-primary-dark/20 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-secondary-light/20 dark:bg-secondary-dark/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark">
              Etkinlik iletişimi artık çok daha kolay
            </h1>
            <p className="text-xl mb-8 text-muted-light dark:text-muted-dark">
              Gitty ile iletişiminizi otomatikleştirin
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/teklif-al" className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-medium rounded-lg bg-primary-light dark:bg-primary-dark text-white">
                  <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform translate-x-0 -skew-x-12 bg-white/20 group-hover:translate-x-full"></span>
                  Demo Talep Et
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <a href="#nasil-calisir" className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-medium rounded-lg bg-secondary-light dark:bg-secondary-dark text-white">
                  <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform translate-x-0 -skew-x-12 bg-white/20 group-hover:translate-x-full"></span>
                  Nasıl Çalışır?
                </a>
              </motion.div>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="animate-float">
              <img
                src={mockupImage}
                alt="Gitty Uygulama Mockup"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;