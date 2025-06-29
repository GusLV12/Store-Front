import { Box, Card, CardActionArea, CardActions, CardContent, CardMedia, IconButton, Typography } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

import { useCart } from '@/Context/CartContext/CartContext';

export const ProductCard = ({
  img = 'img/banners/boxes.jpg',
  name = 'producto',
  description = '',
  stock,
  price,
  ...product // Pasa todo el producto completo (barcode, id, etc.)
}) => {
  const { setProductQuantity, getQuantity } = useCart();
  const quantity = getQuantity(product.barcode);

  const handleAdd = () => {
    if (quantity < stock) {
      setProductQuantity(product, quantity + 1);
    }
  };
  const handleRemove = () => {
    if (quantity > 0) {
      setProductQuantity(product, quantity - 1);
    }
  };

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={img}
          alt={name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {name}
          </Typography>
          <Typography variant="body2">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions className="flex justify-evenly">

        <Box>
          <Typography
            variant="h6"
            color="primary"
            sx={{ fontWeight: 700, ml: 1 }}
          >
          ${Number(price).toFixed(2)}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
          <IconButton aria-label="previous" onClick={handleRemove} disabled={quantity === 0}>
            <RemoveCircleOutlineIcon />
          </IconButton>
          <IconButton aria-label="quantity" disabled>
            {quantity}
          </IconButton>
          <IconButton aria-label="next" onClick={handleAdd} disabled={quantity >= stock}>
            <AddCircleOutlineIcon />
          </IconButton>
        </Box>
      </CardActions>
    </Card>
  );
};
