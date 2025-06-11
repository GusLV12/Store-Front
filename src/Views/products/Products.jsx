import { memo, useEffect, useState } from 'react';
import { Grid, Box, Tooltip, Button } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CloudSyncIcon from '@mui/icons-material/CloudSync';

import { useNativeDebounce, useRequest } from '@/Hooks';
import { getProducts } from '@/api/products';

import { ComposedTable, InputSearch } from '../../Components/index';

const tableRowScheme = [
  {
    title: 'Código',
    minWidth: '220px',
  },
  {
    title: 'Nombre del producto',
    width: '180px',
    minWidth: '180px',
  },
  {
    title: 'Descripción',
    minWidth: '140px',
  },
  {
    title: 'Costo de compra',
    minWidth: '140px',
  },
  {
    title: 'Precio de venta',
    width: '160px',
    maxWidth: '200px',
  },
  {
    title: 'unidades en stock',
    width: '200px',
    minWidth: '200px',
  },
  {
    title: 'Opciones',
    minWidth: '100px',
    fixedRight: true,
  },
];

const OptionButtons = memo(
  ({ onUpdate = () => {}, onDelete = () => {} }) => {
    return (
      <div className="flex w-full flex-wrap flex-row justify-between items-center">
        <Tooltip title="Reiniciar registro de terminal">
          <span>
            <Button
              className="my-3"
              onClick={onUpdate}
              size="small"
              variant="contained"
              color="primary"
              sx={{ minWidth: '3.2rem', aspectRatio: 1 / 1, padding: '0rem', borderRadius: '50%' }}
            >
              <CloudSyncIcon />
            </Button>
          </span>
        </Tooltip>

        <Tooltip title="Eliminar informacion de registro de terminal">
          <span>
            <Button
              className="my-3"
              onClick={onDelete}
              size="small"
              variant="contained"
              color="error"
              sx={{ minWidth: '3.2rem', aspectRatio: 1 / 1, padding: '0rem', borderRadius: '50%' }}
            >
              <DeleteForeverIcon />
            </Button>
          </span>
        </Tooltip>
      </div>
    );
  });

export const Products = () => {
  const [querySearch, setQuerySearch] = useState('');
  const [dataList, setDataList] = useState([]);
  const [form, setForm] = useState({
    search: querySearch,
    page: 1,
    limit: 25,
    total: 0,
  });

  const { makeRequest, response, loading } = useRequest(getProducts);

  const { triggerAction } = useNativeDebounce(5000);

  // Ejecuta cuando cambia search, page o limit
  useEffect(() => {
    handleFilterSearchQuery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.search, form.page, form.limit]);

  // Actualiza dataList y total solo cuando llega nueva respuesta
  useEffect(() => {
    if (!response) return;
    setDataList(response.data || []);
    setForm((prev) => ({
      ...prev,
      total: response.total ?? prev.total,
    }));
  }, [response]);

  const handleFilterSearchQuery = async () => {
    triggerAction().then((isOk) => {
      if (!isOk) return;
      makeRequest({ params: form });
    });
  };

  // Actualiza el input de búsqueda y el filtro (resetea a página 1)
  const handleSearchQuery = (query = '') => {
    setQuerySearch(query);
    setForm((prev) => ({
      ...prev,
      search: query,
      page: 1,
    }));
  };

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Box className="flex justify-center items-center w-full">
            <InputSearch
              className="my-6 w-4/5"
              placeholder="Escribe un nombre para buscar contacto"
              value={querySearch}
              onChange={handleSearchQuery}
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <div className="flex flex-col justify-center">
            <ComposedTable
              className="w-full"
              headers={tableRowScheme}
              data={dataList}
              isLoading={loading}
            >
              <ComposedTable.Column content={({ barcode }) => barcode} />
              <ComposedTable.Column content={({ name }) => name} />
              <ComposedTable.Column content={({ description }) => description} />
              <ComposedTable.Column content={({ purchaseCost }) => purchaseCost} />
              <ComposedTable.Column content={({ saleCost }) => saleCost} />
              <ComposedTable.Column content={({ stock }) => stock} />
              <ComposedTable.Column
                content={({ id }) => (
                  <OptionButtons
                    onUpdate={() => console.log('Update')}
                    onDelete={() => console.log('Delete')}
                  />
                )}
              />
            </ComposedTable>

          </div>
        </Grid>
      </Grid>

    </>
  );
};
