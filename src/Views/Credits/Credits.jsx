import { memo, useEffect, useState } from 'react';
import { Grid, Box, Tooltip, Button, Chip } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';

import { useNativeDebounce, useRequest } from '@/Hooks';
import { getCredits, deleteCredit } from '@/api/credits';
import { useModal } from '@/Context/ModalContext/ModalContext';
import { useAuth } from '@/Context';

import { ComposedTable, DeleteModal, InputSearch, Paginator } from '../../Components';

const tableRowScheme = [
  { title: 'Nombre cliente', minWidth: '220px' },
  { title: 'Correo', minWidth: '180px' },
  { title: 'Teléfono', minWidth: '140px' },
  { title: 'Monto crédito', minWidth: '140px' },
  { title: 'Crédito disponible', width: '160px', maxWidth: '200px' },
  { title: 'Último cambio', width: '200px', minWidth: '200px' },
  { title: 'Status', minWidth: '100px' },
  { title: 'Opciones', minWidth: '100px', fixedRight: true },
];

const OptionButtons = memo(
  ({ onUpdate = () => {}, onDelete = () => {}, role }) => (
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
            disabled={role === 'user'}
          >
            <DeleteForeverIcon />
          </Button>
        </span>
      </Tooltip>
    </div>
  )
);

export const Credits = () => {
  const { openModal, closeModal } = useModal();
  const navigate = useNavigate();
  const { user } = useAuth();
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

  useEffect(() => {
    handleFilterSearchQuery();
    // eslint-disable-next-line
  }, [form.search, form.page, form.limit]);

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

  // Modal de eliminar
  const handleDelete = (id) =>
    openModal(
      <DeleteModal
        open
        onClose={(wasDeleted) => {
          closeModal();
          if (wasDeleted) {
            handleFilterSearchQuery();
          }
        }}
        id={id}
        descripcion="¿Seguro que deseas eliminar este crédito?"
        makeRequest={() => tryDeleteCredit(id)}
      />
    );

  const handleCreate = () => {
    navigate('/credits/create');
  };

  const handleUpdate = (id) => {
    navigate(`/credits/edit/${id}`);
  };

  // --- AQUI MAPEO LA DATA PARA SALDO ACTUAL ---
  const tablaData = dataList.map(item => {
    // Cambios: cargos positivos, abonos negativos (estándar)
    const totalDeuda = item.changes?.reduce((acc, mov) => acc + mov.changeAmount, 0) || 0;
    // Crédito disponible (lo que aún puede gastar)
    const saldoActual = item.amount - totalDeuda;
    return {
      ...item,
      saldoActual,
    };
  });

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
              data={tablaData}
              isLoading={loading}
            >
              <ComposedTable.Column content={({ user }) => user?.username ?? '-'} />
              <ComposedTable.Column content={({ user }) => user?.email ?? '-'} />
              <ComposedTable.Column content={({ user }) => user?.phone ?? '-'} />
              <ComposedTable.Column content={({ amount }) => `$${amount?.toFixed(2) ?? 'N/A'}`} />

              <ComposedTable.Column
                content={({ saldoActual }) => (
                  <span style={{
                    color: saldoActual < 0
                      ? '#d32f2f'
                      : saldoActual < 50
                        ? '#ffa000'
                        : '#388e3c',
                    fontWeight: 600
                  }}>
                    ${saldoActual.toFixed(2)}
                  </span>
                )}
              />

              <ComposedTable.Column
                content={({ changes }) => {
                  if (!changes?.length) return 'N/A';
                  // Ordena por fecha descendente para garantizar que el más reciente sea el primero
                  const ordenados = [...changes].sort(
                    (a, b) => new Date(b.date) - new Date(a.date)
                  );
                  const last = ordenados[0];
                  const esAbono = last.changeAmount < 0;
                  return last ? (
                    <>
                      <span style={{
                        fontWeight: 600,
                        color: esAbono ? '#388e3c' : '#d32f2f'
                      }}>
                        {esAbono ? 'Abono ' : 'Cargo '}
          ${Math.abs(last.changeAmount)}
                      </span>
                      {' - '}
                      <span>{new Date(last.date).toLocaleDateString()}</span>
                    </>
                  ) : '-';
                }}
              />

              <ComposedTable.Column content={({ status }) => (
                <Chip label={status} color={status === 'ACTIVE' ? 'success' : 'primary'} variant="outlined" />
              )} />

              <ComposedTable.Column
                content={({ id }) => (
                  <OptionButtons
                    onUpdate={() => handleUpdate(id)}
                    onDelete={() => handleDelete(id)}
                    role={user?.role}
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
