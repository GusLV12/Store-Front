import * as yup from 'yup';

export const schemaPayCredit = yup.object().shape({
  amount: yup
    .number()
    .typeError('Debes ingresar un número válido')
    .positive('El abono debe ser mayor a 0')
    .required('El monto a abonar es requerido'),
});
