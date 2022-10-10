import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import logo from './logo.png'

const columns = [
  { id: 'image', label: 'Image', minWidth: 170 },
  { id: 'name', label: 'Name', minWidth: 100 },
  { id: 'status', label: 'Status', minWidth: 170, align: 'right'},
  {
    id: 'cost',
    label: 'Cost ($)',
    minWidth: 170,
    align: 'right',
    format: (value) => value.toFixed(2),
  },
];

function createData(image, name, status, cost) {
  return { image, name, status, cost };
}

const rows = [
  createData(logo, 'Onigiri', 'Preparing', 12.43),
  createData(logo, 'Tuna Sushi', 'Preparing', 13.31),
  createData(logo, 'Spicy Mayo Sushi', 'Preparing', 43.43),
  createData(logo, 'Avo Roll', 'Cooking', 34.23),
  createData(logo, 'Udon', 'Cooking', 65.65),
  createData(logo, 'Ramen', 'Cooking', 34),
  createData(logo, 'Takoyaki', 'Cooking', 43.2),
  createData(logo, 'Okinomiyaki', 'Cooking', 23.7),
  createData(logo, 'Nigiri', 'Cooking', 98.5),
  createData(logo, 'Salmon Sashimi', 'Cooking', 22.2),
  createData(logo, 'Toro Roll', 'Ready', 11),
  createData(logo, 'Cucumber Roll', 'Ready', 12.1),
  createData(logo, 'Mochi Icecream', 'Complete', 31.5),
  createData(logo, 'Mochi', 'Complete', 54.3),
  createData(logo, 'Tamago Roll', 'Complete', 23.1),
];

function OrderTable() {
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
        localStorage.setItem('order', data);
        setOrder(order => data);
      } else {
        alert(await data.error);
      }
    };
    getOrder();
  }, []);

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 550 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.name}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          { column.id === 'image' && <img width='170' src={value} alt=''/> }
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
      <Grid container justify = "center">
        <Box 
          display="flex"
          justifyContent="space-between"
          alignItems="center" 
          sx={{ width: '97%', position: 'fixed' }}
        >
          <Stack sx={{ mx:'30px' }}>
            <Typography variant="h3" >Total: $1000</Typography>
            <Typography variant="h7" sx={{ mx:'5px' }} >Including Tax</Typography>
          </Stack>
          <Button size="large" variant="contained">End Dining</Button>
        </Box>
      </Grid>
    </Paper>
  );
}

export default OrderTable;