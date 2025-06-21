export const getSuppliers = {
  method: 'get',
  url: '/suppliers',
};

// ------------------------------- | Catalogos | -------------------------------
export const catalogSuppliers = () =>({
  method: 'get',
  url: '/suppliers/catalog',
});
