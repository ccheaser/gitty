import { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Statik giriş bilgileri
  const login = (email, password) => {
    // Demo kullanıcı bilgileri
    if (email === "admin@gitty.com.tr" && password === "123456") {
      setUser({ email, name: "Admin User" });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);