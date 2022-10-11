import * as React from 'react';
import Header from '../../components/staff/Header';
import KitchenOrders from '../../components/staff/KitchenOrders';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function Kitchen() {
  const [notStartedOrders, setNotStarted] = React.useState([]);
  const [cookingOrders, setCooking] = React.useState([]);

  React.useEffect(() => {  
    const getKitchenOrders = async () => {
      const response = await fetch(`http://localhost:5000/kitchen/orders`, {  
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });
      const data = await response.json();

      if (response.ok) {
        setNotStarted(data.orders.filter(o => o.status === "ordered"));
        setCooking(data.orders.filter(o => o.status === "cooking"));
      } else {
        alert(await data.error);
      }
    }

    const intervalID = setInterval(getKitchenOrders, 1000)

    return (() => {
      clearInterval(intervalID)
    })

  }, []);  
  
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
          <KitchenOrders orders={notStartedOrders} />
        </Box>
        <Box sx={{ p: 2, m: 3, display: 'flex', flexDirection: 'column', flex: 1 }}>
          <Typography variant="h5">Cooking</Typography>
          <KitchenOrders orders={cookingOrders} />
        </Box>
      </Box>
    </>
  );
} 