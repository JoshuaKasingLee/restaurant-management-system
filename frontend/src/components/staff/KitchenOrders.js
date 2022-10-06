import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import KitchenOrder from './KitchenOrder'


export default function KitchenOrders() {

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        <ListItem>
            <Typography sx={{minWidth: '56px'}}>Table</Typography>
            <Typography>Item Name</Typography>
        </ListItem>
      {[0, 1, 2, 3].map((value) => {
        return (
            <KitchenOrder table={value} name={`Line item ${value + 1}`}>
            </KitchenOrder>
        );
      })}
    </List>
  );
}