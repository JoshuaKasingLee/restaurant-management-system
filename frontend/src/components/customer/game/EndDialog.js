import * as React from 'react';
import PropTypes from 'prop-types';
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, 
  DialogTitle, IconButton, TextField, Typography } from '@mui/material';
import ReplayCircleFilledRoundedIcon from '@mui/icons-material/ReplayCircleFilledRounded';
import StopCircleRoundedIcon from '@mui/icons-material/StopCircleRounded';

function EndDialog(props) {
  const { onClose, open, score } = props;
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);

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
        alert(await data.error);
      }
    }
    submit();
  }

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
        <Button onClick={handleSubmit} disabled={!email.includes('@') || submitted}>Submit</Button> 
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