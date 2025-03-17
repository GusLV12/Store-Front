import { useState } from 'react';
import { Button, Checkbox, FormControl, FormLabel, TextField, Typography } from '@mui/material';

import { ThemeLayout } from '../../Layouts';
import { useAuth } from '../../Context';

export const Login = () => {
  const { login } = useAuth();
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (emailError || passwordError) return;

    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  return (
    <ThemeLayout>
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-200 to-white dark:from-gray-900 dark:to-black">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <Typography variant="h4" className="text-center text-gray-900 dark:text-gray-100">
            Inicia sesion
          </Typography>
          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-8">
            <FormControl>
              <TextField
                id="email"
                type="email"
                name="email"
                label="Correo"
                placeholder="your@email.com"
                fullWidth
                variant="outlined"
                error={emailError}
                helperText={emailErrorMessage}
                className="rounded-full"
              />
            </FormControl>
            <FormControl>
              <TextField
                id="password"
                type="password"
                name="password"
                label="Contraseña"
                placeholder="••••••"
                fullWidth
                variant="outlined"
                error={passwordError}
                helperText={passwordErrorMessage}
                className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </FormControl>
            <div className="flex items-center justify-items-start gap-2">
              <Checkbox color="primary" className="text-primary" />
              <Typography color="text">Remember me</Typography>
            </div>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => login('admin')}
            >
              Ingresar
            </Button>
            <div className="text-center">
              <a href="/forgot-password" className="text-blue-600 hover:underline">
                Forgot your password?
              </a>
            </div>
          </form>
        </div>
      </div>
    </ThemeLayout>
  );
};
