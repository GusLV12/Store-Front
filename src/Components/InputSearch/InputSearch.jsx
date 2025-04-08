import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import clsx from 'clsx';

export const InputSearch = ({
  onChange = () => {},
  value,
  onClear = () => {},
  onSearch = () => {},
  unlink = false,
  label,
  helper,
  placeholder,
  sx,
  className,
  innerClassName,
  width = '100%',
  ...props
}) => {
  // const [searchValue, setSearchValue] = useState('');

  const handleChange = ({ target }) => {
    onChange(target.value);
  };

  const handleClear = () => {
    onChange('');
    onClear();
  };

  // * Función para manejar el evento keydown y prevenir el comportamiento por defecto al presionar Enter
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      onSearch();
    }
  };

  return (
    <Paper
      variant="outlined"
      component="div"
      className={clsx(className)}
      sx={{
        p: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width,
        height: '4.2rem',
        borderColor: '#BBB',
        ...sx,
      }}
    >
      <IconButton sx={{ p: '10px' }} aria-label="menu" onClick={onSearch}>
        <SearchIcon />
      </IconButton>
      <InputBase
        name={label}
        size="small"
        fullWidth
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || 'Buscar'}
        className={clsx('text-base mt-3', innerClassName)}
        inputProps={{ 'aria-label': label }}
        align="center"
        {...props}
      />
      {helper && (
        <>
          <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
          {helper}
        </>
      )}
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <IconButton
        size="small"
        type="button"
        sx={{ p: '10px' }}
        aria-label="clear"
        onClick={handleClear}
      >
        <ClearIcon />
      </IconButton>
    </Paper>
  );
};
