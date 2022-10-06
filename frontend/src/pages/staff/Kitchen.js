import * as React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/staff/Header';
import KitchenOrders from '../../components/staff/KitchenOrders';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function Kitchen() {
    return (
      <>
        <Header title={"KITCHEN"} />
        <Box sx={{
          width: '100%',
          height: 800,
          m: 1,
          display: 'flex'
        }}>
          <Box sx={{ p: 2, m: 3, display: 'flex', flexDirection: 'column', flex: 1 }}>
            <Typography variant="h5">Not Started</Typography>
            <KitchenOrders></KitchenOrders>
          </Box>
          <Box sx={{ p: 2, m: 3, display: 'flex', flexDirection: 'column', flex: 1 }}>
            <Typography variant="h5">Preparing</Typography>
            <KitchenOrders></KitchenOrders>
          </Box>
        </Box>
      </ >
    );
  }
  
  export default Kitchen;



  