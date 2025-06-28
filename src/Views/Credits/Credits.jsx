import { memo, useEffect, useState } from 'react';
import { Grid, Box, Tooltip, Button } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';

import { useNativeDebounce, useRequest } from '@/Hooks';
import { getCredits, deleteCredit } from '@/api/credits';

import { ComposedTable, DeleteModal, InputSearch, Paginator } from '../../Components';

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
  ({ onUpdate = () => {}, onDelete = () => {} }) => (
    <div className="flex w-full flex-wrap flex-row justify-between items-center">
      <Tooltip title="Editar crédito">
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

      <Tooltip title="Eliminar crédito">
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
  )
);

export const Credits = () => {
  const navigate = useNavigate();
  const [querySearch, setQuerySearch] = useState('');
  const [dataList, setDataList] = useState([]);
  const [form, setForm] = useState({
    search: querySearch,
    page: 1,
    limit: 25,
    total: 0,
  });

  // Endpoints
  const { makeRequest, response, loading } = useRequest(getCredits);
  const { makeRequest: tryDeleteCredit } = useRequest(deleteCredit);

  const { triggerAction } = useNativeDebounce(600);

  // Eliminar
  const handleDelete = (id) => {
    // Aquí deberías usar tu modal como en products
    // Por simplicidad, solo confirm
    if (window.confirm('¿Seguro que deseas eliminar este crédito?')) {
      tryDeleteCredit(id).then(() => handleFilterSearchQuery());
    }
  };

  // Ejecuta cuando cambia search, page o limit
  useEffect(() => {
    handleFilterSearchQuery();
    // eslint-disable-next-line
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
      makeRequest(form);
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

  const handleCreate = () => {
    navigate('/credits/create');
  };

  // Editar
  const handleUpdate = (id) => {
    navigate(`/credits/edit/${id}`);
  };

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Box className="flex justify-center items-center w-full">
            <InputSearch
              className="my-6 w-4/5"
              placeholder="Escribe un nombre para buscar cliente"
              value={querySearch}
              onChange={handleSearchQuery}
            />
            <div className="px-4 py-4">
              <Button
                className="whitespace-nowrap mx-4"
                variant="contained"
                color="primary"
                onClick={handleCreate}
              >
                Agregar crédito
              </Button>
            </div>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={1} className="p-2">
            <Grid item xs={12} className="p-8 mb-24">
              <div className="flex flex-row w-full justify-end">
                <Paginator
                  totalPages={form.total}
                  totalItems={form.limit}
                  onChangeCurrentPage={handleChangePage}
                  onChangeItemsPerPage={handleChangeItems}
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
              isLoading={loading}
            >
              {/* Nombre cliente */}
              <ComposedTable.Column content={({ user }) => user?.username ?? '-'} />
              {/* Correo */}
              <ComposedTable.Column content={({ user }) => user?.email ?? '-'} />
              {/* Teléfono */}
              <ComposedTable.Column content={({ user }) => user?.phone ?? '-'} />
              {/* Monto crédito */}
              <ComposedTable.Column content={({ amount }) => `$${amount?.toFixed(2) ?? '-'}`} />
              {/* Total venta - como ya no tienes sale, puedes mostrar "-" o sumar cambios si quieres */}
              <ComposedTable.Column content={() => '-'} />
              {/* Último pago (último movimiento en changes) */}
              <ComposedTable.Column
                content={({ changes }) => {
                  if (!changes?.length) return '-';
                  const last = changes[changes.length - 1];
                  return last
                    ? `$${last.changeAmount?.toFixed(2)} - ${new Date(last.date).toLocaleDateString()}`
                    : '-';
                }}
              />
              {/* Status */}
              <ComposedTable.Column content={({ status }) => status} />
              {/* Opciones */}
              <ComposedTable.Column
                content={({ id }) => (
                  <OptionButtons
                    onUpdate={() => handleUpdate(id)}
                    onDelete={() => handleDelete(id)}
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
                    onChangeCurrentPage={handleChangePage}
                    onChangeItemsPerPage={handleChangeItems}
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
