import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  TextField,
  Typography,
  Autocomplete,
  Paper,
  MenuItem,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { useRequest } from '@/Hooks';
import {  createCredit } from '@/api/credits';
import { catalogUsers } from '@/api/user';

import { schemaCredit, defaultValues } from './validators/validations';

const statusOptions = [
  { value: 'PENDING', label: 'Pendiente' },
  { value: 'ACTIVE', label: 'Activo' },
  { value: 'OVERDUE', label: 'Vencido' },
  { value: 'PAID', label: 'Pagado' },
  { value: 'CANCELLED', label: 'Cancelado' }
];

export function CreateCredit() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  // react-hook-form
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, dirtyFields },
  } = useForm({
    defaultValues: { ...defaultValues },
    resolver: yupResolver(schemaCredit),
    mode: 'onChange',
  });

  // Traer catálogo de usuarios solo con id y username
  const { makeRequest: tryGetUsers, response: dataUsersRaw } = useRequest(catalogUsers);

  // Convertimos a array seguro
  const dataUsers = Array.isArray(dataUsersRaw) ? dataUsersRaw : [];

  // Crear crédito
  const { makeRequest: tryCreateCredit } = useRequest(createCredit);

  useEffect(() => {
    tryGetUsers();
  }, []);

  // Submit principal
  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      console.log('Datos deñ crear crédito:', data);
      await tryCreateCredit(data);
      reset({ ...defaultValues });
      navigate('/credits');
    } catch (err) {
      alert('Ocurrió un error al crear el crédito');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/credits');
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
          Agregar crédito
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          {/* Usuario */}
          <Box mb={2}>
            <Typography variant="subtitle1" fontWeight={500} mb={0.5}>
              Cliente *
            </Typography>
            <Controller
              name="userId"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  options={dataUsers}
                  getOptionLabel={(option) =>
                    option && option.username
                      ? `${option.username}`
                      : ''
                  }
                  value={
                    dataUsers.find((u) => u.id === field.value) || null
                  }
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  onChange={(_, value) => field.onChange(value ? value.id : '')}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Selecciona usuario"
                      error={!!errors.userId}
                      helperText={errors?.userId?.message}
                      variant="outlined"
                      sx={{ borderRadius: 2 }}
                    />
                  )}
                />
              )}
            />
          </Box>
          {/* Monto */}
          <Box mb={2}>
            <Typography variant="subtitle1" fontWeight={500} mb={0.5}>
              Monto autorizado *
            </Typography>
            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type="number"
                  placeholder="Monto del crédito"
                  error={!!errors.amount}
                  helperText={errors?.amount?.message}
                  variant="outlined"
                  sx={{ borderRadius: 2 }}
                  inputProps={{ min: 0 }}
                />
              )}
            />
          </Box>
          {/* Status */}
          <Box mb={2}>
            <Typography variant="subtitle1" fontWeight={500} mb={0.5}>
              Estado *
            </Typography>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  fullWidth
                  {...field}
                  error={!!errors.status}
                  helperText={errors?.status?.message}
                  variant="outlined"
                  sx={{ borderRadius: 2 }}
                  placeholder="Selecciona estado"
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
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
              onClick={handleCancel}
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
