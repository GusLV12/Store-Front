import {
  Children,
  cloneElement,
  createContext,
  memo,
  useContext,
  useEffect,
  useState,
} from 'react';
import { styled } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import Avatar from '@mui/material/Avatar';
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import HideImageOutlinedIcon from '@mui/icons-material/HideImageOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import _ from 'lodash';
import clsx from 'clsx';

const initialLetters = (text) => {
  const result = text
    .split(' ')
    .map((word) => word[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
  return result;
};

const stickyRightCommonStyled = 'md:sticky md:right-0 md:border-l-1';
const stickyLeftCommonStyled = 'md:sticky md:left-0 md:border-r-1';

const stickyRightHeadStyled = 'md:border-l-neutral-700 md:shadow-md';
const stickyLeftHeadStyled = 'md:border-r-neutral-700 md:shadow-md';

const stickyRightRowStyled = 'md:border-l-neutral-400 md:shadow-md';
const stickyLeftRowStyled = 'md:border-r-neutral-400 md:shadow-md';

const TableContext = createContext({});
const { Provider } = TableContext;

const WithProvider = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  return <Provider value={{ isCollapsed, setIsCollapsed }}>{children}</Provider>;
};

const Collapsed = ({ nestedData }) => {
  const { isCollapsed } = useContext(TableContext);
  const [metadata, setMetadata] = useState([]);

  const transformMetadata = (metadataField = {}) => {
    const transformedMetadata = Object.keys(metadataField).map((key) => ({
      keyObj: key,
      valueObj: metadataField[key],
    }));
    setMetadata(transformedMetadata);
  };

  useEffect(() => {
    if (!nestedData) {
      return;
    }
    transformMetadata(nestedData);
  }, [nestedData]);

  return (
    <TableRow>
      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
        <Collapse in={isCollapsed} timeout="auto" unmountOnExit>
          <Box sx={{ margin: 1 }}>
            {metadata.length > 0 ? (
              <Table size="small" aria-label="metadata">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: '100%' }}>Clave</TableCell>
                    <TableCell sx={{ width: '100%' }}>Valor</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {metadata.map((rowItem, index) => (
                    <TableRow key={`nestedtable_${rowItem.keyObj}_${index}`}>
                      <TableCell component="th" scope="row">
                        {rowItem.keyObj}
                      </TableCell>
                      <TableCell>{rowItem.valueObj}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-auto w-full py-16 flex-col justify-center items-center">
                <Typography variant="subtitle1" gutterBottom>
                  No hay datos disponibles
                </Typography>
              </div>
            )}
          </Box>
        </Collapse>
      </TableCell>
    </TableRow>
  );
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    height: '5rem',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
  '&:hover': {
    backgroundColor: theme.palette.grey[400], // Cambiar a un color con más contraste
  },
}));

