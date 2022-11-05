import * as React from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, 
  DialogTitle, IconButton, TextField, Typography } from '@mui/material';
import ReplayCircleFilledRoundedIcon from '@mui/icons-material/ReplayCircleFilledRounded';
import StopCircleRoundedIcon from '@mui/icons-material/StopCircleRounded';

function BudgetDialog(props) {
  const { onClose, open, budget } = props;

  const handleClick = (value) => {
    onClose(value);
  };

  return (
    <Dialog 
      open={open}
    >
      <DialogTitle textAlign='center'>
        <Typography component='div' variant='h2' >
          Update budget
        </Typography>
        {/* <Typography component='div' variant='h3' >
          Budget: {budget}
        </Typography> */}
      </DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          id="budget"
          label="Budget"
          type="number"
          fullWidth
          variant="outlined"
          value={budget}
          helperText="Max $1000.00"
        //   onChange={(budget) => (e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClick('cancel')}>Cancel</Button> 
         <Button onClick={() => handleClick('update')}>Submit</Button>
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