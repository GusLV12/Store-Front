import { useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';

/**
 * Button based on MUI Button.
 * #### Require external useState() controller
 *
 * @component
 * @param {Object} props - Generic object of functional component
 * @param {string} props.title - title of Button
 * @param {ButtonWithExpand.Item} props.children - Accept children of ButtonWithExpand
 * @returns {JSX.Element} Returns JSX Elements render of MUI.
 * Rest of props check docs:
 * {@link https://mui.com/material-ui/api/button/}
 *
 * @example
 *  * // Render a button with items
 * <ButtonWithExpand
    title="Descargar"
    className="whitespace-nowrap mx-4"
    variant="contained"
    color="success"
    startIcon={<SimCardDownloadOutlinedIcon />}
  >
    <ButtonWithExpand.Item text="Documento PDF" onClick={anyfunction}/>
    <ButtonWithExpand.Item text="Documento Excel" onClick={anyFunction}/>
  </
 */

export const ButtonWithExpand = ({ title, children, ...props }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        {...props}
        id={`${title}_idbtnexpand`}
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        {title}
      </Button>
      <Menu
        id={`${title}_idbtnexpand`}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': `${title}_idbtnexpand`,
        }}
      >
        {children}
      </Menu>
    </div>
  );
};

/**
 * List item based on MUI ListItem.
 *
 * @component
 * @param {Object} props - Generic object of functional component
 * @param {string} props.text - text of button list
 * @param {JSX.Element} props.children - Accept Icon or Text
 * @param {function} props.onChange - Event to listen state change to current value.
 * @returns {JSX.Element} Returns JSX Elements render of MUI.
 *
 */
const Item = ({ icon, text, onClick = () => {}, ...props }) => {
  return (
    <MenuItem sx={{ width: '100%' }} onClick={onClick} {...props}>
      {icon && <ListItemIcon>{icon}</ListItemIcon>}
      {text && <ListItemText>{text}</ListItemText>}
    </MenuItem>
  );
};

ButtonWithExpand.Item = Item;
