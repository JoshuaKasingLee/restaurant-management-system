import * as React from 'react';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import useAlert from './useAlert';
import Alert from '@mui/material/Alert';

const AlertPopup = () => {
  const { text, setAlert } = useAlert();

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlert('');
  };

  if (text) {
    return (
      <Stack spacing={2} sx={{ width: '100%' }}>
        <Snackbar open={true} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
            Error: {text}
          </Alert>
        </Snackbar>
      </Stack>
    );
  } else {
    return <></>;
  }
};

export default AlertPopup;