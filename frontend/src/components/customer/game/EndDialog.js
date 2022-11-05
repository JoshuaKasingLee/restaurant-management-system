import * as React from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, 
  DialogTitle, IconButton, TextField, Typography } from '@mui/material';
import ReplayCircleFilledRoundedIcon from '@mui/icons-material/ReplayCircleFilledRounded';
import StopCircleRoundedIcon from '@mui/icons-material/StopCircleRounded';

function EndDialog(props) {
  const { onClose, open, score } = props;

  const handleClick = (value) => {
    onClose(value);
  };

  return (
    <Dialog 
      open={open}
    >
      <DialogTitle textAlign='center'>
        <Typography component='div' variant='h2' >
          Game Over
        </Typography>
        <Typography component='div' variant='h3' >
          Score: {score}
        </Typography>
      </DialogTitle>
      <Box display='flex' justifyContent='center'>
        <IconButton onClick={() => handleClick('replay')}>
        <ReplayCircleFilledRoundedIcon sx={{width: 200, height: 200 }} />
        </IconButton> 
        <IconButton onClick={() => handleClick('stop')}>
        <StopCircleRoundedIcon  sx={{width: 200, height: 200 }}  />
        </IconButton> 
      </Box>
      <DialogContent>
        <DialogContentText textAlign='center'>
          Want to be on the leaderboard and have the chance to win prizes?
          Provide your name and email for your shot of winning!
        </DialogContentText>
        <TextField
          margin="dense"
          id="name"
          label="Name"
          type="string"
          fullWidth
          variant="outlined"
        />
        <TextField
          margin="dense"
          id="email"
          label="Email Address"
          type="email"
          fullWidth
          variant="outlined"
          helperText="Email must contain '@' character and a maximum 0f 100 characters"
        />
      </DialogContent>
      <DialogActions>
        <Button>Submit</Button> 
        {/* add onlick */}
      </DialogActions>
    </Dialog>
  );
}

export default EndDialog;

EndDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  score: PropTypes.number.isRequired
};