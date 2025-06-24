import * as yup from 'yup';

export const schemaUser = yup.object().shape({
  username: yup.string().min(4, 'El nombre de usuario debe ser de minimo 4 caracteres').required('El nombre de usuario es obligatorio').max(30, 'El nombre no debe exceder los 30 caracteres'),
  email: yup.string().email('Correo invalido').required('El correo electrónico es obligatorio'),
  password: yup.string().min(8, 'La contraseña debe tener más de 8 caracteres').required('La contraseña es obligatoria'),
  role: yup.string().required('Selecciona un rol'),
  phone: yup.string().length(10, 'Deben ser numero minimo de 10 digitos').required('El telefono es obligatorio'),
});

export const defaultValues = {
  username: '',
  email: '',
  password: '',
  role: '',
  phone: '',
};

export const dataRoles = ["admin", "user", "client"];
