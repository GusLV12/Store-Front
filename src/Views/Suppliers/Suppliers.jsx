import { memo, useState } from 'react';
import { Grid, Box, Tooltip, Button } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CloudSyncIcon from '@mui/icons-material/CloudSync';

import { ComposedTable, InputSearch } from '../../Components/index';

const tableRowScheme = [
  {
    title: 'Nombre empresa',
    width: '180px',
    minWidth: '180px',
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
    title: 'Productos',
    width: '200px',
    minWidth: '200px',
  },
  {
    title: 'Status',
    minWidth: '100px',
  },
  {
    title: 'Opciones',
    minWidth: '260px',
    fixedRight: true,
  },
];

const dataList = [
  {
    companyName: 'Distribuidora El Sol',
    contactName: 'María López',
    phone: '555-123-4567',
    email: 'contacto@elsol.com',
    address: 'Av. Reforma 123, CDMX',
    products: 'Abarrotes, Lácteos',
    status: 'Activo',
    options: null // Aquí puedes agregar botones o acciones en tu componente de tabla
  },
  {
    companyName: 'Frutas Selectas SA',
    contactName: 'Carlos Ramírez',
    phone: '555-765-4321',
    email: 'ventas@frutasselectas.com',
    address: 'Calle Naranjo 45, Puebla',
    products: 'Frutas y Verduras',
    status: 'Inactivo',
    options: null
  },
  {
    companyName: 'SuperAlimentos MX',
    contactName: 'Laura Gómez',
    phone: '556-987-1234',
    email: 'laura.gomez@superalimentos.mx',
    address: 'Boulevard Tecnológico 88, Toluca',
    products: 'Cereales, Snacks',
    status: 'Activo',
    options: null
  },
  {
    companyName: 'Lácteos del Norte',
    contactName: 'José Hernández',
    phone: '553-321-9876',
    email: 'jhernandez@lacteosnorte.com',
    address: 'Carr. Nacional Km 45, Monterrey',
    products: 'Queso, Yogur, Leche',
    status: 'Activo',
    options: null
  }
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
              sx={{ minWidth: '3.2rem', aspectRatio: 1 / 1, padding: '0rem' }}
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
              sx={{ minWidth: '3.2rem', aspectRatio: 1 / 1, padding: '0rem' }}
            >
              <DeleteForeverIcon />
            </Button>
          </span>
        </Tooltip>
      </div>
    );
  });

export const Suppliers = () => {
  const [querySearch, setQuerySearch] = useState('');
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
          <div className="flex flex-col justify-center">
            <ComposedTable
              className="w-full"
              headers={tableRowScheme}
              data={dataList}
            >
              <ComposedTable.Column content={({ companyName }) => companyName} />
              <ComposedTable.Column content={({ contactName }) => contactName} />
              <ComposedTable.Column content={({ phone }) => phone} />
              <ComposedTable.Column content={({ email }) => email} />
              <ComposedTable.Column content={({ address }) => address} />
              <ComposedTable.Column content={({ products }) => products} />
              <ComposedTable.Column content={({ status }) => status} />
              <ComposedTable.Column
                content={({ id, status }) => (
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
