import { Box, Card, CardActionArea, CardActions, CardContent, CardMedia, IconButton, Typography } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useState } from 'react';

export const ProductCard = ({ img = 'img/banners/boxes.jpg', name = 'producto', description = '', stock, price }) => {
  const[quantity, setQuantity] = useState(0);

  const handleAdd = () => {
    if (quantity < stock) {
      setQuantity(quantity + 1);
    }
  };
  const handleRemove = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
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
          <IconButton aria-label="previous" onClick={handleRemove}>
            <RemoveCircleOutlineIcon />
          </IconButton>
          <IconButton aria-label="play/pause">
            {quantity}
          </IconButton>
          <IconButton aria-label="next" onClick={handleAdd}>
            <AddCircleOutlineIcon />
          </IconButton>
        </Box>
      </CardActions>
    </Card>
  );
};
