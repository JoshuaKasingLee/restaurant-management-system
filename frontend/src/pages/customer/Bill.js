import * as React from 'react';
import Header from '../../components/customer/Header';
import Footer from '../../components/customer/Footer';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import BillTable from '../../components/customer/BillTable';
import useAlert from '../../utilities/useAlert';

function Bill() {
  const [total, setTotal] = React.useState(0);
  const [charge, setCharge] = React.useState(new Array(4).fill(0));
  const [orderItems, setOrderItems] = React.useState([]);

  const { setAlert } = useAlert();
  // const [people, setPeople] = React.useState(Array(parseInt(localStorage.getItem('numSplit'))).fill(0));

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
    // localStorage.clear();
  }, []);

  return (
    <>
      <Header image={localStorage.getItem('restaurantImage')} title={"Bill"} />
      <Box height='72vh' sx={{ mt: '20px', display: "flex", flexDirection: 'column', justifyContent: "space-between", alignItems: "center"}}>
        <Typography align='center' variant="h3">
          Thank you for dining with us!
        </Typography>
        <BillTable orderItems={orderItems} />
        <Box alignItems='end' sx={{ px: '16px', py: '8px', bgcolor: 'text.secondary', borderRadius: '24px' }}>
          {localStorage.getItem('paymentType') === 'equal' &&
            <Typography color='background.paper' align="center" variant="h4" component="div" sx={{ flexGrow: 1 }}>
              Charge/pp: ${charge[0].toFixed(2)}
            </Typography>
          }
          {localStorage.getItem('paymentType') === 'dish' &&
            Array(parseInt(localStorage.getItem('numSplit'))).fill(0).map((person, index) => (
              <Typography key={index} color='background.paper' align="center" variant="h4" component="div" sx={{ flexGrow: 1 }}>
                Person {index + 1} Charge : ${charge[index].toFixed(2)}
              </Typography>
            ))
          }
          <Typography color='background.paper' align="center" variant="h4" component="div" sx={{ flexGrow: 1 }}>
            Total Charge: ${total.toFixed(2)}
          </Typography>
          <Typography color='background.paper' align="center" variant="h7" component="div" sx={{ flexGrow: 1 }}>
            Please pay at the counter
          </Typography>
        </Box>
      </Box>
    </ >
  );
}

export default Bill;