import { useEffect, useState } from 'react';
import { Button, Grid } from '@mui/material';

import { useNativeDebounce, useRequest } from '@/Hooks';
import { getProducts } from '@/api/products';

import { InputSearch, ProductCard } from '../../Components';
import { ProductOverviewModal } from '../../modals/ProductOverviewModal/ProductOverviewModal';
import { useModal } from '../../Context/ModalContext/ModalContext';

export const Home = () => {
  const { openModal } = useModal();
  const [querySearch, setQuerySearch] = useState('');
  const [dataList, setDataList] = useState([]);
  const [form, setForm] = useState({
    search: querySearch,
    page: 1,
    limit: 25,
    total: 0,
  });

  // UseRequest de Productos
  const { makeRequest, response, loading, error } = useRequest(getProducts);

  const { triggerAction } = useNativeDebounce();

  const handleFilterSearchQuery = async () => {
    triggerAction().then((isOk) => {
      if (!isOk) return;
      makeRequest({ params: form });
    });
  };

  const handleSearchQuery = (query = '') => {
    setQuerySearch(query);
    setForm((prev) => ({
      ...prev,
      search: query,
      page: 1,
    }));
  };

  const handleClearAllFilters = () => {
    setQuerySearch('');
  };

  const openDialog = () => openModal(<ProductOverviewModal />);

  useEffect(() => {
    makeRequest();
    setDataList(response?.data || []);
    setForm((prev) => ({
      ...prev,
      total: response?.total || 0,
      page: response?.page || 1,
      limit: response?.limit || 25,
    }));
  },[]);

  // Cada vez que cambie querySearch, hacer la búsqueda con debounce
  useEffect(() => {
    handleFilterSearchQuery();
  }, [querySearch, form.page, form.limit]);

  // Cada vez que llegue una respuesta, actualizar la data
  useEffect(() => {
    if (!response) return;
    setDataList(response?.data || []);
  }, [response]);

  return (
    <>
      <div className="flex justify-center items-center w-3/5 mx-auto gap-8">
        <InputSearch
          className="my-6"
          placeholder="Escribe un nombre para buscar contacto"
          value={querySearch}
          onChange={(query) => handleSearchQuery(query)}
          onClear={handleClearAllFilters}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={() => openDialog()}>
          Pago
        </Button>
      </div>
      <Grid container spacing={2} className="m-12">
        {dataList.length > 0 ? (
          dataList.map((product) => (
            <Grid
              key={product.barcode}
              item
              xs={12}
              md={2}
            >
              <ProductCard
                img={product.image}
                name={product.name}
                description={product.description}
                stock={product.stock}
              />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <div className="text-center w-full">No hay productos disponibles</div>
          </Grid>
        )}
      </Grid>

    </>
  );
};