export const ComposedTable = ({
  selectable = false,
  onRowClick = () => {},
  children,
  headers = [],
  data,
  metadata = () => {},
  isLoading,
  size = 'small',
  headerBgColor,
  headerTxtColor,
}) => {
  return (
    <TableContainer
      component={Paper}
      sx={{ borderRadius: '0.4rem', position: 'relative', maxHeight: '180rem', minHeight: '16rem' }}
    >
      <Table aria-label="composed table component" size={size} stickyHeader>
        <TableHead>
          <TableRow>
            {headers.map(
              (
                { title, width, minWidth, maxWidth, fixedRight, fixedLeft, align = 'center' },
                index
              ) => (
                <StyledTableCell
                  key={`${title}_${index}`}
                  align={align}
                  style={{
                    width,
                    minWidth,
                    maxWidth,
                    backgroundColor: headerBgColor,
                    color: headerTxtColor,
                  }}
                  className={clsx(
                    fixedRight &&
                      !fixedLeft &&
                      `${stickyRightCommonStyled} ${stickyRightHeadStyled}`,
                    !fixedRight && fixedLeft && `${stickyLeftCommonStyled} ${stickyLeftHeadStyled}`
                  )}
                >
                  {title}
                </StyledTableCell>
              )
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item, indexRow) => (
            <WithProvider key={indexRow}>
              <StyledTableRow
                onClick={() => onRowClick(indexRow, item)}
                sx={{ cursor: selectable ? 'pointer' : undefined }}
              >
                {Children.map(children, (child) => {
                  return cloneElement(child, { item });
                })}
              </StyledTableRow>
              <Collapsed nestedData={_.has(item, 'metadata') ? item.metadata : undefined} />
            </WithProvider>
          ))}
        </TableBody>
      </Table>
      {!data.length > 0 && !isLoading && (
        <div
          className="bg-slate-950 h-full w-full left-0 top-0 bg-opacity-50 flex flex-auto justify-center items-end"
          style={{ position: 'absolute' }}
        >
          <div className="mt-16 mb-24">
            <Typography variant="body2">No hay datos que mostrar</Typography>
          </div>
        </div>
      )}
      {isLoading && (
        <div
          className="h-full w-full left-0 top-0 flex flex-auto justify-center items-center"
          style={{
            position: 'absolute',
            backgroundColor: 'rgba(56, 56, 56, 0.22)',
            backdropFilter: 'blur(1px)',
            zIndex: 100,
          }}
        >
          <div className="mt-16">
            <CircularProgress sx={{ color: '#FEFEFE' }} size={60} />
          </div>
        </div>
      )}
    </TableContainer>
  );
};

const Column = ({ fixedRight, fixedLeft, content = () => {}, item }) => {
  const HandleRenderCol = () => {
    const rendered = content(item);
    if (typeof rendered === 'string') {
      return (
        <Typography
          sx={{
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            WebkitLineClamp: 3,
            lineClamp: 3,
            wordBreak: 'break-all',
          }}
        >
          {rendered}
        </Typography>
      );
    }

    return rendered;
  };

  return (
    <StyledTableCell
      align="center"
      sx={{ backgroundColor: (_theme) => _theme.palette.background.default }}
      className={clsx(
        fixedRight && !fixedLeft && `${stickyRightCommonStyled} ${stickyRightRowStyled}`,
        !fixedRight && fixedLeft && `${stickyLeftCommonStyled} ${stickyLeftRowStyled}`
      )}
    >
      <HandleRenderCol />
    </StyledTableCell>
  );
};

const NestedButton = () => {
  const { isCollapsed, setIsCollapsed } = useContext(TableContext);
  return (
    <IconButton aria-label="expand row" size="small" onClick={() => setIsCollapsed(!isCollapsed)}>
      {!isCollapsed ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
    </IconButton>
  );
};

const Thumbail = ({ baseUri, path, alt, name, color, className, style, square = false }) => {
  return (
    <div className="flex justify-center items-center">
      <Avatar
        alt={alt}
        sx={{ bgcolor: color || undefined }}
        variant={square ? 'square' : undefined}
        src={`${baseUri || ''}${baseUri ? '/' : ''}${path}`}
        style={style}
        className={clsx(className)}
      >
        {name !== undefined && initialLetters(name)}
      </Avatar>
    </div>
  );
};

const Preview = ({ baseUri, path = '', alt, width, height, aspectRatio, style, className }) => {
  return typeof path !== 'string' || path === undefined || path.trim().length === 0 ? (
    <div className={clsx('flex flex-row justify-center items-center', className)}>
      <HideImageOutlinedIcon />
    </div>
  ) : (
    <div
      className={clsx('flex flex-row justify-center', className)}
      style={{ width, height, aspectRatio, ...style }}
    >
      <img className="w-full object-contain" alt={alt} src={`${baseUri || ''}${baseUri ? '/' : ''}${path}`} />
    </div>
  );
};

ComposedTable.Column = Column;
ComposedTable.NestedButton = memo(NestedButton);
ComposedTable.Thumbail = Thumbail;
ComposedTable.Preview = Preview;
