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
import { createType, getTypes } from '@/api/types';
import { createDepartment, getDepartments } from '@/api/departments';
// import { createProduct } from '@/api/products';

import { catalogSuppliers } from '@/api/suppliers';
import { createProduct } from '@/api/products';

import { schemaProduct, defaultValues } from './validators/create';

export function CreateProduct() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [formKey, setFormKey] = useState(Date.now());

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, dirtyFields },
    reset,
  } = useForm({
    defaultValues: { ...defaultValues },
    resolver: yupResolver(schemaProduct),
    mode: 'onChange',
  });

  // Obtener catálogos
  const { makeRequest: tryGetTypes, response: dataTypes = [] } = useRequest(getTypes);
  const { makeRequest: tryGetDepartments, response: dataDepartments = [] } = useRequest(getDepartments);
  const { makeRequest: tryGetSuppliers, response: dataSuppliers } = useRequest(catalogSuppliers);

  // Para crear tipo y depto
  const { makeRequest: tryCreateType } = useRequest(createType);
  const { makeRequest: tryCreateDepartment } = useRequest(createDepartment);

  // Si tienes la función, descomenta para crear producto en la API real:
  const { makeRequest: tryCreateProduct } = useRequest(createProduct);

  useEffect(() => {
    tryGetTypes();
    tryGetDepartments();
    tryGetSuppliers();
  }, []);

  // --- Lógica central para tipo ---
  const handleCreateType = async (nameOrId) => {
    // 1. Buscar si es un id ya existente
    const foundById = dataTypes?.find((item) => item.id === nameOrId);
    if (foundById) return foundById.id;

    // 2. Buscar si es un nombre (insensible a mayúsculas)
    const foundByName = dataTypes?.find(
      (item) => item.name.toLowerCase() === nameOrId.toLowerCase()
    );
    if (foundByName) return foundByName.id;

    // 3. Si no existe, créalo y regresa su id
    try {
      const created = await tryCreateType({ name: nameOrId });
      if (created && created.id) {
        await tryGetTypes();
        return created.id;
      }
    } catch (error) {
      console.error('Error al crear el tipo:', error);
    }
    return null;
  };

  // --- Lógica central para departamento ---
  const handleCreateDepartment = async (nameOrId) => {
    // 1. Buscar si es un id ya existente
    const foundById = dataDepartments?.find((item) => item.id === nameOrId);
    if (foundById) return foundById.id;

    // 2. Buscar si es un nombre (insensible a mayúsculas)
    const foundByName = dataDepartments?.find(
      (item) => item.name.toLowerCase() === nameOrId.toLowerCase()
    );
    if (foundByName) return foundByName.id;

    // 3. Si no existe, créalo y regresa su id
    try {
      const created = await tryCreateDepartment({ name: nameOrId });
      if (created && created.id) {
        await tryGetDepartments(); // refresca catálogo
        return created.id;
      }
    } catch (error) {
      console.error('Error al crear el departamento:', error);
    }
    return null;
  };

  // --- SUBMIT global ---
  const onSubmit = async (data) => {
    setSubmitting(true);
    console.log('Datos del formulario:', data);
    try {
      // 1. Resuelve departamento
      const departmentId = await handleCreateDepartment(data.departmentId);

      // 2. Resuelve tipo
      const typeId = await handleCreateType(data.typeId);

      // 3. Arma data final (ajusta nombres según tu backend)
      const productToSend = {
        ...data,
        departmentId,
        typeId,
      };

      // 4. Aquí puedes guardar en la API real:
      await tryCreateProduct(productToSend);

      alert(`Producto creado:\n${JSON.stringify(productToSend, null, 2)}`);
      reset({
        ...defaultValues,
      });
      setFormKey(Date.now());
    } catch (err) {
      alert('Error al crear el producto');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
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
        <form key={formKey} onSubmit={handleSubmit(onSubmit)} autoComplete="off">
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
                  options={dataSuppliers}
                  getOptionLabel={(option) => option.companyName}
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
              Tipo de producto *
            </Typography>
            <Controller
              name="typeId"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  options={dataTypes || []}
                  getOptionLabel={option =>
                    typeof option === 'string'
                      ? option
                      : option?.name || ''
                  }
                  isOptionEqualToValue={(option, value) =>
                    option.id === value || option.name === value
                  }
                  value={
                    dataTypes?.find(type => type.id === field.value) ||
        (field.value ? { id: null, name: field.value } : null)
                  }
                  freeSolo
                  onChange={async (_, value) => {
                    if (value && value.id) {
                      field.onChange(value.id);
                      return;
                    }
                    if (typeof value === 'string' && value.trim().length > 0) {
                      const alreadyExists = dataTypes?.some(
                        type => type.name.trim().toLowerCase() === value.trim().toLowerCase()
                      );
                      if (!alreadyExists) {
                        const createdId = await handleCreateType(value);
                        if (createdId) {
                          field.onChange(createdId);
                          await tryGetTypes();
                          return;
                        }
                      }
                      const type = dataTypes.find(
                        type => type.name.trim().toLowerCase() === value.trim().toLowerCase()
                      );
                      if (type) field.onChange(type.id);
                    } else {
                      field.onChange('');
                    }
                  }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      placeholder="Selecciona o crea tipo"
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
          <Box mb={2}>
            <Typography variant="subtitle1" fontWeight={500} mb={0.5}>
              Departamento *
            </Typography>
            <Controller
              name="departmentId"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  options={dataDepartments || []}
                  getOptionLabel={option =>
                    typeof option === 'string'
                      ? option
                      : option?.name || ''
                  }
                  isOptionEqualToValue={(option, value) =>
                    option.id === value || option.name === value
                  }
                  value={
                    dataDepartments?.find(dep => dep.id === field.value) ||
        (field.value ? { id: null, name: field.value } : null)
                  }
                  freeSolo
                  onChange={async (_, value) => {
                    if (value && value.id) {
                      field.onChange(value.id);
                      return;
                    }
                    if (typeof value === 'string' && value.trim().length > 0) {
                      // ¿Ya existe por nombre?
                      const alreadyExists = dataDepartments?.some(
                        dep => dep.name.trim().toLowerCase() === value.trim().toLowerCase()
                      );
                      if (!alreadyExists) {
                        // Crea nuevo departamento y selecciona
                        const createdId = await handleCreateDepartment(value);
                        if (createdId) {
                          field.onChange(createdId);
                          await tryGetDepartments();
                          return;
                        }
                      }
                      // Si ya existe, selecciona el existente
                      const dep = dataDepartments.find(
                        dep => dep.name.trim().toLowerCase() === value.trim().toLowerCase()
                      );
                      if (dep) field.onChange(dep.id);
                    } else {
                      field.onChange('');
                    }
                  }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      placeholder="Selecciona o crea departamento"
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
