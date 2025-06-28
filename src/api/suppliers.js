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

export const getSupplierById = (id) => ({
  method: 'GET',
  url: `suppliers/${id}`,
});

export const updateSupplier = (id, data) => ({
  method: 'PUT',
  url: `suppliers/${id}`,
  data,
});

export const deleteSupplier = (id) => ({
  method: 'DELETE',
  url: `suppliers/${id}`,
});

// ------------------------------- | Catalogos | -------------------------------
export const catalogSuppliers = () =>({
  method: 'get',
  url: '/suppliers/catalog',
});
