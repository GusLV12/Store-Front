import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#051221', // Azul primario
    },
    secondary: {
      main: '#1976D2', // Rojo secundario
    },
    background: {
      default: '#F5F5F5', // Fondo general blanco
    },
    text: {
      primary: '#333333', // Color de texto principal
      secondary: '#ffffff', // Color de texto secundario
    },
    success: {
      main: '#4CAF50', // Verde para éxito
    },
    error: {
      main: '#F44336', // Rojo para error
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});
