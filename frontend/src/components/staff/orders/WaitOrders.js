import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import Order from './Order'
import { nextOrderStatus } from '../../../utilities/constants';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Card } from '@mui/material';
import useAlert from '../../../utilities/useAlert';


export default function WaitOrders() { 

  // React.useEffect(() => {
  //   console.log("inside", orders)
  // })

  const [preparedOrders, setPrepared] = React.useState([]);

  const { setAlert } = useAlert();

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
        setAlert(await data.error);
      }
    }

    const intervalID = setInterval(getWaitOrders, 1000)

    return (() => {
      clearInterval(intervalID)
    })

  }, []);

  return (
    <Card sx={{ px: 5, pr: 0, pt: 3, display: 'flex', flexDirection: 'column', flex: 5 }}>
      <Typography variant="h3">Waiting to be Served</Typography>
      <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell>Table</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Time</TableCell>
            <TableCell ></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {preparedOrders.map((order, i) => (
            <Order
              key={i}
              order={order}
              nextStatus={nextOrderStatus(order.status)}
              role="waiter"/>
          ))}
        </TableBody>
      </Table>
      </TableContainer>
    </Card>
  );
}