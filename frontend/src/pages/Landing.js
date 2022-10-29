import * as React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Stack } from '@mui/material';
import Header from '../components/customer/Header';

/* Landing Page */
function Landing () {
  localStorage.clear();
  
  return (
    <>
      <Header title={"Admin"}/>
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Stack spacing={2}>
          <Button component={Link} to={'/customer/table'} variant="contained">Customer</Button>
          <Button component={Link} to={'/staff/login'} variant="contained">Staff</Button>
        </Stack>
      </Box>
    </ >
  );
}

export default Landing;