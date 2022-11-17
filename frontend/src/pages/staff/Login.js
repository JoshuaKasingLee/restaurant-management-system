import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Button, Stack, ToggleButton, Typography } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginForm from '../../components/staff/settings/LoginForm';
import useAlert from '../../utilities/useAlert';

export default function Login () {
  
  const { setAlert } = useAlert();
  
  const navigate = useNavigate();
  const [role, setRole] = React.useState("Admin");
 
  return (<>
    <ToggleButton
      sx={{ width: 40, height: 40, position: 'absolute', right: 3, mr: 5, mt: 2 }}
      color="primary"
      value="exit"
      component={Link} to={'/'}
    >
      <LogoutIcon/>
    </ToggleButton>
    <Box display="flex" sx={{ height: "100vh" }}>
      <Box 
        display="flex" 
        flexDirection="column" 
        justifyContent="center" 
        alignItems="center"
        sx={{ 
        width: "50%",
        bgcolor: 'primary.main',
        color: 'white'}}
      >
        <Typography variant='h1' sx={{ width: '80%' }} noWrap align='center'>
          {role}
        </Typography>
      </Box>
      
      <Box 
        display="flex" 
        flexDirection="column" 
        justifyContent="center" 
        alignItems="center"
        sx={{ width: "50%" }}
      >
        <Stack spacing={2} width={'40%'}>
          { role === "Admin"
            ? <>
              <Button
                variant="contained"
                sx={{ height: 100, fontSize: 15}}
                onClick={(e) => setRole('kitchen')}
              >
                Kitchen Staff
              </Button>
              <Button
                variant="contained"
                sx={{ height: 100, fontSize: 15}}
                onClick={(e) => setRole('wait')}
              >
                Wait Staff
              </Button>
              <Button
                variant="contained"
                sx={{ height: 100, fontSize: 15}}
                onClick={(e) => setRole('manager')}
              >
                Manager
              </Button>
              </>
            : <>
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
                  if (role !== "manager") {
                    navigate(`/staff/${role}`);
                  } else {
                    navigate(`/staff/manager/menuEditor`);
                  }
                  
                } else {
                  setAlert(await data.error);
                }
              }} role={role}
            />
            </>
          }
        </Stack>
      </Box>
    </Box>
  </>);
}