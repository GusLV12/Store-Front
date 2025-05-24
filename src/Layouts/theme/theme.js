import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#051221',
    },
    secondary: {
      main: '#1976D2',
    },
    background: {
      default: '#F5F5F5',
    },
    text: {
      primary: '#333333',
      secondary: '#ffffff',
    },
    success: {
      main: '#4CAF50',
    },
    error: {
      main: '#F44336',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '999px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        outlined: {
          borderRadius: '999px',
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          borderCollapse: 'separate',
          borderSpacing: '0 0.5rem',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#ccc',
          '& th': {
            fontWeight: 600,
            fontSize: '0.875rem',
            color: '#ccc',
            textTransform: 'uppercase',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#e0f7fa',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: '#051221',
          color: '#FFFFFF',
          fontWeight: 400,
          fontSize: '0.85rem',
          textTransform: 'uppercase',
        },
      },
    },
  },
});
