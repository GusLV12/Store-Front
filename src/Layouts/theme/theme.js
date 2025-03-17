import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#051221', // Azul primario
    },
    secondary: {
      main: '#D32F2F', // Rojo secundario
    },
    background: {
      default: '#F5F5F5', // Fondo general blanco
    },
    text: {
      primary: '#333333', // Color de texto principal
      secondary: '#ffffff', // Color de texto secundario
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});
