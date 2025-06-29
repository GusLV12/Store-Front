export const getSales = (params) => ({
  method: 'GET',
  url: 'sales',
  params
});

export const getSaleById = (id) => ({
  method: 'GET',
  url: `sales/${id}`,
});

export const createSale = (data) =>({
  method: 'POST',
  url: 'sales',
  data
});

export const updateSale = (id, data) => ({
  method: 'PUT',
  url: `sales/${id}`,
  data,
});

export const deleteSale = (id) => ({
  method: 'DELETE',
  url: `sales/${id}`,
});
