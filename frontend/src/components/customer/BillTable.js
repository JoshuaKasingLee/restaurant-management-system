import * as React from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Typography } from '@mui/material';

const columns = [
  { id: 'name', label: 'Dish', minWidth: 100 },
  { id: 'quantity', label: 'Quantity', minWidth: 160, align: 'center'},
  {
    id: 'cost',
    label: 'Cost',
    minWidth: 100,
    align: 'right',
    format: (value) => '$' + value.toFixed(2),
  },
];

function BillTable({ orderItems }) {
  const [order, setOrder] = React.useState([]);

  React.useEffect(() => {
    localStorage.setItem('order', JSON.stringify(orderItems));
    let content = [];
    for (let i=0; i < orderItems.length; i++) {
      content.push(
        { 
          name: orderItems[i].name,
          quantity: orderItems[i].quantity,
          cost: orderItems[i].cost,
        }
      );
      setOrder( content );
    }
  }, [orderItems]);

  return (
    <Paper sx={{ width: '30%', overflow: 'hidden' }}>
      <TableContainer sx={{ fullHeight: true, maxHeight: 400 }}>
        <Table stickyHeader>
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