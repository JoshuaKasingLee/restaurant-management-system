import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import KitchenOrder from './KitchenOrder'
import { nextOrderStatus } from '../../utilities/constants';


export default function KitchenOrders({orders}) { 

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <ListItem>
        <Typography sx={{minWidth: '56px'}}>Table</Typography>
        <Typography>Item Name</Typography>
      </ListItem>
      {[].map((o) => {
        return (
          <KitchenOrder
            id={o.id}
            table={o.table}
            name={o.name}
            nextStatus={nextOrderStatus(o.status)}>
          </KitchenOrder>
        );
      })}
    </List>
  );
}

// KitchenOrders.propTypes = {
//   orders: React.PropTypes.array.isRequired
// }