import * as React from 'react';
import PropTypes from 'prop-types';
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, 
  DialogTitle, IconButton, TextField, Typography } from '@mui/material';
import ReplayCircleFilledRoundedIcon from '@mui/icons-material/ReplayCircleFilledRounded';
import CloseIcon from '@mui/icons-material/Close';
import useAlert from '../../../utilities/useAlert';

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

function EndDialog(props) {
  const { onClose, open, score } = props;
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);
  const { setAlert } = useAlert();

  const handleClick = (value) => {
    onClose(value);
    setSubmitted(false);
  };

  const handleSubmit = () => {
    const submit = async () => {
      const response = await fetch('http://localhost:5000/customer/leaderboard', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(
          { 
            name: name,
            email: email,
            score: score
          }
        )
      });
      const data = await response.json();
      if (response.ok) {
        setSubmitted(true);
      } else {
        setAlert(await data.error);
      }
    }
    submit();
  }

  return (
    <Dialog 
      open={open}
    >
      <BootstrapDialogTitle 
        id="exit-dialog-title" 
        textAlign='center' 
        onClose={() => handleClick('stop')}
      />
      <Box 
        display='flex' 
        flexDirection='column' 
        alignItems='center' 
        justifyContent='center'
      >
        <Typography component='div' variant='h2' >
          Game Over
        </Typography>
        <Typography component='div' variant='h3' >
          Score: {score}
        </Typography>
        <IconButton onClick={() => handleClick('replay')}>
        <ReplayCircleFilledRoundedIcon sx={{width: 200, height: 200 }} />
        </IconButton> 
      </Box>
      <DialogContent dividers>
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
          onChange={(e)=>setName(e.target.value)}
        />
        <TextField
          margin="dense"
          id="email"
          label="Email Address"
          type="email"
          fullWidth
          variant="outlined"
          helperText="Email must contain '@' character and a maximum of 100 characters"
          onChange={(e)=>setEmail(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} disabled={!email.includes('@') || submitted}>
          Submit
        </Button> 
      </DialogActions>
      {submitted && 
        <Alert severity="success">
          Entry submitted, good luck!
        </Alert>
      }
    </Dialog>
  );
}

export default EndDialog;

EndDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  score: PropTypes.number.isRequired
};