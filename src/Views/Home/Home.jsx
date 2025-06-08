import { useEffect, useState } from 'react';
import { Button, Grid } from '@mui/material';

import { useRequest } from '@/Hooks';
import { getProducts } from '@/api/products';

import { InputSearch, ProductCard } from '../../Components';
import { ProductOverviewModal } from '../../modals/ProductOverviewModal/ProductOverviewModal';
import { useModal } from '../../Context/ModalContext/ModalContext';

export const Home = () => {
  const [querySearch, setQuerySearch] = useState('');
  const [data, setData] = useState([]);
  const { openModal } = useModal();

  // UseRequest de Productos
  const { makeRequest, response, loading, error } = useRequest(getProducts);

  const handleSearchQuery = (query = '') => {
    setQuerySearch(query);
  };

  const handleClearAllFilters = () => {
    setQuerySearch('');
  };

  const openDialog = () => {
    console.log('Abriendo modal');
    openModal(<ProductOverviewModal />);
  };

  useEffect(() => {
    makeRequest();
  },[]);

  useEffect(() => {
    console.log('Response de productos:', response);
    setData(response || []);
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
        {data.length > 0 ? (
          data.map((product) => (
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
