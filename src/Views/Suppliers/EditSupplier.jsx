import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Switch,
  FormControlLabel,
  FormHelperText,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

import { useRequest } from '@/Hooks';
import { getSupplierById, updateSupplier } from '@/api/suppliers';
import { LoadingSpinner } from '@/Components/LoadingSpinner/LoadingSpinner';

import { supplierSchema, defaultValues } from './validators/validations';

export const EditSupplier = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loadingData, setLoadingData] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Formulario
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, dirtyFields },
  } = useForm({
    defaultValues: { ...defaultValues },
    resolver: yupResolver(supplierSchema),
    mode: 'onChange',
  });

  // Endpoints
  const { makeRequest: tryGetSupplier } = useRequest(getSupplierById);
  const { makeRequest: tryUpdateSupplier } = useRequest(updateSupplier);

  // Carga inicial de datos
  useEffect(() => {
    async function fetchSupplier() {
      setLoadingData(true);
      try {
        console.log('id: ', id);
        const proveedor = await tryGetSupplier(id);
        if (proveedor) {
          reset({
            companyName: proveedor.companyName ?? '',
            contactName: proveedor.contactName ?? '',
            phone: proveedor.phone ?? '',
            email: proveedor.email ?? '',
            address: proveedor.address ?? '',
            status: proveedor.status ?? 'activo',
          });
        }
      } catch (error) {
        alert('Error al cargar el proveedor');
        navigate('/suppliers');
      }
      setLoadingData(false);
    }
    fetchSupplier();
    // eslint-disable-next-line
  }, [id]);

  // Guardar cambios
  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await tryUpdateSupplier(id, data); // id, data (ajusta si tu API espera diferente)
      alert('Proveedor actualizado correctamente');
      navigate('/suppliers');
    } catch (err) {
      alert('Error al actualizar el proveedor');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/suppliers');
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
          Editar proveedor
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          {/* Empresa */}
          <Box mb={2}>
            <Typography variant="subtitle1" fontWeight={500} mb={0.5}>
              Nombre de la empresa *
            </Typography>
            <Controller
              name="companyName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  placeholder="Distribuidora del Norte"
                  error={!!errors.companyName}
                  helperText={errors?.companyName?.message}
                  variant="outlined"
                  sx={{ borderRadius: 2 }}
                />
              )}
            />
          </Box>
          {/* Contacto */}
          <Box mb={2}>
            <Typography variant="subtitle1" fontWeight={500} mb={0.5}>
              Nombre del contacto *
            </Typography>
            <Controller
              name="contactName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  placeholder="Juan Pérez"
                  error={!!errors.contactName}
                  helperText={errors?.contactName?.message}
                  variant="outlined"
                  sx={{ borderRadius: 2 }}
                />
              )}
            />
          </Box>
          {/* Teléfono */}
          <Box mb={2}>
            <Typography variant="subtitle1" fontWeight={500} mb={0.5}>
              Teléfono *
            </Typography>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  placeholder="5512345678"
                  error={!!errors.phone}
                  helperText={errors?.phone?.message}
                  variant="outlined"
                  sx={{ borderRadius: 2 }}
                  inputProps={{ maxLength: 15 }}
                />
              )}
            />
          </Box>
          {/* Email */}
          <Box mb={2}>
            <Typography variant="subtitle1" fontWeight={500} mb={0.5}>
              Email *
            </Typography>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  placeholder="proveedor@ejemplo.com"
                  error={!!errors.email}
                  helperText={errors?.email?.message}
                  variant="outlined"
                  sx={{ borderRadius: 2 }}
                />
              )}
            />
          </Box>
          {/* Dirección */}
          <Box mb={2}>
            <Typography variant="subtitle1" fontWeight={500} mb={0.5}>
              Dirección *
            </Typography>
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  placeholder="Calle Falsa 123"
                  error={!!errors.address}
                  helperText={errors?.address?.message}
                  variant="outlined"
                  sx={{ borderRadius: 2 }}
                />
              )}
            />
          </Box>
          {/* Estatus */}
          <Box mb={2} className="flex flex-col justify-center items-center">
            <Typography variant="subtitle1" fontWeight={500} mb={0.5}>
              Estatus *
            </Typography>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={field.value === 'activo'}
                        onChange={(_, checked) => field.onChange(checked ? 'activo' : 'inactivo')}
                        color="primary"
                      />
                    }
                    label={field.value === 'activo' ? 'Activo' : 'Inactivo'}
                  />
                  {errors.status && (
                    <FormHelperText error>{errors.status.message}</FormHelperText>
                  )}
                </>
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
};
