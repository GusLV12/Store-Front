import { createContext, useContext, useState } from 'react';

const ListProductContext = createContext();

export const ListProductProvider = ({ children }) => {
  // Estado para guardar los productos y la paginación
  const [productList, setProductList] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    current_page: 1,
    last_page: 1,
  });

  // Guarda todos los productos recibidos (array completo del backend)
  const updateProductList = (data, meta = {}) => {
    setProductList(data || []);
    setPagination({
      total: meta.total ?? data.length,
      current_page: meta.current_page ?? 1,
      last_page: meta.last_page ?? 1,
    });
  };

  // Agrega un producto al listado
  const addProduct = (product) => {
    setProductList((prev) => [...prev, product]);
    setPagination((prev) => ({
      ...prev,
      total: prev.total + 1,
    }));
  };

  // Actualiza un producto existente
  const updateProduct = (updatedProduct) => {
    setProductList((prev) =>
      prev.map((product) =>
        product.barcode === updatedProduct.barcode ? updatedProduct : product
      )
    );
  };

  // Elimina un producto
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
      }}
    >
      {children}
    </ListProductContext.Provider>
  );
};

// Hook para consumir el contexto fácilmente
export const useListProduct = () => useContext(ListProductContext);
