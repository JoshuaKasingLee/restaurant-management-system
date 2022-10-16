import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

const columns = [
  { id: 'name', label: 'Dish', minWidth: 100 },
//   { id: 'quantity', label: 'Quantity', minWidth: 160, align: 'right'},
  {
    id: 'cost',
    label: 'Cost',
    minWidth: 100,
    align: 'right',
    format: (value) => '$' + value.toFixed(2),
  },
];

function BillTable() {
  const [order, setOrder] = React.useState([]);

  React.useEffect(() => {
    const getOrder = async () => {
      const response = await fetch(`http://localhost:5000/customer/order?table=${localStorage.getItem('table')}`, {  
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('order', JSON.stringify(data));
        let content = [];
        for (let i=0; i < data.orderItems.length; i++) {
          content.push(
            { 
              name: data.orderItems[i].name,
            //   quantity: 
              cost: data.orderItems[i].cost,
            }
          );
          setOrder( content );
        }
      } else {
        alert(await data.error);
      }
    };
    getOrder();
  }, []);

  return (
    <Paper sx={{ width: '30%', overflow: 'hidden' }}>
      <TableContainer sx={{ fullHeight: true, maxHeight: 400 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  <Typography variant="h6">
                    {column.label}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {order
              .map((row, index) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          { column.id === 'image' && <img width='160' src={row.img} alt=''/> }
                          { column.format && column.format(value) }
                          { column.id !== 'image' && !column.format && value }
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default BillTable;