import { Button } from '@mui/material';
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
          placeholder="Escribe un nombre para buscar contacto"
          value={querySearch}
          onChange={(query) => handleSearchQuery(query)}
          onClear={handleClearAllFilters}
        />
      </div>
      <ProductCard/>

    </>
  );
};
