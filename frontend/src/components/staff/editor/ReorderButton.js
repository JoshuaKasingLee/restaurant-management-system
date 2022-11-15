import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ReorderCategoryDialog from './ReorderCategoryDialog';
import ReorderItemDialog from './ReorderItemDialog';

export default function ReorderButton({categories, items, updateMenu}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [openReorderCategory, setOpenReorderCategory] = React.useState(false);

  const handleCloseReorderCategory = () => {
    setOpenReorderCategory(false);
  };

  const [openReorderItem, setOpenReorderItem] = React.useState(false);

  const handleCloseReorderItem = () => {
    setOpenReorderItem(false);
  };

  return (
    <>
      <Button
        id="button-reorder"
        variant="contained"
        onClick={handleClick}
      >
        Reorder...
      </Button>
      <Menu
        id="menu-reorder"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={() => {handleClose(); setOpenReorderCategory(true);}}>Categories</MenuItem>
        <MenuItem onClick={() => {handleClose(); setOpenReorderItem(true);}}>Food Items</MenuItem>
      </Menu>
      <ReorderCategoryDialog
        open={openReorderCategory}
        categoriesProps={categories}
        handleClose={handleCloseReorderCategory}
        updateMenu={updateMenu}
      />
      <ReorderItemDialog
        open={openReorderItem}
        itemsProps={items}
        handleClose={handleCloseReorderItem}
        updateMenu={updateMenu}
      />
    </ >
  );
}



