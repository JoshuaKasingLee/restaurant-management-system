import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import Order from './Order'
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Card } from '@mui/material';
import Button from '@mui/material/Button';
import { nextOrderStatus } from '../../../utilities/constants';


export default function KitchenOrders({orders, title}) { 

  // React.useEffect(() => {
  //   console.log("inside", orders)
  // })

  return (<>
    <Card sx={{ px: 5, pr: 0, pt: 3, display: 'flex', flexDirection: 'column', flex: 1 }}>
      <Typography variant="h3">{title}</Typography>
      <TableContainer component={Paper}>
      <Table sx={{ maxWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell>Table</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Time</TableCell>
            <TableCell sx={{ width: 5 }}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order, i) => (
            <Order
              key={i}
              order={order}
              nextStatus={nextOrderStatus(order.status)}
              role="kitchen"/>
          ))}
        </TableBody>
      </Table>
      </TableContainer>
    </Card>
  </>);
}