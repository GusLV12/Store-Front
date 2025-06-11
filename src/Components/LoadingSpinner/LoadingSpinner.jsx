import { CircularProgress, Stack } from '@mui/material';

export const LoadingSpinner = () => {
  return (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      sx={{
        width: '100%',
        height: '70vh'
      }}
    >
      <CircularProgress size="6rem" />
    </Stack>
  );
};
