import { memo, useEffect, useState } from 'react';
import { Grid, Box, Tooltip, Button } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import EditIcon from '@mui/icons-material/Edit';

import { useNativeDebounce, useRequest } from '@/Hooks';
import { getCredits } from '@/api/credits';

import { ComposedTable, InputSearch, Paginator } from '../../Components/index';

const tableRowScheme = [
  {
    title: 'Nombre cliente',
    minWidth: '220px',
  },
  {
    title: 'Correo',
    width: '180px',
    minWidth: '180px',
  },
  {
    title: 'Teléfono',
    minWidth: '140px',
  },
  {
    title: 'Monto credito',
    minWidth: '140px',
  },
  {
    title: 'Total venta',
    width: '160px',
    maxWidth: '200px',
  },
  {
    title: 'Ultimo pago',
    width: '200px',
    minWidth: '200px',
  },
  {
    title: 'Status',
    minWidth: '100px',
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
        <Tooltip title="Editar provedor">
          <span>
            <Button
              className="my-3"
              onClick={onUpdate}
              size="small"
              variant="contained"
              color="primary"
              sx={{ minWidth: '3.2rem', aspectRatio: 1 / 1, padding: '0rem', borderRadius: '50%' }}
            >
              <EditIcon />
            </Button>
          </span>
        </Tooltip>

        <Tooltip title="Eliminar provedor">
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

export const Credits = () => {
  const [querySearch, setQuerySearch] = useState('');
  const [dataList, setDataList] = useState([]);
  const [form, setForm] = useState({
    search: querySearch,
    page: 1,
    limit: 25,
    total: 0,
  });

  // Consumiendo endpoints
  const { makeRequest, response, loading } = useRequest(getCredits);

  const { triggerAction } = useNativeDebounce(600);

  // Ejecuta cuando cambia search, page o limit
  useEffect(() => {
    handleFilterSearchQuery();

  }, [form.search, form.page, form.limit]);

  // Actualiza dataList y total solo cuando llega nueva respuesta
  useEffect(() => {
    if (!response) return;
    console.log('Response received:', response);
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

  const handleChangePage = (page) => {
    setForm((prev) => ({
      ...prev,
      page: page,
    }));
  };

  const handleChangeItems = (items) => {
    setForm((prev) => ({
      ...prev,
      limit: items,
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
              onChange={(query) => setQuerySearch(query)}
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={1} className="p-2">
            <Grid item xs={12} className="p-8 mb-24">
              <div className="flex flex-row w-full justify-end">
                <div className="mx-10 my-2 md:my-0 justify-center items-center flex">
                  <Button
                    variant="contained"
                    color="primary"
                    size="medium"
                    fullWidth
                    onClick={() => console.log('Agregar producto')}
                  >
                                Agregar producto
                  </Button>
                </div>

                <Paginator
                  totalPages={form.total}
                  totalItems={form.limit}
                  onChangeCurrentPage={(page) => handleChangePage(page)}
                  onChangeItemsPerPage={(items) => handleChangeItems(items)}
                  currentPage={form.page}
                  currentItemsPerPage={form.limit}
                />
              </div>
            </Grid>
          </Grid>
          <div className="flex flex-col justify-center">
            <ComposedTable
              className="w-full"
              headers={tableRowScheme}
              data={dataList}
              loading={loading}
            >
              <ComposedTable.Column
                // Nombre cliente
                content={({ sale }) => sale?.user?.username ?? '-'}
              />
              <ComposedTable.Column
                // Correo
                content={({ sale }) => sale?.user?.email ?? '-'}
              />
              <ComposedTable.Column
                // Teléfono
                content={({ sale }) => sale?.user?.phone ?? '-'}
              />
              <ComposedTable.Column
                // Monto total (del crédito)
                content={({ amount }) => `$${amount?.toFixed(2) ?? '-'}`}
              />
              <ComposedTable.Column
                // Total venta asociada al crédito
                content={({ sale }) => `$${sale?.total?.toFixed(2) ?? '-'}`}
              />
              <ComposedTable.Column
                // Último pago (último movimiento en changes)
                content={({ changes }) => {
                  if (!changes?.length) return '-';
                  const last = changes[changes.length - 1];
                  return last
                    ? `$${last.changeAmount?.toFixed(2)} - ${new Date(last.date).toLocaleDateString()}`
                    : '-';
                }}
              />
              <ComposedTable.Column
                // Status
                content={({ status }) => status}
              />
              <ComposedTable.Column
                // Opciones (botones de editar/eliminar)
                content={({ id }) => (
                  <OptionButtons
                    onUpdate={() => console.log('Update', id)}
                    onDelete={() => console.log('Delete', id)}
                  />
                )}
              />

            </ComposedTable>
            <Grid container spacing={1} className="p-2 mt-24 flex">
              <Grid item xs={12} md={12} className="py-8">
                <div className="flex flex-row justify-end">
                  <Paginator
                    totalPages={form.total}
                    totalItems={form.limit}
                    onChangeCurrentPage={(page) => handleChangePage(page)}
                    onChangeItemsPerPage={(items) => handleChangeItems(items)}
                    currentPage={form.page}
                    currentItemsPerPage={form.limit}
                  />
                </div>
              </Grid>
            </Grid>
          </div>
        </Grid>
      </Grid>
    </>
  );
};
