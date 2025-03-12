import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1976D2', // Azul primario
    },
    secondary: {
      main: '#D32F2F', // Rojo secundario
    },
    background: {
      default: '#F5F5F5', // Fondo general blanco
    },
    text: {
      primary: '#333333', // Color de texto principal
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});
