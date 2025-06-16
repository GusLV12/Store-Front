import * as yup from 'yup';

export const schemaProduct = yup.object().shape({
  barcode: yup.string().length(13, 'Debe ser un código de barras válido (13 dígitos)').required('El código de barras es obligatorio'),
  name: yup.string().min(3, 'El nombre debe tener al menos 3 caracteres').required('El nombre es obligatorio'),
  description: yup.string().min(6, 'La descripción debe tener más de 6 caracteres'),
  purchaseCost: yup.number().min(0, 'Debe ser mayor o igual a 0').required('El costo de compra es obligatorio'),
  saleCost: yup.number().min(0, 'Debe ser mayor o igual a 0').required('El costo de venta es obligatorio'),
  stock: yup.number().min(0, 'Debe ser mayor o igual a 0').required('El stock es obligatorio'),
  supplierId: yup.string().required('Selecciona un proveedor'),
  departmentId: yup.string().required('Selecciona un departamento'),
  typeId: yup.string().required('Selecciona un tipo de producto'),
});

export const defaultValues = {
  barcode: '',
  name: '',
  description: '',
  purchaseCost: '',
  saleCost: '',
  stock: '',
  supplierId: '',
  departmentId: '',
  typeId: '',
};
