import Pagination from '@mui/material/Pagination';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import { Grid, Typography } from '@mui/material';

export const Paginator = ({
  props,
  onChangeCurrentPage = () => { },
  onChangeItemsPerPage = () => { },
  totalPages = 0,
  totalItems = 0,
  currentItemsPerPage = 25,
  currentPage = 1,
  style = {},
}) => {

  const handleChangeItems = ({ target }) => {
    onChangeItemsPerPage(target.value);
  };

  const handleChangePage = (event, number) => {
    onChangeCurrentPage(number);
  };

  return (
    <div
      {...props}
      className="flex row justify-end items-center"
      style={{ width: '100%', maxWidth: '480px', ...style }}
    >
      <Grid container className="p-4">
        <Grid item xs={12} sm={6}>
          <div className="flex flex-row justify-center sm:justify-end items-center pr-16">
            <div className="mr-16" style={{ minWidth: '50px' }}>
              <Typography className="text-base p-0 m-0" gutterBottom>
                {`Total ${totalItems}`}
              </Typography>
            </div>
            <FormControl>
              <InputLabel id="select-pagination">Items/Pag</InputLabel>
              <Select
                labelId="select-pagination"
                id="select-pagination"
                value={currentItemsPerPage}
                onChange={handleChangeItems}
                input={<OutlinedInput id="select-pagination-label" label="No Items" />}
                label="Items"
                size="small"
                sx={{ justifyContent: 'center', alignItems: 'center', minWidth: '8rem' }}
              >
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
                <MenuItem value={200}>200</MenuItem>
              </Select>
            </FormControl>
          </div>
        </Grid>
        <Grid item xs={12} sm={6}>
          <div
            className="flex flex-row justify-center sm:justify-start h-full items-center pt-16 pb-8 sm:pt-0 sm:pb-0 px-8"
          >
            <Pagination size="small" siblingCount={0} page={currentPage} count={totalPages} onChange={handleChangePage} />
          </div>
        </Grid>
      </Grid>
    </div>
  );
};
