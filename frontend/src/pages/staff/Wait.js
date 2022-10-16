import * as React from 'react';
import Header from '../../components/staff/Header';
import WaitOrders from '../../components/staff/WaitOrders';
import Requests from '../../components/staff/Requests';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function Wait() {
  const [preparedOrders, setPrepared] = React.useState([]);

  React.useEffect(() => {  
    const getWaitOrders = async () => {
      const response = await fetch(`http://localhost:5000/waiter/orders`, {  
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });
      const data = await response.json();
      if (response.ok) {
        setPrepared(data.orders);
      } else {
        alert(await data.error);
      }
    }

    const intervalID = setInterval(getWaitOrders, 1000)

    return (() => {
      clearInterval(intervalID)
    })

  }, []);   
  
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
            <WaitOrders orders={preparedOrders}></WaitOrders>
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



  