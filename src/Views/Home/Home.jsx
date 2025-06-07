import { useEffect, useState } from 'react';
import { Button, Grid } from '@mui/material';

import { useRequest } from '@/Hooks';
import { getProducts } from '@/api/products';

import { InputSearch, ProductCard } from '../../Components';
import { ProductOverviewModal } from '../../modals/ProductOverviewModal/ProductOverviewModal';
import { useModal } from '../../Context/ModalContext/ModalContext';

export const Home = () => {
  const [querySearch, setQuerySearch] = useState('');
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
      <Grid container spacing={6} className="m-12">
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <ProductCard/>
        </Grid>
      </Grid>

    </>
  );
};
