import { ThemeProvider, CssBaseline } from '@mui/material';

import { theme } from '../theme/theme';

export function ThemeLayout({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="bg-background min-h-screen">{children}</div>
    </ThemeProvider>
  );
}
