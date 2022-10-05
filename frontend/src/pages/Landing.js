import * as React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Stack } from '@mui/material';

/* Landing Page */
function Landing () {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Stack spacing={2}>
        <Button component={Link} to={'/customer/table'} variant="contained">Customer</Button>
        <Button component={Link} to={'/staff/login'} variant="contained">Staff</Button>
      </Stack>
    </Box>
  );
}

export default Landing;