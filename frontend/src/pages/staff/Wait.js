import * as React from 'react';
import { Box } from '@mui/material';
import WaitOrders from '../../components/staff/orders/WaitOrders';
import Requests from '../../components/staff/orders/Requests';
import Header from '../../utilities/Header';

export default function Wait() {
  
  return (
    <>
      <Header
        image={localStorage.getItem('restaurantImage')}
        title={"Admin-Waiter"}
        heading="Waiter"
      />
      <Box 
        sx={{
          width: '100%',
          height: '93%',
          display: 'flex',
          p: 3,
          gap: 3
        }}
      >
        <WaitOrders/>
        <Requests/>
      </Box>
    </ >
  );
}