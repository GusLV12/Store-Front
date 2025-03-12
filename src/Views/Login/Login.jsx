import { Button } from '@mui/material';

import { useAuth } from '../../Context';

export const Login = () => {
  const { login } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h2 className="text-2xl font-bold mb-4">Iniciar Sesión</h2>
      <Button variant="contained" color="primary" onClick={() => login('admin')}>
        Ingresar como Admin
      </Button>
      <Button variant="contained" color="secondary" onClick={() => login('user')} className="mt-2">
        Ingresar como Usuario
      </Button>
      <Button variant="contained" color="text" onClick={() => login('invited')} className="mt-2">
        Ingresar como invitado
      </Button>
    </div>
  );
};
