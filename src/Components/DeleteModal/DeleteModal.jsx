import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

export const DeleteModal = ({
  open,
  onClose,
  id,
  descripcion = '¿Estas seguro que deseas eliminar este elemento?',
  makeRequest,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleDelete = async () => {
    if (!makeRequest) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      // Puedes adaptar los datos enviados según tu backend
      const res = await makeRequest();
      // Aquí podrías validar si res es OK antes de cerrar
      onClose(true); // true=confirmado
      setSuccess('Terminal eliminada correctamente.');
    } catch (err) {
      setError('Ocurrió un error al eliminar. Intenta de nuevo.');
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setError('');
    onClose(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      aria-labelledby="delete-confirm-title"
      aria-describedby="delete-confirm-description"
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle id="delete-confirm-title" sx={{ textAlign: 'center', pb: 0 }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <DeleteForeverIcon color="error" sx={{ fontSize: 48, mb: 1 }} />
          <Typography variant="h6" fontWeight={600}>
            ¿Eliminar terminal?
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-confirm-description" sx={{ textAlign: 'center', mb: 2 }}>
          {descripcion || '¿Estás seguro que deseas eliminar este elemento? Esta acción no se puede deshacer.'}
        </DialogContentText>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
        <Button
          onClick={handleCancel}
          color="primary"
          variant="outlined"
          sx={{ minWidth: 110, fontWeight: 700, borderRadius: 2 }}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleDelete}
          color="error"
          variant="contained"
          sx={{ minWidth: 110, fontWeight: 700, borderRadius: 2 }}
          startIcon={loading ? <CircularProgress color="inherit" size={18} /> : <DeleteForeverIcon />}
          disabled={loading}
        >
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
