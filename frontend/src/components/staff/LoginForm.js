import React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

export default function LoginForm ({ submit, role }) {
  const [password, setPassword] = React.useState('');

  const onSubmit = () => {
    submit(role, password);
  }
  return (<>
    <TextField
        margin="normal"
        required
        halfwidth="true"
        name="password"
        label="Password"
        type="password"
        id="password"
        onChange={e => setPassword(e.target.value)}
    /><br />
    <Button
        sx={{ mt: 3, mb: 2 }}
        id='login'
        variant="contained"
        onClick={onSubmit}>Log in
    </Button>
  </>)
}

// TODO: add proptype
LoginForm.propTypes = {
  submit: PropTypes.elementType
}