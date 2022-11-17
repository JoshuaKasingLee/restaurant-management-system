import * as React from 'react';
import { Button, Menu, MenuItem } from '@mui/material/';
import NewCategoryDialog from './NewCategoryDialog';
import NewItemDialog from './NewItemDialog';
import Iconify from '../../Iconify';

export default function AddNewButton({updateMenu}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [openNewCategory, setOpenNewCategory] = React.useState(false);

  const handleCloseNewCategory = () => {
    setOpenNewCategory(false);
  };

  const [openNewItem, setOpenNewItem] = React.useState(false);

  const handleCloseNewItem = () => {
    setOpenNewItem(false);
  };

  return (
    <>
      <Button
        id="add-new-button"
        variant="contained"
        onClick={handleClick}
        endIcon={<Iconify icon={open ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'} />}
      >
        Add New
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={() => {handleClose(); setOpenNewCategory(true);}}>
          Category
        </MenuItem>
        <MenuItem onClick={() => {handleClose(); setOpenNewItem(true);}}>
          Food Item
        </MenuItem>
      </Menu>
      <NewCategoryDialog
        open={openNewCategory}
        handleClose={handleCloseNewCategory}
        updateMenu={updateMenu}
      />
      <NewItemDialog
        open={openNewItem}
        handleClose={handleCloseNewItem}
        updateMenu={updateMenu}
      />
    </ >
  );
}