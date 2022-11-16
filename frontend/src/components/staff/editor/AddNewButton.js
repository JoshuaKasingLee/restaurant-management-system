import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import NewCategoryDialog from './NewCategoryDialog';
import NewItemDialog from './NewItemDialog';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';

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
        id="basic-button"
        variant="contained"
        onClick={handleClick}
        endIcon={!open 
          ? <KeyboardArrowDownRoundedIcon/>
          : <KeyboardArrowUpRoundedIcon/>}
      >
        Add New
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={() => {handleClose(); setOpenNewCategory(true);}}>Category</MenuItem>
        <MenuItem onClick={() => {handleClose(); setOpenNewItem(true);}}>Food Item</MenuItem>
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



