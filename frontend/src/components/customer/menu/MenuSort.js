import { useState } from 'react';
// material
import { Menu, Button, MenuItem, Typography } from '@mui/material';
// component
import Iconify from '../../Iconify';

// ----------------------------------------------------------------------

const SORT_BY_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'priceDesc', label: 'Price: High-Low' },
  { value: 'priceAsc', label: 'Price: Low-High' }
];

function MenuSort({ submit }) {
  const [open, setOpen] = useState(null);
  const [sort, setSort] = useState({ value: 'none', label: 'None' });

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = (option) => {
    setOpen(null);
    if (option !== null) setSort(option);
    submit(option);
  };

  return (
    <>
      <Button
        color="inherit"
        disableRipple
        onClick={handleOpen}
        endIcon={<Iconify icon={open ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'} />}
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