import * as React from 'react';
import { Menu, Button, MenuItem, Typography } from '@mui/material';
import Iconify from '../../Iconify';

const SORT_BY_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'priceDesc', label: 'Price: High-Low' },
  { value: 'priceAsc', label: 'Price: Low-High' }
];

function MenuSort({ submit }) {
  const [open, setOpen] = React.useState(null);
  const [sort, setSort] = React.useState({ value: 'none', label: 'None' });

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = (option) => {
    setOpen(null);
    
    if (option.value === 'none' || option.value === 'priceDesc' || option.value === 'priceAsc') {
      setSort(option);
      submit(option);
    } else {
      submit(sort);
    }
  };

  return (
    <>
      <Button
        color="inherit"
        disableRipple
        onClick={handleOpen}
        endIcon={<Iconify icon={open ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'} />}
        sx={{ mr: 5 }}
      >
        Sort By:&nbsp;
        <Typography component="span" variant="subtitle2" sx={{ color: 'text.secondary' }}>
          {sort.label}
        </Typography>
      </Button>
      <Menu
        keepMounted
        anchorEl={open}
        open={Boolean(open)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {SORT_BY_OPTIONS.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === sort.value}
            onClick={() => handleClose(option)}
            sx={{ typography: 'body2' }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

export default MenuSort;