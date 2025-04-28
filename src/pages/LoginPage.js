import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logAction } from '../utils/logAction';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import loginMockup from '../assets/images/gitty-mockup.png';

function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        await login(email, password);
        await logAction('login', { email });
      } else {
        await signup(email, password);
        await logAction('signup', { email });
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <Navbar toggleSidebar={() => {}} isSidebarOpen={false} />
      <div className="pt-16 flex items-center justify-center min-h-screen">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <div className="w-full md:w-1/2 mb-10 md:mb-0 hidden md:block">
            <img
              src={loginMockup}
              alt="Login Mockup"
              className="w-3/4 mx-auto md:w-full max-w-md"
            />
          </div>

          <div className="w-full md:w-1/2 max-w-md">
            <div className="bg-card-light dark:bg-card-dark p-8 rounded-xl shadow-soft dark:shadow-soft-dark">
              <h2 className="text-3xl font-bold text-center mb-6 text-text-light dark:text-text-dark">
                {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
              </h2>
              {error && <p className="text-red-600 dark:text-red-400 mb-4 text-center">{error}</p>}
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-muted-light dark:text-muted-dark mb-2" htmlFor="email">
                    E-posta
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark bg-card-light dark:bg-card-dark text-text-light dark:text-text-dark transition-colors duration-300"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-muted-light dark:text-muted-dark mb-2" htmlFor="password">
                    Şifre
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark bg-card-light dark:bg-card-dark text-text-light dark:text-text-dark transition-colors duration-300"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary-light dark:bg-primary-dark text-white py-3 rounded-lg hover:bg-green-600 dark:hover:bg-purple-700 transition-colors duration-300 font-medium"
                >
                  {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
                </button>
              </form>
              <p className="text-center text-muted-light dark:text-muted-dark mt-4">
                {isLogin ? "Hesabınız yok mu? " : "Zaten hesabınız var mı? "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary-light dark:text-primary-dark hover:underline font-medium"
                >
                  {isLogin ? 'Kayıt Ol' : 'Giriş Yap'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default LoginPage;