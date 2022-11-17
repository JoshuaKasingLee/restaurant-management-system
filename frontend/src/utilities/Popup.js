import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

export default function Popup({type, open, handleClose, message}) {
  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <MuiAlert onClose={handleClose} severity={type} sx={{ width: '100%' }}>
        {message}
      </MuiAlert>
    </Snackbar>
  );
}