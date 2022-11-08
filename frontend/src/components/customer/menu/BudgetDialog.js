import * as React from 'react';
import PropTypes from 'prop-types';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, 
  InputAdornment, TextField, Typography } from '@mui/material';
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
  const { onClose, open, budget, remaining, order } = props;
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
        <Typography color='text.secondary' variant="h6" component="div" textAlign='center'>
          Your total budget is ${budget}.
        </Typography>
        <Typography color='text.secondary' variant="h6" component="div" textAlign='center'>
          You have ${remaining} remaining.
        </Typography>
        <Typography color='text.secondary' component="div">
          Would you like to update your total budget?
          {console.log(order)}
        </Typography>
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
        <Button onClick={() => handleClick(value)} disabled={!value || value < order || value > 1000}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
}

export default BudgetDialog;

BudgetDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  budget: PropTypes.number,
  remaining: PropTypes.number,
  order: PropTypes.number,
};