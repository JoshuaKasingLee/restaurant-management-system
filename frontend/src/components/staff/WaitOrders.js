import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import Order from './Order'
import { nextOrderStatus } from '../../utilities/constants';


export default function WaitOrders() { 

  // React.useEffect(() => {
  //   console.log("inside", orders)
  // })

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
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <ListItem>
          <Typography sx={{minWidth: '56px'}}>Table</Typography>
          <Typography>Item Name</Typography>
      </ListItem>
      {preparedOrders.map((o) => {
        return (
          <Order
            key={o.id}  
            id={o.id}
            table={o.table}
            name={o.name}
            nextStatus={nextOrderStatus(o.status)}
            role="waiter">
          </Order>
        );
      })}
    </List>
  );
}