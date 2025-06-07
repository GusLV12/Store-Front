import { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { isTokenExpired } from '@/Utils/jwtDecode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken && !isTokenExpired(storedToken)) {
      return JSON.parse(storedUser);
    }

    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return null;
  });

  const navigate = useNavigate();

  // Función para iniciar sesión
  const login = ({ user, token }) => {

    isTokenExpired(token);
    setUser(user);

    localStorage.setItem('user', JSON.stringify(user, null, 2));
    localStorage.setItem('token', token);

    if (isTokenExpired(token)) {
      logout();
      return;
    }

  };

  // Función para cerrar sesión
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar el contexto
export const useAuth = () => useContext(AuthContext);
