import { Box, Typography } from '@mui/material';
import clsx from 'clsx';

export const SuggestionPrompt = ({
  children,
  icon,
  bgColor = '#E3F2FD',
  textColor = 'text-blue-900',
  className = '',
  cln = '',
}) => {
  return (
    <Box
      sx={{ backgroundColor: bgColor }}
      className={clsx(
        'flex items-center gap-4 p-4 rounded-lg',
        textColor,
        className
      )}
    >
      {icon && <div>{icon}</div>}
      <Typography
        variant="body2"
        className={clsx('text-sm m-0 p-0', cln)}
      >
        {children}
      </Typography>
    </Box>
  );
};
