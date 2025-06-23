export const getSuppliers = (params) => ( {
  method: 'get',
  url: '/suppliers',
  params
});

export const createSupplier = (data) => ({
  method: 'POST',
  url: 'suppliers',
  data,
});

// ------------------------------- | Catalogos | -------------------------------
export const catalogSuppliers = () =>({
  method: 'get',
  url: '/suppliers/catalog',
});
