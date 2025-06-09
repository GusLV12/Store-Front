import { Navigate } from 'react-router-dom';

import { isTokenExpired } from '@/Utils/jwtDecode';

import { useAuth } from '../AuthContext/AuthContext';

export const ProtectedRoute = ({ children, allowedRole }) => {
  const { user } = useAuth();
  const tokenApi = localStorage.getItem('token');
  console.log('Token desde ProtectedRoute:', tokenApi);

  // Usuario o token no lo encuentra, redirige a login
  if (!user) {
    console.log('Usuario no autenticado, redirigiendo a login');
    return <Navigate to="/login" replace />;
  }

  // Token está expirado, redirige a login
  if (isTokenExpired(tokenApi) || !tokenApi) {
    console.log('Token expirado, redirigiendo a login');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/login" replace />;
  }

  // Si el rol no está permitido, redirige al home (o a login si prefieres)
  if (allowedRole !== 'all' && !allowedRole.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // ✅ Si todo está bien, renderiza el contenido protegido
  return children;
};
