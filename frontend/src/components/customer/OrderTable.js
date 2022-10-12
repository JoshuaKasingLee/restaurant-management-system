import * as React from 'react';
import { Link } from 'react-router-dom';
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
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';
import CloseIcon from '@mui/icons-material/Close';

const columns = [
  { id: 'image', label: '', minWidth: 160 },
  { id: 'name', label: 'Dish', minWidth: 160 },
  { id: 'status', label: 'Status', minWidth: 160, align: 'right'},
  {
    id: 'cost',
    label: 'Cost',
    minWidth: 160,
    align: 'right',
    format: (value) => '$' + value.toFixed(2),
  },
];

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

function OrderTable() {
  const [order, setOrder] = React.useState([]);
  const [totalCost, setTotalCost] = React.useState(0);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
              img: data.orderItems[i].img,
              name: data.orderItems[i].name,
              status: data.orderItems[i].status,
              cost: data.orderItems[i].cost,
            }
          );
          setOrder( order => content );
        }
        setTotalCost( totalCost => data.total);
      } else {
        alert(await data.error);
      }
    };
    getOrder();
  }, []);

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 500 }}>
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
      <Grid container position="fixed" bottom="135px" justify = "center">
        <Box 
          display="flex"
          justifyContent="space-between"
          alignItems="center" 
          sx={{ width: '97%', position: 'fixed' }}
        >
          <Stack sx={{ mx:'30px' }}>
            <Typography variant="h3" >Total: ${totalCost.toFixed(2)}</Typography>
            <Typography variant="h7" sx={{ mx:'5px' }} >Including Tax</Typography>
          </Stack>
          <Button size="large" variant="contained" onClick={handleClickOpen}>Request Bill</Button>
          <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
            fullWidth={true}
            maxWidth='sm'
          >
            <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
              Request Bill
            </BootstrapDialogTitle>
            <DialogContent dividers>
              <Typography gutterBottom>
                We hope you enjoyed you're meal. Would you like to pay now?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button autoFocus component={Link} to={'/customer/bill'}>
                Request Bill
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Grid>
    </Paper>
  );
}

export default OrderTable;