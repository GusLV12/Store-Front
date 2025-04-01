import { useState } from 'react';
import { Button, Checkbox, FormControl, FormLabel, TextField, Typography } from '@mui/material';

import { theme, ThemeLayout } from '../../Layouts';
import { useAuth } from '../../Context';
import { SuggestionPrompt } from '../../Components';

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
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                error={emailError}
                helperText={emailErrorMessage}
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
                InputProps={{ style: { color: '#ffff' } }}
                color={emailError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                autoFocus
                required
                fullWidth
                variant="outlined"
                InputProps={{ style: { color: '#ffff' } }}
                color={passwordError ? 'error' : 'primary'}
              />
            </FormControl>

            <SuggestionPrompt cln="text-white" bgColor={theme.palette.secondary.main}>Ingresa con tu correo y contraseña de empleado.</SuggestionPrompt>

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
