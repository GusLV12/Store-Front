import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, FormControl, FormLabel, TextField, Typography } from '@mui/material';
import {  useState } from 'react';
import { IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import { useRequest } from '@/Hooks';
import { login as loginApi } from '@/api/login';

import { theme, ThemeLayout } from '../../Layouts';
import { useAuth } from '../../Context';
import { SuggestionPrompt } from '../../Components';
import { schemaLogin, defaultValues } from './validators/login';

export const Login = () => {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  // funciones password
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm({
    defaultValues,
    resolver: yupResolver(schemaLogin),
  });

  const { makeRequest } = useRequest(loginApi);

  const onSubmit = async (formData) => {

    console.log('Datos del formulario:', formData);
    const response = await makeRequest( formData);

    if (!response) {
      console.error('Error al iniciar sesión');
      return;
    }

    // login ya debe manejar setUser, localStorage y redirección
    login(response);
  };

  return (
    <ThemeLayout>
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-200 to-white dark:from-gray-900 dark:to-black">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <Typography variant="h4" className="text-center text-gray-900 dark:text-gray-100">
            Inicia sesión
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-4 flex flex-col gap-8">
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                {...register('email')}
                id="email"
                type="email"
                placeholder="your@email.com"
                autoComplete="email"
                autoFocus
                fullWidth
                error={!!errors.email}
                helperText={errors.email?.message}
                variant="outlined"
                InputProps={{ style: { color: '#ffff' } }}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                {...register('password')}
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••"
                autoComplete="current-password"
                fullWidth
                error={!!errors.password}
                helperText={errors.password?.message}
                variant="outlined"
                InputProps={{
                  style: { color: '#ffff' },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff sx={{ fill: 'white' }}/> : <Visibility sx={{ fill: 'white' }}/>}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </FormControl>

            <SuggestionPrompt cln="text-white" bgColor={theme.palette.secondary.main}>
              Ingresa con tu correo y contraseña de empleado.
            </SuggestionPrompt>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              onClick={handleSubmit(onSubmit)}
              disabled={isDirty && !isValid}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Ingresar
            </Button>

            <div className="text-center">
              <a href="/forgot-password" className="text-blue-600 hover:underline">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </form>
        </div>
      </div>
    </ThemeLayout>
  );
};
