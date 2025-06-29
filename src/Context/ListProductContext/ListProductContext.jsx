import { createContext, useContext, useState } from 'react';

const ListProductContext = createContext();

export const ListProductProvider = ({ children }) => {
  const [productList, setProductList] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    current_page: 1,
    last_page: 1,
  });

  // Actualiza todo el listado (al hacer fetch)
  const updateProductList = (data, meta = {}) => {
    setProductList(data || []);
    setPagination({
      total: meta.total ?? data.length,
      current_page: meta.current_page ?? 1,
      last_page: meta.last_page ?? 1,
    });
  };

  // Agregar, actualizar o eliminar productos si lo requieres después
  const addProduct = (product) => {
    setProductList((prev) => [...prev, product]);
    setPagination((prev) => ({
      ...prev,
      total: prev.total + 1,
    }));
  };

  const updateProduct = (updatedProduct) => {
    setProductList((prev) =>
      prev.map((product) =>
        product.barcode === updatedProduct.barcode ? updatedProduct : product
      )
    );
  };

  const removeProduct = (barcode) => {
    setProductList((prev) => prev.filter((product) => product.barcode !== barcode));
    setPagination((prev) => ({
      ...prev,
      total: Math.max(prev.total - 1, 0),
    }));
  };

  return (
    <ListProductContext.Provider
      value={{
        productList,
        pagination,
        updateProductList,
        addProduct,
        updateProduct,
        removeProduct,
        setProductList, // útil para manejo avanzado o reseteo manual
        setPagination,
      }}
    >
      {children}
    </ListProductContext.Provider>
  );
};

export const useListProduct = () => useContext(ListProductContext);
