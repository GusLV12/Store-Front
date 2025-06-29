import { useEffect, useState } from 'react';
import {
  Box, Paper, Typography, Autocomplete, TextField,
  Table, TableHead, TableBody, TableRow, TableCell, Button
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { useRequest } from '@/Hooks';
import { catalogUsers } from '@/api/user';
import { creditByUser, createCreditChange } from '@/api/credits';

import { schemaPayCredit } from './validators/payValidation';
const defaultValues = { amount: '' };

export function PayCredit() {
  const navigate = useNavigate();

  const { makeRequest: tryGetUsers, response: dataUsersRaw } = useRequest(catalogUsers);
  const dataUsers = Array.isArray(dataUsersRaw) ? dataUsersRaw : [];
  const [selectedUser, setSelectedUser] = useState(null);

  const { makeRequest: tryGetCredit, response: creditUser } = useRequest(creditByUser);
  const { makeRequest: tryCreateChange } = useRequest(createCreditChange);

  const {
    control, handleSubmit, reset,
    formState: { errors, isValid, dirtyFields }
  } = useForm({
    defaultValues,
    resolver: yupResolver(schemaPayCredit),
    mode: 'onChange',
  });

  useEffect(() => { tryGetUsers(); }, []);

  useEffect(() => {
    if (selectedUser?.id) tryGetCredit(selectedUser.id);
    // eslint-disable-next-line
  }, [selectedUser]);

  // Cálculo del saldo real (crédito disponible)
  let saldoDisponible = null;
  let totalDeuda = 0;
  if (creditUser && typeof creditUser.amount === 'number' && Array.isArray(creditUser.changes)) {
    // Cargo: positivo, Abono: negativo (ajustar según tu backend)
    totalDeuda = creditUser.changes.reduce((acc, mov) => acc + mov.changeAmount, 0);
    saldoDisponible = creditUser.amount - totalDeuda;
  }

  let mensajeSaldo = '';
  let colorSaldo = 'primary';
  if (saldoDisponible !== null) {
    if (saldoDisponible > 0) {
      mensajeSaldo = `Disponible: $${saldoDisponible.toFixed(2)}`;
      colorSaldo = 'success.main';
    } else if (saldoDisponible === 0) {
      mensajeSaldo = '¡Ha alcanzado su límite!';
      colorSaldo = 'warning.main';
    } else {
      mensajeSaldo = `Excedido: $${Math.abs(saldoDisponible).toFixed(2)}`;
      colorSaldo = 'error';
    }
  }

  // Abonar: abono es negativo (reduce la deuda)
  const onSubmit = async ({ amount }) => {
    if (!creditUser?.creditId) {
      alert('El usuario no tiene crédito activo.');
      return;
    }
    try {
      await tryCreateChange({
        creditId: creditUser.creditId,
        // Un abono es NEGATIVO para reducir la deuda
        changeAmount: -Math.abs(Number(amount)),
        date: new Date().toISOString(),
      });
      alert('Abono registrado correctamente');
      reset(defaultValues);
      tryGetCredit(selectedUser.id);
    } catch (err) {
      alert('Ocurrió un error al registrar el abono');
      console.error(err);
    }
  };

  return (
    <Box
      sx={{
        bgcolor: '#f6f8fb',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          borderRadius: 5,
          px: { xs: 2, md: 6 },
          py: { xs: 3, md: 5 },
          minWidth: { xs: 320, md: 540 },
          maxWidth: 700,
          width: '100%',
        }}
      >
        <Button
          variant="text"
          color="primary"
          sx={{ mb: 2, borderRadius: 2, fontWeight: 600 }}
          onClick={() => navigate('/')}
          startIcon={<ArrowBackIcon/>}
        >
          Ir a inicio
        </Button>

        <Typography
          variant="h4"
          align="center"
          sx={{ fontWeight: 700, color: '#22223B', mb: 4, letterSpacing: 1 }}
        >
          Abonar a crédito
        </Typography>
        <Box mb={4}>
          <Autocomplete
            options={dataUsers}
            getOptionLabel={(option) => option?.username || ''}
            value={selectedUser}
            isOptionEqualToValue={(option, value) => option.id === value?.id}
            onChange={(_, value) => setSelectedUser(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Selecciona usuario"
                label="Cliente"
                variant="outlined"
                sx={{ borderRadius: 2 }}
              />
            )}
          />
        </Box>

        {selectedUser && creditUser && (
          <Box>
            <Typography fontWeight={600} mb={1}>
              Límite de crédito: ${creditUser.amount?.toFixed(2)}
            </Typography>
            <Typography fontWeight={600} mb={2} color={colorSaldo}>
              {mensajeSaldo}
            </Typography>
            {/* Formulario de abono */}
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
              <Box mb={2} display="flex" alignItems="center" gap={2}>
                <Controller
                  name="amount"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Monto a abonar"
                      fullWidth
                      type="number"
                      error={!!errors.amount}
                      helperText={errors?.amount?.message}
                      variant="outlined"
                      sx={{ borderRadius: 2 }}
                      inputProps={{ min: 1 }}
                    />
                  )}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={!isValid || !dirtyFields.amount}
                  sx={{
                    fontWeight: 700,
                    borderRadius: 2,
                    bgcolor: '#4f8cff',
                    '&:hover': { bgcolor: '#246efd' },
                  }}
                >
                  Abonar
                </Button>
              </Box>
            </form>
            {/* Tabla de movimientos */}
            <Typography fontWeight={600} mb={1} mt={3}>
              Historial de movimientos
            </Typography>
            {creditUser.changes.length > 0 ? (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Monto</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {creditUser.changes.map((mov) => (
                    <TableRow key={mov.id}>
                      <TableCell>
                        {new Date(mov.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {mov.changeAmount < 0
                          ? `Abono $${Math.abs(mov.changeAmount)}`
                          : `Cargo $${mov.changeAmount}`}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No hay movimientos registrados.
              </Typography>
            )}
          </Box>
        )}
        {selectedUser && !creditUser && (
          <Typography color="error" fontWeight={600}>
            Este usuario no tiene crédito activo.
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
