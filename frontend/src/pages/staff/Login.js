import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Stack, Avatar, Typography } from '@mui/material';
import LoginForm from '../../components/staff/LoginForm';

export default function Login () {
  localStorage.clear();

  const navigate = useNavigate();
  const [role, setRole] = React.useState("");  
  
  if (role) {
    return (
      <Box
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}></Avatar>
        <Typography component="h1" variant="h5">
          Enter password for {role}
        </Typography>
        <LoginForm submit={async (role, password) => {
          const response = await fetch('http://localhost:5000/login', {
            method: 'POST',
            mode: 'cors',
            headers: {
              'Content-type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
              role: role,
              password: password,
            })
          });
          const data = await response.json();
          if (response.ok) {
            localStorage.setItem('token', data.token);
            navigate(`/staff/${role}`);
          } else {
            alert(await data.error);
          }
        }} role={role} />
      </Box>
    );
  } else {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Stack spacing={2}>
          <Button variant="contained" onClick={(e) => setRole('kitchen')}>Kitchen Staff</Button>
          <Button variant="contained" onClick={(e) => setRole('wait')}>Wait Staff</Button>
          <Button variant="contained" onClick={(e) => setRole('manager')}>Manager</Button>
        </Stack>
      </Box>
    );
  }

}