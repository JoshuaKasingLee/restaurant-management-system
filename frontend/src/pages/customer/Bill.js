import * as React from 'react';
import { Box, Typography } from '@mui/material';
import BillTable from '../../components/customer/order/BillTable';
import Header from '../../utilities/Header';
import useAlert from '../../utilities/useAlert';

function Bill() {
  const [total, setTotal] = React.useState(0);
  const [charge, setCharge] = React.useState(new Array(4).fill(0));
  const [orderItems, setOrderItems] = React.useState([]);

  const { setAlert } = useAlert();
  
  React.useEffect(() => {
    const getBill = async () => {
      const response = await fetch('http://localhost:5000/customer/bill', {
        method: 'POST',
        mode: 'cors',
        headers: {
        'Content-type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(
          { 
            table: localStorage.getItem('table'),
            type: localStorage.getItem('paymentType'),
            numSplit: localStorage.getItem('numSplit'),
            dishes: JSON.parse(localStorage.getItem('dishes')),
          }
        )
      });
      const data = await response.json();
      if (response.ok) {
        setTotal( data.total );
        setCharge( data.charge );
        setOrderItems( data.order_items );
      } else {
        setAlert(await data.error);
      }
    }
    getBill();
  }, []);

  return (
    <>
      <Header
        image={localStorage.getItem('restaurantImage')}
        title={"Bill"}
        heading={"Table " + localStorage.getItem('table')}
      />
      <Box display="flex" sx={{ height: "93vh" }}>
        <Box 
          display="flex" 
          flexDirection="column" 
          justifyContent="center" 
          alignItems="center"
          sx={{ width: "50%", bgcolor: 'primary.main', color: 'white' }}
        >
          <Typography variant='h4'>
            Thank you for dining with us!
          </Typography>
          <Typography align="center" variant="h7" component="div" >
            Please pay at the counter
          </Typography>
          {localStorage.getItem('paymentType') !== 'together' &&
          <>
            <br/>
            <Box 
              alignItems='end' 
              sx={{
                width: '335px',
                px: '16px', 
                py: '8px',
                bgcolor: 'primary.light',
                borderRadius: 2
              }}
            >
              {localStorage.getItem('paymentType') === 'equal' &&
                <Typography align="center" variant="h4" component="div" sx={{ flexGrow: 1 }}>
                  Charge/pp: ${charge[0].toFixed(2)}
                </Typography>
              }
              {localStorage.getItem('paymentType') === 'dish' &&
                <>
                  <Typography align="center" variant="h4" component="div" sx={{ flexGrow: 1 }}>
                    Charge/pp
                  </Typography> 
                  { Array(parseInt(localStorage.getItem('numSplit'))).fill(0).map((person, index) => (
                    <Typography 
                      key={index} 
                      align="center" 
                      variant="h7" 
                      component="div" 
                      sx={{ flexGrow: 1 }}
                    >
                      Person {index + 1}: ${charge[index].toFixed(2)}
                    </Typography>
                  ))}
                </>
              }
            </Box>
          </>
          }
          <br/>
          <Box 
            alignItems='end' 
            sx={{
              width: '335px',
              px: '16px', 
              py: '8px',
              bgcolor: 'primary.light',
              borderRadius: 2
            }}
          >
            <Typography align="center" variant="h4" component="div" sx={{ flexGrow: 1 }}>
              Total Charge: ${total.toFixed(2)}
            </Typography>
          </Box>
        </Box>
        <Box 
          display="flex" 
          flexDirection="column" 
          justifyContent="center" 
          alignItems="center" 
          sx={{ width: "50%" }} 
        >
          <BillTable orderItems={orderItems}/>
        </Box>
      </Box>
    </ >
  );
}

export default Bill;