import * as React from 'react';
import Header from '../../utilities/Header';
import WaitOrders from '../../components/staff/orders/WaitOrders';
import Requests from '../../components/staff/orders/Requests';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function Wait() {
  
  return (
    <>
      <Header
        image={localStorage.getItem('restaurantImage')}
        title={"Admin-Waiter"}
        heading="Waiter"
      />
        <Box sx={{
          width: '100%',
          height: '93%',
          display: 'flex',
          p: 3,
          gap: 3
        }}>
          <WaitOrders></WaitOrders>
          <Requests></Requests>
        </Box>
    </ >
  );
}
  
  export default Wait;



  