import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  TextField,
  Typography,
  Autocomplete,
  Switch,
  FormControlLabel,
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { useRequest } from '@/Hooks';

import {createUser, updateUser} from '@/api/user'
import { schemaUser, defaultValues } from './validators/validations';

export function CreateCount() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [formKey, setFormKey] = useState(Date.now());
  const dataRoles = ["admin", "user", "client"]

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, dirtyFields },
    reset,
  } = useForm({
    defaultValues: { ...defaultValues },
    resolver: yupResolver(schemaUser),
    mode: 'onChange',
  });

  // Si tienes la función, descomenta para crear usuario en la API real:
  const { makeRequest: tryCreateUser } = useRequest(createUser);

  // --- SUBMIT global ---
  const onSubmit = async (data) => {
    setSubmitting(true);
    console.log('Datos del formulario:', data);
    try {
      // Arma data final (ajusta nombres según tu backend)
      const userToSend = {
        ...data,
      };

      // 4. Aquí puedes guardar en la API real:
      await tryCreateUser(userToSend);

      alert(`Producto creado:\n${JSON.stringify(userToSend, null, 2)}`);
      reset({
        ...defaultValues,
      });
      setFormKey(Date.now());
    } catch (err) {
      alert('Error al crear el usuario');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewRoute = () => {
    navigate('/counts');
  };

  return (
    <Box
      sx={{
        bgcolor: '#f6f8fb',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          borderRadius: 5,
          px: { xs: 2, md: 6 },
          py: { xs: 3, md: 5 },
          minWidth: { xs: 300, md: 420 },
          maxWidth: 540,
          width: '100%',
        }}
      >
        <Typography
          variant="h4"
          align="center"
          sx={{
            fontWeight: 700,
            color: '#22223B',
            mb: 4,
            letterSpacing: 1,
          }}
        >
          Crear usuario
        </Typography>
        <form key={formKey} onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          {/* Nombre de usuario */}
          <Box mb={2}>
            <Typography variant="subtitle1" fontWeight={500} mb={0.5}>
              Nombre de usuario *
            </Typography>
            <TextField
              fullWidth
              {...control.register('username')}
              placeholder="Nombre de usuario"
              error={!!errors.username}
              helperText={errors?.username?.message}
              variant="outlined"
              sx={{ borderRadius: 2 }}
            />
          </Box>
          {/* Correo Electrónico */}
          <Box mb={2}>
            <Typography variant="subtitle1" fontWeight={500} mb={0.5}>
              Correo Electrónico
            </Typography>
            <TextField
              fullWidth
              {...control.register('email')}
              placeholder="Correo Electrónico"
              error={!!errors.email}
              helperText={errors?.email?.message}
              variant="outlined"
              sx={{ borderRadius: 2 }}
            />
          </Box>
           {/* contraseña */}
          <Box mb={2}>
            <Typography variant="subtitle1" fontWeight={500} mb={0.5}>
              Contraseña
            </Typography>
            <TextField
              fullWidth
              type="password"
              {...control.register('password')}
              placeholder="contraseña"
              error={!!errors.password}
              helperText={errors?.password?.message}
              variant="outlined"
              sx={{ borderRadius: 2 }}
            />
          </Box>
          {/* Rol */}
          <Box mb={2}>
            <Typography variant="subtitle1" fontWeight={500} mb={0.5}>
              Rol *
            </Typography>
            <Controller
              name="role"
              control={control}
              render={({field}) => (
                <Autocomplete
                  options={dataRoles}
                  value={field.value || null}
                  onChange={(_, newValue) => field.onChange(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Seleccion rol"
                      error={!!errors.role}
                      helperText={errors?.role?.message}
                      variant="outlined"
                      sx={{ borderRadius: 2 }}
                    />
                  )}
                />
              )}
            />
          </Box>
          {/* Número de teléfono */}
          <Box mb={2}>
            <Typography variant="subtitle1" fontWeight={500} mb={0.5}>
              Número de teléfono *
            </Typography>
            <TextField
              fullWidth
              {...control.register('phone')}
              placeholder="5534563723"
              error={!!errors.phone}
              helperText={errors?.phone?.message}
              variant="outlined"
              sx={{ borderRadius: 2 }}
            />
          </Box>
          {/* Botones */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
            <Button
              variant="contained"
              color="error"
              sx={{
                minWidth: 130,
                fontWeight: 700,
                borderRadius: 2,
                bgcolor: '#fa5252',
                '&:hover': { bgcolor: '#c92a2a' },
              }}
              onClick={handleViewRoute}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!isValid || Object.keys(dirtyFields).length === 0 || submitting}
              sx={{
                minWidth: 130,
                fontWeight: 700,
                borderRadius: 2,
                bgcolor: '#4f8cff',
                '&:hover': { bgcolor: '#246efd' },
              }}
            >
              Agregar
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
