import * as React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/staff/Header';
import WaitOrders from '../../components/staff/WaitOrders';
import Requests from '../../components/staff/Requests';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function Wait() {
    return (
      <>
        <Header title={"WAIT"} />
        <Box sx={{
          width: '100%',
          height: 800,
          m: 1,
          display: 'flex'
        }}>
          <Box sx={{ p: 2, m: 3, display: 'flex', flexDirection: 'column', flex: 3 }}>
            <Typography variant="h5">Waiting to be Served</Typography>
            <WaitOrders></WaitOrders>
          </Box>
          <Box sx={{ p: 2, m: 3, display: 'flex', flexDirection: 'column', flex: 1 }}>
            <Typography variant="h5">Requests for Assistance</Typography>
            <Requests></Requests>
          </Box>
        </Box>
      </ >
    );
  }
  
  export default Wait;



  