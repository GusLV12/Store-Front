import * as yup from 'yup';

export const schemaLogin = yup.object().shape({
  email: yup
    .string()
    .email('El email no es válido')
    .required('El campo no puede quedar vacío'),
  password: yup
    .string()
    .required('El campo no puede quedar vacío')
});

export const defaultValues = {
  email: '',
  password: '',
};
