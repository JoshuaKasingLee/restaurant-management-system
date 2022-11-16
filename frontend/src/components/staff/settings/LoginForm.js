import React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import PasswordInput from './PasswordInput';

export default function LoginForm ({ submit, role }) {
  const [password, setPassword] = React.useState('');

  const onSubmit = () => {
    submit(role, password);
  }

  return (<>
    <PasswordInput 
      labelName = 'Password*' 
      submit = { password => setPassword(password) } 
    />
    <Button
        id='login'
        variant="contained"
        onClick={onSubmit}>Log in
    </Button>
  </>)
}

LoginForm.propTypes = {
  submit: PropTypes.elementType
}