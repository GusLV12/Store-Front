import { memo, useEffect, useState } from 'react';
import { Grid, Box, Tooltip, Button } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import LocalOffer from '@mui/icons-material/LocalOffer'
import { useNavigate } from 'react-router-dom';

import { useNativeDebounce, useRequest } from '@/Hooks';
import { deleteProduct, getProducts } from '@/api/products';
import { useModal } from '@/Context/ModalContext/ModalContext';

import { ComposedTable, DeleteModal, InputSearch, Paginator } from '../../Components/index';

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
  ({ onUpdate = () => {}, addPromotion = () => {}, onDelete = () => {} }) => {
    return (
      <div className="flex w-full flex-wrap flex-row justify-between items-center">
        <Tooltip title="Editar producto">
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

        <Tooltip title="Agregar promocion">
          <span>
            <Button
              className="my-3"
              onClick={addPromotion}
              size="small"
              variant="contained"
              color="primary"
              sx={{ minWidth: '3.2rem', aspectRatio: 1 / 1, padding: '0rem', borderRadius: '50%' }}
            >
              <LocalOffer />
            </Button>
          </span>
        </Tooltip>

        <Tooltip title="Eliminar producto">
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

  const { makeRequest, response, loading } = useRequest(getProducts);
  const { makeRequest: tryDeleteProduct } = useRequest(deleteProduct);

  const { triggerAction } = useNativeDebounce(600);

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
      descripcion="¿Seguro que deseas eliminar este producto?"
      makeRequest={() => tryDeleteProduct(id)}
    />);

  // Ejecuta cuando cambia search, page o limit
  useEffect(() => {
    handleFilterSearchQuery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      makeRequest( form );
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
    navigate('/products/create');
  };

  const handleUpdate = (id) => {
    navigate(`/products/edit/${id}`);
  };

  const handlePromotions = (id) => {
    navigate(`/promotions/${id}`);
  }

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
                className="whitespace-nowrap mx-4"
                variant="contained"
                color="primary"
                onClick={handleCreate}
              >
              Agregar producto
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
                    onUpdate={() => handleUpdate(id)}
                    addPromotion={()=> handlePromotions(id)}
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
