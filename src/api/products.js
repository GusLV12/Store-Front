export const getProducts = (params) => ({
  method: 'GET',
  url: 'products',
  params
});

export const getProductById = (id) => ({
  method: 'GET',
  url: `products/${id}`,
});

export const createProduct = (data) =>({
  method: 'POST',
  url: 'products',
  data
});

export const updateProduct = (id) => ({
  method: 'PUT',
  url: `products/${id}`,
});

export const deleteProduct = (id) => ({
  method: 'DELETE',
  url: `products/${id}`,
});
