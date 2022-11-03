import * as React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Stack, Typography } from '@mui/material';
import Header from '../components/customer/Header';

/* Landing Page */
function Landing () {
  const [name, setName] = React.useState('');
  const [image, setImage] = React.useState('');  
  
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
        alert(await data.error);
      }
    };
    getRestaurantInfo();
  }, []);
  
  return (
    <>
      <Header image={image} title={"Admin"}/>
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography variant='h2'>
          Hi, welcome to {name}!
        </Typography>
        <br />
        <Stack spacing={2} width={'500px'}>
          <Button component={Link} to={'/customer/table'} variant="contained">Customer</Button>
          <Button component={Link} to={'/staff/login'} variant="contained">Staff</Button>
        </Stack>
      </Box>
    </ >
  );
}

export default Landing;