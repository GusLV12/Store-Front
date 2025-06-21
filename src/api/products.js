export const getProducts = () => ({
  method: 'GET',
  url: 'products',
});

export const getProductById = (id) => ({
  method: 'GET',
  url: `products/${id}`,
});

export const createProduct = {
  method: 'POST',
  url: 'products',
};

export const updateProduct = (id) => ({
  method: 'PUT',
  url: `products/${id}`,
});

export const deleteProduct = (id) => ({
  method: 'DELETE',
  url: `products/${id}`,
});
