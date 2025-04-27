function Footer() {
    return (
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-green-500">ProjeDemosu</h3>
              <p className="text-gray-400 leading-relaxed">
                Verimli ve modern bir dashboard çözümü sunuyoruz.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4 text-green-500">Hızlı Bağlantılar</h3>
              <ul className="space-y-3">
                <li>
                  <a href="/" className="hover:text-green-500 transition-colors duration-300 text-gray-400">
                    Ana Sayfa
                  </a>
                </li>
                <li>
                  <a href="/login" className="hover:text-green-500 transition-colors duration-300 text-gray-400">
                    Giriş
                  </a>
                </li>
                <li>
                  <a href="/dashboard" className="hover:text-green-500 transition-colors duration-300 text-gray-400">
                    Dashboard
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4 text-green-500">İletişim</h3>
              <p className="text-gray-400 leading-relaxed">E-posta: info@projedemosu.com</p>
              <p className="text-gray-400 leading-relaxed">Telefon: +90 123 456 7890</p>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-gray-400 hover:text-green-500 transition-colors duration-300">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.56v14.88A4.56 4.56 0 0 1 19.44 24H4.56A4.56 4.56 0 0 1 0 19.44V4.56A4.56 4.56 0 0 1 4.56 0h14.88A4.56 4.56 0 0 1 24 4.56zM8.47 19.44v-7.5H6.09V9.06h2.38V6.81c0-2.38 1.45-3.69 3.56-3.69 1.01 0 1.88.08 2.13.11v2.47h-1.47c-1.15 0-1.38.55-1.38 1.36v1.78h2.77l-.36 2.88h-2.41v7.5H8.47z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-green-500 transition-colors duration-300">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.99 4.69c-.88.39-1.83.65-2.83.77a4.92 4.92 0 0 0 2.16-2.72c-.95.56-2 .97-3.12 1.19a4.92 4.92 0 0 0-8.38 4.48A13.94 13.94 0 0 1 1.67 3.15a4.93 4.93 0 0 0 1.52 6.57 4.9 4.9 0 0 1-2.23-.62v.06a4.92 4.92 0 0 0 3.95 4.83 4.92 4.92 0 0 1-2.22.08 4.92 4.92 0 0 0 4.6 3.42A9.87 9.87 0 0 1 0 19.54a13.94 13.94 0 0 0 7.55 2.21c9.06 0 14.01-7.5 14.01-14.01 0-.21 0-.42-.02-.63a10.02 10.02 0 0 0 2.45-2.55z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-green-500 transition-colors duration-300">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.04c-5.5 0-9.96 4.46-9.96 9.96 0 4.4 3.58 8.04 8.04 8.88v-6.28H7.56v-2.6h2.52V9.92c0-2.5 1.5-3.88 3.78-3.88 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.62.78-1.62 1.58v1.92h2.76l-.44 2.6h-2.32v6.28c4.46-.84 8.04-4.48 8.04-8.88 0-5.5-4.46-9.96-9.96-9.96z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-4 text-center">
            <p className="text-gray-400">
              © 2025 ProjeDemosu. Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      </footer>
    );
  }
  
  export default Footer;