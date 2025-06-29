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

import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/Components/LoadingSpinner/LoadingSpinner';

import { useRequest } from '@/Hooks';

import { getProductById } from '@/api/products';
import { createPromotion} from '@/api/promotions'
import { schemaPromotion, defaultValues, typePromotions } from './validators/validations';
import { InstallDesktopRounded } from '@mui/icons-material';

export function Promotion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loadingData, setLoadingData] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formKey, setFormKey] = useState(Date.now());

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, dirtyFields },
    reset,
  } = useForm({
    defaultValues: { ...defaultValues },
    resolver: yupResolver(schemaPromotion),
    mode: 'onChange',
  });

  // Obtener producto
  const { makeRequest: tryGetProduct, response: dataProduct} = useRequest(getProductById(id));

  // Si tienes la función, descomenta para crear usuario en la API real:
  const { makeRequest: tryCreatePromotion } = useRequest(createPromotion);

  useEffect(() => {
      async function fetchData() {
      setLoadingData(true);
      const producto = await tryGetProduct(id);
      if (producto) {
        reset({
          type: '',
          productId: producto.id,
          startDate: '',
          endDate: '',

        });
      }
      setLoadingData(false);
    }
    fetchData();
  }, [id]);

  // --- SUBMIT global ---
  const onSubmit = async (data) => {
    setSubmitting(true);
    console.log('Datos del formulario:', data);
    try {
      const productId = id;
      // Arma data final (ajusta nombres según tu backend)
      const promotionToSend = {
        ...data,
        productId,
      };

      // 4. Aquí puedes guardar en la API real:
      await tryCreatePromotion(promotionToSend);

      alert(`Promoción creada:\n${JSON.stringify(promotionToSend, null, 2)}`);
      reset({
        ...defaultValues,
      });
      setFormKey(Date.now());
      navigate('/products');
    } catch (err) {
      alert('Error al crear el promoción');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewRoute = () => {
    navigate('/products');
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
          Agregar promoción al producto : {dataProduct.name}
        </Typography>
        <form key={formKey} onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          {/* Tipo de promocion */}
          <Box mb={2}>
            <Typography variant="subtitle1" fontWeight={500} mb={0.5}>
              Tipo de promoción
            </Typography>
            <Controller
              name="type"
              control={control}
              render={({field}) => (
                <Autocomplete
                  options={typePromotions}
                  value={field.value || null}
                  onChange={(_, newValue) => field.onChange(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Seleccion un tipo de promoción"
                      error={!!errors.type}
                      helperText={errors?.type?.message}
                      variant="outlined"
                      sx={{ borderRadius: 2 }}
                    />
                  )}
                />
              )}
            />
          </Box>
          {/* Fechas de inicio*/}
          <Box mb={2}>
            <Typography variant="subtitle1" fontWeight={500} mb={0.5}>
              Fecha de inicio
            </Typography>
            <TextField
              type="date"
              {...control.register('startDate')}
              error={!!errors.startDate}
              helperText={errors?.startDate?.message}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              sx={{ borderRadius: 2 }}
            />
          </Box>
          {/* Fechas de fin*/}
          <Box mb={2}>
            <Typography variant="subtitle1" fontWeight={500} mb={0.5}>
              Fecha de fin
            </Typography>
            <TextField
              type="date"
              {...control.register('endDate')}
              error={!!errors.endDate}
              helperText={errors?.endDate?.message}
              InputLabelProps={{ shrink: true }}
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
