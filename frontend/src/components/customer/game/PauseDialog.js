import * as React from 'react';
import PropTypes from 'prop-types';
import { Box, Dialog, DialogTitle, IconButton, Typography } from '@mui/material';
import NotStartedRoundedIcon from '@mui/icons-material/NotStartedRounded';
import StopCircleRoundedIcon from '@mui/icons-material/StopCircleRounded';

function PauseDialog(props) {
  const { onClose, open } = props;

  const handleClick = (value) => {
    onClose(value);
  };

  return (
    <Dialog 
      open={open}
      PaperProps={{
        style: {
          backgroundColor: 'transparent',
          boxShadow: 'none',
        },
      }}
    >
      <DialogTitle textAlign='center'>
        <Typography variant='h2' color='background.paper' >
          Game Paused
        </Typography>
      </DialogTitle>
        <Box>
          <IconButton sx={{ color: 'white'}} onClick={() => handleClick('resume')}>
            <NotStartedRoundedIcon sx={{width: 200, height: 200 }} />
          </IconButton> 
          <IconButton sx={{ color: 'white'}} onClick={() => handleClick('reset')}>
            <StopCircleRoundedIcon  sx={{width: 200, height: 200 }}  />
          </IconButton> 
        </Box>
    </Dialog>
  );
}

export default PauseDialog;

PauseDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};