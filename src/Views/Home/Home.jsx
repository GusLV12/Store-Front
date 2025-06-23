import { useEffect, useState } from 'react';
import { Button, CircularProgress, Grid, Stack } from '@mui/material';

import { useNativeDebounce, useRequest } from '@/Hooks';
import { getProducts } from '@/api/products';
import { LoadingSpinner } from '@/Components/LoadingSpinner/LoadingSpinner';

import { InputSearch, ProductCard } from '../../Components';
import { ProductOverviewModal } from '../../modals/ProductOverviewModal/ProductOverviewModal';
import { useModal } from '../../Context/ModalContext/ModalContext';

export const Home = () => {
  const { openModal } = useModal();
  const [dataList, setDataList] = useState([]);
  const [form, setForm] = useState({
    search: '',
    page: 1,
    limit: 25,
    total: 0,
  });

  const { makeRequest, response, loading, error } = useRequest(getProducts);
  const { triggerAction } = useNativeDebounce();

  const handleSearchQuery = (query = '') => {
    setForm((prev) => ({
      ...prev,
      search: query,
      page: 1,
    }));
  };

  // 2. Limpia todos los filtros (regresa a la vista inicial)
  const handleClearAllFilters = () => {
    setForm({
      search: '',
      page: 1,
      limit: 25,
      total: 0,
    });
  };

  const openDialog = () => openModal(<ProductOverviewModal />);

  // Carga inicial de productos (sin debounce)

  useEffect(() => {
    triggerAction().then((isOk) => {
      if (!isOk) return;
      makeRequest(form);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.search, form.page, form.limit]);

  // Actualiza dataList y total cuando llega la respuesta
  useEffect(() => {
    if (!response) return;
    setDataList(response.data || []);
    setForm((prev) => ({
      ...prev,
      total: response.total ?? prev.total,
    }));
  }, [response]);

  return (
    <>
      <div className="flex justify-center items-center w-3/5 mx-auto gap-8">
        <InputSearch
          className="my-6"
          placeholder="Escribe un nombre para buscar contacto"
          value={form.search}
          onChange={handleSearchQuery}
          onClear={handleClearAllFilters}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={openDialog}
        >
          Pago
        </Button>
      </div>

      {/* {loading && <LoadingSpinner size="3rem" />} */}
      {loading && <LoadingSpinner size="3rem" />}

      {!loading && (

        <Grid container spacing={2} className="m-12">
          {dataList.length > 0 ? (
            dataList.map((product) => (
              <Grid
                key={product.barcode}
                item
                xs={12}
                md={4}
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
      )}
    </>
  );
};
