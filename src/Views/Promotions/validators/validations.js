import * as yup from 'yup';

export const schemaPromotion = yup.object().shape({
  type: yup.string().required('Selecciona alguna promocion'),
  startDate: yup.string().required('Fecha de inicio obligatoria').length(10,'Fecha debe tener el formato MM-DD-YYYY'),
  endDate: yup.string().required('Fecha de fin obligatoria').length(10,'Fecha debe tener el formato MM-DD-YYYY').test('fecha-fin-posterior', 'La fecha de fin debe ser posterior a la de inicio', function (value) {
      const { startDate } = this.parent;
      return !startDate || !value || new Date(value) >= new Date(startDate);
    }),
});

export const defaultValues = {
  type: '',
  startDate: '',
  endDate: '',
};

export const typePromotions = ["2x1", "3x2"]