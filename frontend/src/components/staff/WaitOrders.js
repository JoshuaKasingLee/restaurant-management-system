import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import WaitOrder from './WaitOrder'


export default function WaitOrders() {

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        <ListItem>
            <Typography sx={{minWidth: '56px'}}>Table</Typography>
            <Typography>Item Name</Typography>
        </ListItem>
      {[0, 1, 2, 3].map((value) => {
        return (
            <WaitOrder table={value} name={`Line item ${value + 1}`}>
            </WaitOrder>
        );
      })}
    </List>
  );
}