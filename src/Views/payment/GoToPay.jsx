import { useEffect, useState } from 'react';
import {
  Box, Button, Card, Divider, Table, TableBody, TableCell, TableHead, TableRow,
  Typography, Radio, RadioGroup, FormControlLabel, FormLabel, Autocomplete, TextField
} from '@mui/material';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import { useNavigate } from 'react-router-dom';

import { useCart } from '@/Context/CartContext/CartContext';
import { useRequest } from '@/Hooks';
import { catalogUsers } from '@/api/user';
import { createCreditChange, creditByUser } from '@/api/credits';
import { createSale } from '@/api/sales';
import { useAuth } from '@/Context';

export const GoToPay = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Usuarios (clientes)
  const { makeRequest: tryGetUsers, response: dataUsersRaw } = useRequest(catalogUsers);
  const dataUsers = Array.isArray(dataUsersRaw) ? dataUsersRaw : [];
  const [selectedUser, setSelectedUser] = useState(null);

  // Crédito de cliente
  const { makeRequest: tryGetCredit, response: creditUser } = useRequest(creditByUser);

  // Anexando credito de pago
  const { makeRequest: tryCreateChange } = useRequest(createCreditChange);

  // Generar compra
  const { makeRequest: tryCreatePayment } = useRequest(createSale);

  useEffect(() => { tryGetUsers(); }, []);
  useEffect(() => {
    if (selectedUser?.id) tryGetCredit(selectedUser.id);
  }, [selectedUser]);

  // Cálculo de saldo real
  let saldoDisponible = null;
  if (creditUser && typeof creditUser.amount === 'number' && Array.isArray(creditUser.changes)) {
  // Cargo: positivo, Abono: negativo
    const totalMovimientos = creditUser.changes.reduce((acc, mov) => acc + mov.changeAmount, 0);
    saldoDisponible = creditUser.amount - totalMovimientos;
  }

  const items = cart.filter(p => (p.quantity || 0) > 0);
  const subtotal = items.reduce((acc, p) => acc + (p.saleCost || p.price) * (p.quantity || 1), 0);
  const ivaTotal = subtotal * 0.16;
  const total = subtotal + ivaTotal;

  const [paymentType, setPaymentType] = useState('cash');

  // Validación: si paga con crédito, que NO exceda el límite después de la compra
  const canPayWithCredit = paymentType === 'credit'
    ? selectedUser && saldoDisponible !== null && (saldoDisponible - total) >= 0
    : true;

  const handlePay = async () => {
    if (paymentType === 'credit' && !selectedUser) {
      alert('Debes seleccionar un cliente para crédito.');
      return;
    }
    if (items.length === 0) return;
    if (paymentType === 'credit' && !canPayWithCredit) return;

    try {
      const productSales = items.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.saleCost ?? item.price,
        iva: (item.saleCost ?? item.price) * item.quantity * 0.16
      }));

      await tryCreatePayment({
        userId: user.id,
        clientId: paymentType === 'credit' && selectedUser ? selectedUser.id : null,
        total,
        subtotal,
        iva: ivaTotal,
        paymentType: paymentType === 'credit' ? 'CREDITO' : 'EFECTIVO',
        productSales
      });

      // 2. Registrar el movimiento de crédito SOLO si es a crédito
      if (paymentType === 'credit') {
        await tryCreateChange({
          creditId: creditUser.creditId, // obtenido de creditUser
          changeAmount: total,           // cargo (compra) es positivo
          date: new Date().toISOString(),
          // type: 'CARGO' // Si tu backend lo maneja
        });
      }

      clearCart();
      alert('¡Venta registrada correctamente!');
      navigate('/');
    } catch (err) {
      alert('Ocurrió un error al procesar el pago');
      console.error(err);
    }
  };

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', my: 5 }}>
      <Card sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="center" position="relative" mb={2}>
          <Typography variant="h5" fontWeight={700}>
            Ticket de compra
          </Typography>
          <Box position="absolute" right={0}>
            <ShoppingCartCheckoutIcon color="primary" />
          </Box>
        </Box>
        <Divider sx={{ mb: 2 }} />

        {/* Selector de tipo de pago */}
        <Box mb={2}>
          <FormLabel component="legend">Método de pago</FormLabel>
          <RadioGroup
            row
            value={paymentType}
            onChange={e => setPaymentType(e.target.value)}
          >
            <FormControlLabel value="cash" control={<Radio />} label="Efectivo" />
            <FormControlLabel value="credit" control={<Radio />} label="Crédito" />
          </RadioGroup>
        </Box>

        <Autocomplete
          options={dataUsers}
          getOptionLabel={option => option?.username || ''}
          value={selectedUser}
          isOptionEqualToValue={(option, value) => option.id === value?.id}
          onChange={(_, value) => setSelectedUser(value)}
          renderInput={params => (
            <TextField
              {...params}
              placeholder="Selecciona usuario"
              label="Cliente"
              variant="outlined"
              required={paymentType === 'credit'}
              error={paymentType === 'credit' && !selectedUser}
            />
          )}
          sx={{ mb: 2 }}
          disabled={paymentType !== 'credit'}
        />

        {/* Crédito solo si es crédito y hay usuario */}
        {paymentType === 'credit' && selectedUser && creditUser && (
          <Typography variant="body2" color="primary" sx={{ mb: 1 }}>
            Crédito disponible: ${saldoDisponible !== null ? saldoDisponible.toFixed(2) : '---'}
          </Typography>
        )}

        {/* Mensaje si no hay crédito suficiente */}
        {paymentType === 'credit' && selectedUser && !canPayWithCredit && (
          <Typography color="error" variant="body2" mb={1}>
            El cliente no tiene suficiente crédito para esta compra.
          </Typography>
        )}

        {/* Tabla de productos */}
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#081b29' }}>
              <TableCell sx={{ color: '#fff' }}>Producto</TableCell>
              <TableCell align="right" sx={{ color: '#fff' }}>Precio</TableCell>
              <TableCell align="right" sx={{ color: '#fff' }}>Cantidad</TableCell>
              <TableCell align="right" sx={{ color: '#fff' }}>IVA</TableCell>
              <TableCell align="right" sx={{ color: '#fff' }}>Subtotal</TableCell>
              <TableCell align="right" sx={{ color: '#fff' }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.length > 0 ? items.map((item, index) => {
              const precio = item.saleCost ?? item.price;
              const cantidad = item.quantity || 1;
              const subtotalItem = precio * cantidad;
              const ivaItem = subtotalItem * 0.16;
              return (
                <TableRow key={index}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell align="right">${precio.toFixed(2)}</TableCell>
                  <TableCell align="right">{cantidad}</TableCell>
                  <TableCell align="right">${ivaItem.toFixed(2)}</TableCell>
                  <TableCell align="right">${subtotalItem.toFixed(2)}</TableCell>
                  <TableCell align="right">
                    <Button size="small" color="error" onClick={() => removeFromCart(item.barcode)}>
                      Quitar
                    </Button>
                  </TableCell>
                </TableRow>
              );
            }) : (
              <TableRow>
                <TableCell colSpan={6} align="center">No hay productos en el carrito</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <Divider sx={{ my: 2 }} />

        <Box className="flex justify-between items-center"
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="body2">Subtotal: ${subtotal.toFixed(2)}</Typography>
            <Typography variant="body2">IVA (16%): ${ivaTotal.toFixed(2)}</Typography>
            <Typography variant="h6">Total: ${total.toFixed(2)}</Typography>
          </Box>
          <Button
            variant="contained"
            color="success"
            onClick={handlePay}
            disabled={
              items.length === 0 ||
              (paymentType === 'credit' && (!selectedUser || !canPayWithCredit))
            }
          >
            Checkout
          </Button>
        </Box>
      </Card>
    </Box>
  );
};
