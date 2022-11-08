import * as React from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, 
  DialogTitle, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
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

function BudgetDialog(props) {
  const { onClose, open, budget } = props;
  const [value, setValue] = React.useState(budget); 

  const handleClick = (value) => {
    onClose(value);
  };

  // const handleBudget = (value) => {
  //   budget(value);
  // }
  
  return (
    <Dialog 
      open={open}
      onClose={() => handleClick(budget)}
    >
      <BootstrapDialogTitle id="customized-dialog-title" onClose={() => handleClick(budget)}>
        Update budget
      </BootstrapDialogTitle>
      <DialogContent dividers>
        <TextField
          margin="dense"
          id="budget"
          label="Budget"
          type="number"
          fullWidth
          variant="outlined"
          defaultValue={budget}
          helperText="Max $1000"
          InputProps={{ 
            startAdornment: <InputAdornment position="start">$</InputAdornment>
          }}
          onChange={(e) => setValue(parseFloat(e.target.value))}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClick(null)}>Delete</Button> 
        <Button onClick={() => handleClick(budget)}>Cancel</Button> 
        <Button onClick={() => handleClick(value)} disabled={!value || value <= budget || value > 1000}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
}

export default BudgetDialog;

BudgetDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  budget: PropTypes.number.isRequired
};