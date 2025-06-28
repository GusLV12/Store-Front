import * as yup from 'yup';

export const defaultValues = {
  companyName: '',
  contactName: '',
  phone: '',
  email: '',
  address: '',
  status: 'activo',
};

export const supplierSchema = yup.object().shape({
  companyName: yup.string().required('El nombre de la empresa es obligatorio'),
  contactName: yup.string().required('El nombre del contacto es obligatorio'),
  phone: yup
    .string()
    .matches(/^\d{10,15}$/, 'Teléfono inválido')
    .required('El teléfono es obligatorio'),
  email: yup.string().email('Email inválido').required('El email es obligatorio'),
  address: yup.string().required('La dirección es obligatoria'),
  status: yup.string().required('El estatus es obligatorio'),
});
