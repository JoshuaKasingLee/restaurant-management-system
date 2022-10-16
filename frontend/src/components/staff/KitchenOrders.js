import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import Order from './Order'
import { nextOrderStatus } from '../../utilities/constants';


export default function KitchenOrders({orders}) { 

  // React.useEffect(() => {
  //   console.log("inside", orders)
  // })

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <ListItem>
        <Typography sx={{minWidth: '56px'}}>Table</Typography>
        <Typography>Item Name</Typography>
      </ListItem>
      {orders.map((o) => {
        return (
          <Order
            key={o.id}
            id={o.id}
            table={o.table}
            name={o.name}
            nextStatus={nextOrderStatus(o.status)}
            role="kitchen">
          </Order>
        );
      })}
    </List>
  );
}

// KitchenOrders.propTypes = {
//   orders: React.PropTypes.array.isRequired
// }