import * as React from 'react';
import useAlert from './useAlert';
import Popup from './Popup';

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
      <Popup
        type="error"
        open={true}
        handleClose={handleClose}
        message={"Error: " + text}
      />
    );
  } else {
    return <></>;
  }
};

export default AlertPopup;