import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  TextField,
  Typography,
  Autocomplete,
  Paper,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

import { useRequest } from '@/Hooks';
import { getProductById, updateProduct } from '@/api/products';
import { getTypes, createType } from '@/api/types';
import { getDepartments, createDepartment } from '@/api/departments';
import { catalogSuppliers } from '@/api/suppliers';
import { LoadingSpinner } from '@/Components/LoadingSpinner/LoadingSpinner';

import { schemaProduct, defaultValues } from './validators/validations';

export const EditProducts = () => {
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
    resolver: yupResolver(schemaProduct),
    mode: 'onChange',
  });

  // Endpoints
  const { makeRequest: tryGetProduct, response: productData } = useRequest(getProductById);
  const { makeRequest: tryUpdateProduct } = useRequest(updateProduct);

  // Catálogos
  const { makeRequest: tryGetTypes, response: dataTypes = [] } = useRequest(getTypes);
  const { makeRequest: tryGetDepartments, response: dataDepartments = [] } = useRequest(getDepartments);
  const { makeRequest: tryGetSuppliers, response: dataSuppliers = [] } = useRequest(catalogSuppliers);
  const { makeRequest: tryCreateType } = useRequest(createType);
  const { makeRequest: tryCreateDepartment } = useRequest(createDepartment);

  // Carga de datos inicial
  useEffect(() => {
    async function fetchData() {
      setLoadingData(true);
      await Promise.all([
        tryGetTypes(),
        tryGetDepartments(),
        tryGetSuppliers(),
      ]);
      const producto = await tryGetProduct(id);
      if (producto) {
        // Pre-asignar los ids de type, department y supplier (ajusta según tus nombres)
        reset({
          ...producto,
          typeId: producto.typeId,
          departmentId: producto.departmentId,
          supplierId: producto.supplierId,
        });
      }
      setLoadingData(false);
    }
    fetchData();
    // eslint-disable-next-line
  }, [id]);

  // Funciones para crear tipo/depto si no existen
  const handleCreateType = async (nameOrId) => {
    const foundById = dataTypes?.find((item) => item.id === nameOrId);
    if (foundById) return foundById.id;

    const foundByName = dataTypes?.find(
      (item) => item.name.toLowerCase() === nameOrId.toLowerCase()
    );
    if (foundByName) return foundByName.id;

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

  const handleCreateDepartment = async (nameOrId) => {
    const foundById = dataDepartments?.find((item) => item.id === nameOrId);
    if (foundById) return foundById.id;

    const foundByName = dataDepartments?.find(
      (item) => item.name.toLowerCase() === nameOrId.toLowerCase()
    );
    if (foundByName) return foundByName.id;

    try {
      const created = await tryCreateDepartment({ name: nameOrId });
      if (created && created.id) {
        await tryGetDepartments();
        return created.id;
      }
    } catch (error) {
      console.error('Error al crear el departamento:', error);
    }
    return null;
  };

  // Submit edición
  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      // Resuelve departmentId y typeId por si cambian
      const departmentId = await handleCreateDepartment(data.departmentId);
      const typeId = await handleCreateType(data.typeId);

      const productToSend = {
        ...data,
        departmentId,
        typeId,
      };

      await tryUpdateProduct(id, productToSend);
      alert('Producto actualizado correctamente');
      navigate('/products');
    } catch (err) {
      alert('Error al actualizar el producto');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
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
          Editar producto
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          {/* ... Todos los mismos campos que en CreateProduct, solo cambiando el submit ... */}
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
                  value={dataSuppliers?.find(s => s.id === field.value) || null}
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
          {/* Tipo de producto */}
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
                      const alreadyExists = dataDepartments?.some(
                        dep => dep.name.trim().toLowerCase() === value.trim().toLowerCase()
                      );
                      if (!alreadyExists) {
                        const createdId = await handleCreateDepartment(value);
                        if (createdId) {
                          field.onChange(createdId);
                          await tryGetDepartments();
                          return;
                        }
                      }
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
