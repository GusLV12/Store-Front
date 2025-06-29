import { useEffect, useState } from 'react';
import { Box, Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { useNativeDebounce, useRequest } from '@/Hooks';
import { getProducts } from '@/api/products';
import { LoadingSpinner } from '@/Components/LoadingSpinner/LoadingSpinner';

import { InputSearch, ProductCard } from '../../Components';
import { ProductOverviewModal } from '../../modals/ProductOverviewModal/ProductOverviewModal';
import { useModal } from '../../Context/ModalContext/ModalContext';

export const Home = () => {
  const { openModal } = useModal();

  const navigate = useNavigate();
  const [dataList, setDataList] = useState([]);
  const [form, setForm] = useState({
    search: '',
    page: 1,
    limit: 25,
    total: 0,
  });

  const { makeRequest, response, loading } = useRequest(getProducts);
  const { triggerAction } = useNativeDebounce();

  const handleSearchQuery = (query = '') => {
    setForm((prev) => ({
      ...prev,
      search: query,
      page: 1,
    }));
  };

  const handleClearAllFilters = () => {
    setForm({
      search: '',
      page: 1,
      limit: 25,
      total: 0,
    });
  };

  const openDialog = () => openModal(<ProductOverviewModal />);

  useEffect(() => {
    triggerAction().then((isOk) => {
      if (!isOk) return;
      makeRequest(form);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.search, form.page, form.limit]);

  useEffect(() => {
    if (!response) return;
    setDataList(response.data || []);
    setForm((prev) => ({
      ...prev,
      total: response.total ?? prev.total,
    }));
  }, [response]);

  const handleCreditPay = () => {
    navigate('/credits/pay');
  };

  return (
    <Box sx={{ maxWidth: 1780, mx: 'auto', px: 2 }}>
      <div className="flex justify-center items-center w-3/5 mx-auto gap-8">
        <InputSearch
          className="my-6"
          placeholder="Escribe un nombre para buscar producto"
          value={form.search}
          onChange={handleSearchQuery}
          onClear={handleClearAllFilters}
        />

        <Button
          variant="contained"
          color="success"
          onClick={openDialog}
        >
          Pago
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={handleCreditPay}
          className="whitespace-nowrap"
          sx={{ minWidth: '150px' }}
        >
          Pagar crédito
        </Button>
      </div>

      {loading && <LoadingSpinner size="3rem" />}

      {!loading && (
        <Grid
          container spacing={2}
          justifyContent="center"
          alignItems="flex-start"
          sx={{ width: '100%', margin: 0 }}
        >
          {dataList.length > 0 ? (
            dataList.map((product) => (
              <Grid
                key={product.barcode}
                item
                xs={12}
                md={3}
              >
                <ProductCard
                  img={product.image}
                  name={product.name}
                  description={product.description}
                  stock={product.stock}
                  price={product.saleCost}
                  // Nuevo: agrega producto al carrito
                  // onAddToCart={() => addToCart(product)}
                  {...product}
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
    </Box>
  );
};
