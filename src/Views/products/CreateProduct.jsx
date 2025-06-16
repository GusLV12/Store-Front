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

import { schemaProduct, defaultValues } from './validators/create';

const suppliers = [
  { label: 'Proveedor 1', id: 'abc-123' },
  { label: 'Proveedor 2', id: 'xyz-789' }
];
const departments = [
  { label: 'Abarrotes', id: 'dept-1' },
  { label: 'Bebidas', id: 'dept-2' }
];
const types = [
  { label: 'Botella', id: 'type-1' },
  { label: 'Lata', id: 'type-2' }
];

export function CreateProduct() {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, dirtyFields },
    reset,
  } = useForm({
    defaultValues: { ...defaultValues, status: true },
    resolver: yupResolver(schemaProduct),
    mode: 'onChange',
  });

  const onSubmit = (data) => {
    alert(`Producto creado:\n${  JSON.stringify(data, null, 2)}`);
    reset();
  };

  const handleViewRoute = () => {
    navigate('/products');
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
          Agregar producto
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          {/* Nombre */}
          <Box mb={2}>
            <Typography variant="subtitle1" fontWeight={500} mb={0.5}>
              Nombre *
            </Typography>
            <TextField
              fullWidth
              {...control.register('name')}
              placeholder="Nombre del producto"
              error={!!errors.name}
              helperText={errors?.name?.message}
              variant="outlined"
              sx={{ borderRadius: 2 }}
            />
          </Box>
          {/* Descripción */}
          <Box mb={2}>
            <Typography variant="subtitle1" fontWeight={500} mb={0.5}>
              Descripción
            </Typography>
            <TextField
              fullWidth
              {...control.register('description')}
              placeholder="Describe el producto"
              error={!!errors.description}
              helperText={errors?.description?.message}
              variant="outlined"
              sx={{ borderRadius: 2 }}
            />
          </Box>
          {/* Código de barras */}
          <Box mb={2}>
            <Typography variant="subtitle1" fontWeight={500} mb={0.5}>
              Código de barras *
            </Typography>
            <TextField
              fullWidth
              {...control.register('barcode')}
              placeholder="1234567890000"
              error={!!errors.barcode}
              helperText={errors?.barcode?.message}
              variant="outlined"
              sx={{ borderRadius: 2 }}
            />
          </Box>
          {/* Costo compra */}
          <Box mb={2}>
            <Typography variant="subtitle1" fontWeight={500} mb={0.5}>
              Costo de compra *
            </Typography>
            <TextField
              fullWidth
              type="number"
              {...control.register('purchaseCost')}
              placeholder="Costo de compra"
              error={!!errors.purchaseCost}
              helperText={errors?.purchaseCost?.message}
              variant="outlined"
              sx={{ borderRadius: 2 }}
              inputProps={{ min: 0 }}
            />
          </Box>
          {/* Costo venta */}
          <Box mb={2}>
            <Typography variant="subtitle1" fontWeight={500} mb={0.5}>
              Costo de venta *
            </Typography>
            <TextField
              fullWidth
              type="number"
              {...control.register('saleCost')}
              placeholder="Costo de venta"
              error={!!errors.saleCost}
              helperText={errors?.saleCost?.message}
              variant="outlined"
              sx={{ borderRadius: 2 }}
              inputProps={{ min: 0 }}
            />
          </Box>
          {/* Stock */}
          <Box mb={2}>
            <Typography variant="subtitle1" fontWeight={500} mb={0.5}>
              Stock *
            </Typography>
            <TextField
              fullWidth
              type="number"
              {...control.register('stock')}
              placeholder="Cantidad disponible"
              error={!!errors.stock}
              helperText={errors?.stock?.message}
              variant="outlined"
              sx={{ borderRadius: 2 }}
              inputProps={{ min: 0 }}
            />
          </Box>
          {/* Proveedor */}
          <Box mb={2}>
            <Typography variant="subtitle1" fontWeight={500} mb={0.5}>
              Proveedor *
            </Typography>
            <Controller
              name="supplierId"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  options={suppliers}
                  getOptionLabel={(option) => option.label}
                  onChange={(_, value) => field.onChange(value ? value.id : '')}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Selecciona proveedor"
                      error={!!errors.supplierId}
                      helperText={errors?.supplierId?.message}
                      variant="outlined"
                      sx={{ borderRadius: 2 }}
                    />
                  )}
                />
              )}
            />
          </Box>
          {/* Departamento */}
          <Box mb={2}>
            <Typography variant="subtitle1" fontWeight={500} mb={0.5}>
              Departamento *
            </Typography>
            <Controller
              name="departmentId"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  options={departments}
                  getOptionLabel={(option) => option.label}
                  onChange={(_, value) => field.onChange(value ? value.id : '')}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Selecciona departamento"
                      error={!!errors.departmentId}
                      helperText={errors?.departmentId?.message}
                      variant="outlined"
                      sx={{ borderRadius: 2 }}
                    />
                  )}
                />
              )}
            />
          </Box>
          {/* Tipo */}
          <Box mb={2}>
            <Typography variant="subtitle1" fontWeight={500} mb={0.5}>
              Tipo de producto *
            </Typography>
            <Controller
              name="typeId"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  options={types}
                  getOptionLabel={(option) => option.label}
                  onChange={(_, value) => field.onChange(value ? value.id : '')}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Selecciona tipo"
                      error={!!errors.typeId}
                      helperText={errors?.typeId?.message}
                      variant="outlined"
                      sx={{ borderRadius: 2 }}
                    />
                  )}
                />
              )}
            />
          </Box>
          {/* Estatus */}
          <Box mb={2} display="flex" alignItems="center">
            <FormControlLabel
              control={
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      {...field}
                      checked={field.value}
                      color="primary"
                    />
                  )}
                />
              }
              label={
                <Typography sx={{ color: '#3f51b5', fontWeight: 600 }}>
                  Estatus: {control._formValues?.status ? 'Activo' : 'Inactivo'}
                </Typography>
              }
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
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!isValid || Object.keys(dirtyFields).length === 0}
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
