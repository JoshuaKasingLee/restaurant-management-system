import * as React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, 
  Slide, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

function ExitDialog(props) {
  const { onClose, open } = props;

  const handleClick = () => {
    onClose();
  };

  return (
    <Dialog 
      open={open}
      onClose={handleClick}
      TransitionComponent={Transition}
      keepMounted
    >
      {localStorage.getItem('orders') !== null && localStorage.getItem('orders') !== '0'
      ? <>
        <BootstrapDialogTitle id="exit-dialog-title" onClose={handleClick}>
          Pending items in order list
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Typography color='text.secondary' variant="h6" component="div" textAlign='center'>
            You have {localStorage.getItem('orders') } items in your order list
          </Typography>
          <Typography color='text.secondary' component="div" textAlign='center'>
            Please request your bill in the orders tab and pay at the counter before leaving.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClick}>OK</Button> 
        </DialogActions>
      </> : <>
        <BootstrapDialogTitle id="exit-dialog-title" onClose={handleClick}>
          Cancel seating
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Typography color='text.secondary' variant="h6" component="div" textAlign='center'>
            We're sad to see you go
          </Typography>
          <Typography color='text.secondary' component="div" textAlign='center'>
            Are you sure you want to cancel your seating?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClick}>No</Button> 
          <Button component={Link} to={'/'}>Yes</Button>
        </DialogActions>
      </>
      }
    </Dialog>
  );
}

export default ExitDialog;

ExitDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
};