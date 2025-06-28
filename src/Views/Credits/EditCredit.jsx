import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  MenuItem,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

import { useRequest } from '@/Hooks';
import { getCreditById, updateCredit } from '@/api/credits';
import { LoadingSpinner } from '@/Components/LoadingSpinner/LoadingSpinner';

import { schemaCredit, defaultValues } from './validators/validations';

const statusOptions = [
  { value: 'PENDING', label: 'Pendiente' },
  { value: 'ACTIVE', label: 'Activo' },
  { value: 'OVERDUE', label: 'Vencido' },
  { value: 'PAID', label: 'Pagado' },
  { value: 'CANCELLED', label: 'Cancelado' }
];

export function EditCredit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loadingData, setLoadingData] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userLabel, setUserLabel] = useState('');

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

  const { makeRequest: tryGetCredit } = useRequest(getCreditById);
  const { makeRequest: tryUpdateCredit } = useRequest(updateCredit);

  useEffect(() => {
    async function fetchData() {
      setLoadingData(true);
      const data = await tryGetCredit(id);
      if (data) {
        reset({
          userId: data.userId,
          amount: data.amount,
          status: data.status,
        });
        setUserLabel(data.user?.username || ''); // Para mostrar el usuario
      }
      setLoadingData(false);
    }
    fetchData();
    // eslint-disable-next-line
  }, [id]);

  const onSubmit = async (formData) => {
    setSubmitting(true);
    try {
      await tryUpdateCredit(id, {
        amount: formData.amount,
        status: formData.status,
      });
      alert('Crédito actualizado correctamente');
      navigate('/credits');
    } catch (err) {
      alert('Error al actualizar el crédito');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/credits');
  };

  if (loadingData) {
    return (
      <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner size="3rem" />
      </Box>
    );
  }

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
          Editar crédito
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">

          <Box mb={2}>
            <Typography variant="subtitle1" fontWeight={500} mb={0.5}>
              Cliente
            </Typography>
            <Typography
              variant="h5"
              sx={{
                px: 2,
                py: 1,
                bgcolor: '#f2f2f2',
                borderRadius: 2,
                fontWeight: 500,
                color: '#212121'
              }}
            >
              {userLabel || 'Sin usuario'}
            </Typography>
          </Box>

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
              Guardar cambios
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
