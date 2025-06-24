import { memo, useEffect, useState } from 'react';
import { Grid, Box, Tooltip, Button, Chip } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';

import { useNativeDebounce, useRequest } from '@/Hooks';
import { deleteSupplier, getSuppliers } from '@/api/suppliers';
import { useModal } from '@/Context/ModalContext/ModalContext';

import { ComposedTable, DeleteModal, InputSearch, Paginator } from '../../Components/index';

const tableRowScheme = [
  {
    title: 'Nombre empresa',
    minWidth: '220px',
  },
  {
    title: 'Nombre contacto',
    width: '180px',
    minWidth: '180px',
  },
  {
    title: 'Teléfono',
    minWidth: '140px',
  },
  {
    title: 'Correo',
    minWidth: '140px',
  },
  {
    title: 'Dirección',
    width: '160px',
    maxWidth: '200px',
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
        <Tooltip title="Editar proveedor">
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

export const Suppliers = () => {
  const { openModal, closeModal, } = useModal();
  const [querySearch, setQuerySearch] = useState('');
  const [dataList, setDataList] = useState([]);
  const [form, setForm] = useState({
    search: querySearch,
    page: 1,
    limit: 25,
    total: 0,
  });

  // Navegacion a rutas hijas
  const navigate = useNavigate();

  // Consumiendo endpoints
  const { makeRequest, response, loading } = useRequest(getSuppliers);
  const { makeRequest: tryDeleteSupplier } = useRequest(deleteSupplier);

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

  // Modal de eliminar
  const handleDelete = (id) => openModal(
    <DeleteModal
      open
      onClose={(wasDeleted) => {
        closeModal();
        if (wasDeleted) {
          handleFilterSearchQuery();
        }
      }}
      id={id}
      descripcion="¿Seguro que deseas eliminar este proveedor?"
      makeRequest={() => tryDeleteSupplier(id)}
    />);

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
    navigate('/suppliers/create');
  };

  const handleUpdate = (id) => {
    navigate(`/suppliers/edit/${id}`);
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
            <div className="px-4 py-4">
              <Button
                variant="contained"
                color="primary"
                className="whitespace-nowrap mx-4"
                onClick={handleCreate}
              >
              Agregar provedor
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
              <ComposedTable.Column content={({ companyName }) => companyName} />
              <ComposedTable.Column content={({ contactName }) => contactName} />
              <ComposedTable.Column content={({ phone }) => phone} />
              <ComposedTable.Column content={({ email }) => email} />
              <ComposedTable.Column content={({ address }) => address} />
              <ComposedTable.Column content={({ status }) => (
                <Chip label={status ? 'Activo' : 'Inactivo'} color={status ? 'success' : 'error'} variant="outlined" />
              )} />

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
