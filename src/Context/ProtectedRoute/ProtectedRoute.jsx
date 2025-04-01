import { Navigate } from 'react-router-dom';

import { useAuth } from '../AuthContext/AuthContext';

export const ProtectedRoute = ({ children, allowedRole = 'all' }) => {
  const { user } = useAuth();

  if(allowedRole === 'all'){
    return children;
  }
  // Si no está autenticado, redirigir a login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si no tiene permiso, redirigir a home
  if (!allowedRole.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  // Si el usuario tiene el rol correcto, mostrar la vista
  return children;
};
