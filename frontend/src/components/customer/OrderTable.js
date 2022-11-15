import * as React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, 
  IconButton, Paper, Slide, Stack, Table, TableBody, TableHead, 
  TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import { PropTypes } from 'prop-types';
import CloseIcon from '@mui/icons-material/Close';
import PaymentToggleButton from './PaymentToggleButton';
import useAlert from '../../utilities/useAlert';

const columns = [
  { id: 'image', label: '', minWidth: 160 },
  { id: 'name', label: 'Dish', minWidth: 160 },
  { id: 'status', label: 'Status', minWidth: 160, align: 'center'},
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
  const [order, setOrder] = React.useState(localStorage.getItem('order') !== null 
    ? JSON.parse(localStorage.getItem('order')) : []);
  const [totalCost, setTotalCost] = React.useState(localStorage.getItem('cost') !== null 
    ? parseFloat(localStorage.getItem('cost')) : 0);
  const [open, setOpen] = React.useState(false);
  const [valid, setValid] = React.useState(false);
  const { setAlert } = useAlert();

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
              id: data.orderItems[i].id,
              img: data.orderItems[i].img,
              name: data.orderItems[i].name,
              status: data.orderItems[i].status,
              cost: data.orderItems[i].cost,
            }
          );
        }
        setOrder( content );
        localStorage.setItem('order', JSON.stringify(content));
        setTotalCost( data.total);
        localStorage.setItem('cost', data.total);
      } else {
        setAlert(await data.error);
      }
    };
    
    const intervalID = setInterval(getOrder, 1000)

    return (() => {
      clearInterval(intervalID)
    })

  }, []);

  return (
    <Paper sx={{ m: 3, overflow: 'hidden', borderRadius: 2, boxShadow: 3 }}>
      <TableContainer sx={{ maxHeight: 640 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  <Typography variant="h4">
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
                          { column.format && 
                            <Typography variant='h6' sx={{ fontWeight: 'regular' }} >
                              {column.format(value)}
                            </Typography> 
                          }
                          { column.id !== 'image' && !column.format && 
                            <Typography variant='h6' sx={{ fontWeight: 'regular' }}>
                              {value}
                            </Typography> 
                          }
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
          <Stack 
            sx={{
              position: 'fixed',
              bottom: 20,
              left: 30,
              height: '60px',
              // borderRadius: 1,
              // boxShadow: 2,
              px: 1,
              py: 0.5
            }}>
            <Typography variant="h4" >Total: ${totalCost.toFixed(2)}</Typography>
            <Typography sx={{ mx: '5px', lineHeight: '10px' }}>Including Tax</Typography>
          </Stack>
          <Button 
            sx={{
              position: 'fixed',
              bottom: 20,
              right: 30,
              width:'160px',
              height: '60px',
              bgcolor: (theme) => theme.palette.primary.light
            }}
            variant='contained'
            onClick={handleClickOpen}
          >
            Request Bill
          </Button>
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
                We hope you enjoyed you're meal. How would you like to pay?
              </Typography>
              <PaymentToggleButton order={order} disable = { valid => setValid(valid)} submit = { type => localStorage.setItem('paymentType', type) }/>
            </DialogContent>
            <DialogActions>
              <Button autoFocus component={Link} to={'/customer/bill'} disabled={!valid}>
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