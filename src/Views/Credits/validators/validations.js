// ./validators/validations.js
import * as yup from 'yup';

export const schemaCredit = yup.object().shape({
  userId: yup.string().required('Selecciona un cliente'),
  amount: yup
    .number()
    .typeError('El monto debe ser un número')
    .positive('El monto debe ser mayor a 0')
    .required('El monto es obligatorio'),
  status: yup.string().oneOf(['PENDING', 'ACTIVE', 'OVERDUE', 'PAID', 'CANCELLED']).required('Selecciona un estado'),
});

export const defaultValues = {
  userId: '',
  amount: '',
  status: 'ACTIVE',
};
