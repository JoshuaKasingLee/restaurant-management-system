import * as React from 'react';
import Header from '../../utilities/Header';
import KitchenOrders from '../../components/staff/orders/KitchenOrders';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import useAlert from '../../utilities/useAlert';
import { Card } from '@mui/material';

export default function Kitchen() {
  const [notStartedOrders, setNotStarted] = React.useState([]);
  const [cookingOrders, setCooking] = React.useState([]);

  const { setAlert } = useAlert();

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
        setAlert(await data.error);
      }
    }

    const intervalID = setInterval(getKitchenOrders, 1000)

    return (() => {
      clearInterval(intervalID)
    })

  }, []);  
  
  return (
    <>
      <Header
        image={localStorage.getItem('restaurantImage')}
        title={"Admin-Kitchen"}
        heading="Kitchen"
        />
      <Box sx={{
        width: '100%',
        height: '93%',
        display: 'flex',
        p: 3,
        gap: 3
      }}>
        <KitchenOrders orders={notStartedOrders} title="Not Started"/>
        <KitchenOrders orders={cookingOrders} title="Cooking"/>
      </Box>
    </>
  );
} 