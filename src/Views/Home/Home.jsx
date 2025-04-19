import { Button, Grid } from '@mui/material';
import { useState } from 'react';

import { InputSearch, ProductCard } from '../../Components';

export const Home = () => {
  const [querySearch, setQuerySearch] = useState('');

  const handleSearchQuery = (query = '') => {
    setQuerySearch(query);
  };

  const handleClearAllFilters = () => {
    setQuerySearch('');
  };

  return (
    <>
      <div className="flex justify-center items-center w-3/5 mx-auto">
        <InputSearch
          className="my-6"
          placeholder="Escribe un nombre para buscar contacto"
          value={querySearch}
          onChange={(query) => handleSearchQuery(query)}
          onClear={handleClearAllFilters}
        />
      </div>
      <Grid container spacing={6} className="m-12">
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <ProductCard/>
        </Grid>
      </Grid>

    </>
  );
};
