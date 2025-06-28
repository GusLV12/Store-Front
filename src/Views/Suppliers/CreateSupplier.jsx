import { useForm, Controller  } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  MenuItem,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { useRequest } from '@/Hooks';
import { createSupplier } from '@/api/suppliers';

import { supplierSchema, defaultValues } from './validators/validations';

export const CreateSupplier = () => {
  const navigate = useNavigate();
  const { makeRequest: tryCreateSupplier } = useRequest(createSupplier);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isValid, dirtyFields, isSubmitting },
  } = useForm({
    defaultValues: defaultValues,
    resolver: yupResolver(supplierSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data) => {
    try {
      await tryCreateSupplier(data);
      alert('Proveedor creado correctamente');
      reset(defaultValues);
    } catch (err) {
      alert('Ocurrió un error al crear el proveedor');
      console.error(err);
    }
  };

  const handleCancel = () => {
    navigate('/suppliers');
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
          Agregar proveedor
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          {/* Empresa */}
          <Box mb={2}>
            <Typography variant="subtitle1" fontWeight={500} mb={0.5}>
              Nombre de la empresa *
            </Typography>
            <TextField
              fullWidth
              {...register('companyName')}
              placeholder="Distribuidora del Norte"
              error={!!errors.companyName}
              helperText={errors?.companyName?.message}
              variant="outlined"
              sx={{ borderRadius: 2 }}
            />
          </Box>
          {/* Contacto */}
          <Box mb={2}>
            <Typography variant="subtitle1" fontWeight={500} mb={0.5}>
              Nombre del contacto *
            </Typography>
            <TextField
              fullWidth
              {...register('contactName')}
              placeholder="Juan Pérez"
              error={!!errors.contactName}
              helperText={errors?.contactName?.message}
              variant="outlined"
              sx={{ borderRadius: 2 }}
            />
          </Box>
          {/* Teléfono */}
          <Box mb={2}>
            <Typography variant="subtitle1" fontWeight={500} mb={0.5}>
              Teléfono *
            </Typography>
            <TextField
              fullWidth
              {...register('phone')}
              placeholder="5512345678"
              error={!!errors.phone}
              helperText={errors?.phone?.message}
              variant="outlined"
              sx={{ borderRadius: 2 }}
              inputProps={{ maxLength: 15 }}
            />
          </Box>
          {/* Email */}
          <Box mb={2}>
            <Typography variant="subtitle1" fontWeight={500} mb={0.5}>
              Email *
            </Typography>
            <TextField
              fullWidth
              {...register('email')}
              placeholder="proveedor@ejemplo.com"
              error={!!errors.email}
              helperText={errors?.email?.message}
              variant="outlined"
              sx={{ borderRadius: 2 }}
            />
          </Box>
          {/* Dirección */}
          <Box mb={2}>
            <Typography variant="subtitle1" fontWeight={500} mb={0.5}>
              Dirección *
            </Typography>
            <TextField
              fullWidth
              {...register('address')}
              placeholder="Calle Falsa 123"
              error={!!errors.address}
              helperText={errors?.address?.message}
              variant="outlined"
              sx={{ borderRadius: 2 }}
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
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!isValid || Object.keys(dirtyFields).length === 0 || isSubmitting}
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
};
