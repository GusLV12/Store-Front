import {
  Box,
  Button,
  Card,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import { useNavigate } from 'react-router-dom';

import { useCart } from '@/Context/CartContext/CartContext';

export const GoToPay = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const items = cart.filter(p => (p.quantity || 0) > 0);

  const subtotal = items.reduce((acc, p) => acc + (p.saleCost || p.price) * (p.quantity || 1), 0);
  const ivaTotal = subtotal * 0.16;
  const total = subtotal + ivaTotal;

  const handlePay = () => {
    clearCart();
    alert('¡Pago realizado! Gracias por tu compra.');
    navigate('/');
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
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Producto</TableCell>
              <TableCell align="right">Precio</TableCell>
              <TableCell align="right">Cantidad</TableCell>
              <TableCell align="right">IVA</TableCell>
              <TableCell align="right">Subtotal</TableCell>
              <TableCell align="right"></TableCell>
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
        <Box className="flex justify-between items-center" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="body2">Subtotal: ${subtotal.toFixed(2)}</Typography>
            <Typography variant="body2">IVA (16%): ${ivaTotal.toFixed(2)}</Typography>
            <Typography variant="h6">Total: ${total.toFixed(2)}</Typography>
          </Box>
          <Button
            variant="contained"
            color="success"
            onClick={handlePay}
            disabled={items.length === 0}
          >
            Checkout
          </Button>
        </Box>
      </Card>
    </Box>
  );
};
