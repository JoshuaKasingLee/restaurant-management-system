import * as React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useAlert from '../utilities/useAlert';

/* Landing Page */
function Landing () {
  const [name, setName] = React.useState('');
  const [image, setImage] = React.useState('');  
  
  const { setAlert } = useAlert();

  const theme = useTheme();

  React.useEffect(() => {
    // console.log(localStorage.getItem('restaurantImage'));
    // console.log(localStorage.getItem('assistance'));
    localStorage.clear();
    const getRestaurantInfo = async () => {
      const response = await fetch(`http://localhost:5000/restaurant`, {  
        method: 'GET',
        headers: {
          'Content-type': 'application/json'
        },
      });
      const data = await response.json();
      if (response.ok) {
        setName(data.name);
        setImage(data.image);
        localStorage.setItem('restaurantName', data.name);
        localStorage.setItem('restaurantImage', data.image);
      } else {
        setAlert(await data.error);
      }
    };
    getRestaurantInfo();
  }, []);
  
  return (
    <>
      <Box display="flex" sx={{ height: "100vh" }}>
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center"
          sx={{ 
          width: "50%",
          bgcolor: 'primary.main',
          color: 'white'}}
        >
          <Typography variant='h4'>
            WELCOME TO
          </Typography>
          <Typography variant='h1' sx={{ width: '80%' }} noWrap align='center'>
            {name.toUpperCase()}
          </Typography>
        </Box>
        
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center"
          sx={{ 
            width: "50%"}}
        >
          <Stack spacing={2} width={'40%'}>
            <Typography variant='body2'>
              Choose your interface...
            </Typography>
            <Button
              component={Link} to={'/customer/table'}
              variant="contained"
              sx={{ height: 100, fontSize: 15}}>
              CUSTOMER
            </Button>
            <Button
              component={Link} to={'/staff/login'}
              variant="contained"
              sx={{ height: 100, fontSize: 15}}>
              STAFF
            </Button>
          </Stack>
        </Box>
      </Box>
    </ >
  );
}

export default Landing;