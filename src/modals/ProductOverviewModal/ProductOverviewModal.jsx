import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';

export const ProductOverviewModal = ({ data = [] }) => {
  const cart = data.length ? data : [
    { name: 'Manzanas', price: 12.5, quantity: 3 },
    { name: 'Pan', price: 20, quantity: 2 },
    { name: 'Leche', price: 18, quantity: 1 },
  ];

  const subtotal = cart.reduce((acc, p) => acc + p.price * p.quantity, 0);
  const ivaTotal = subtotal * 0.16;
  const total = subtotal + ivaTotal;

  return (
    <Card sx={{ minWidth: 700, padding: 2 }}>
      <Box display="flex" alignItems="center" justifyContent="center" position="relative" mb={2}>
        <Typography variant="h6" gutterBottom>
          Detalle de la compra
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
          </TableRow>
        </TableHead>
        <TableBody>
          {cart.map((item, index) => {
            const subtotalItem = item.price * item.quantity;
            const ivaItem = subtotalItem * 0.16;
            return (
              <TableRow key={index}>
                <TableCell>{item.name}</TableCell>
                <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                <TableCell align="right">{item.quantity}</TableCell>
                <TableCell align="right">${ivaItem.toFixed(2)}</TableCell>
                <TableCell align="right">${subtotalItem.toFixed(2)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <Divider sx={{ my: 2 }} />

      <Box className="flex justify-between items-center">
        <Box>
          <Typography variant="body2">Subtotal: ${subtotal.toFixed(2)}</Typography>
          <Typography variant="body2">IVA Total (16%): ${ivaTotal.toFixed(2)}</Typography>
          <Typography variant="h6">Total: ${total.toFixed(2)}</Typography>
        </Box>
        <Button variant="contained" color="success">
          Confirmar Pago
        </Button>
      </Box>
    </Card>
  );
};
