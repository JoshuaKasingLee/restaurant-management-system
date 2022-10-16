import * as React from 'react';
import Header from '../../components/customer/Header';
import Footer from '../../components/customer/Footer';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import BillTable from '../../components/customer/BillTable';

function Bill() {
  // const [total, setTotal] = React.useState(0);
  const [charge, setCharge] = React.useState(0);
  // const [orderItems, setOrderItems] = React.useState([]);

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
            type: 'together',
            num: 4,
            dishes: {
              person1: [],
              person2: [],
              person3: [],
              person4: [],
            }
          }
        )
      });
      const data = await response.json();
      if (response.ok) {
        // console.log(data);
        localStorage.setItem('charge', data.charge[0]);
        setCharge( data.charge[0] );
        // setTotal( data.total );
        // setOrder( data.orderItems );

      } else {
        alert(await data.error);
      }
    }
    getBill();
  }, []);

  return (
    <>
      <Header title={"Bill"} />
      <Box height='72vh' sx={{ mt: '20px', display: "flex", flexDirection: 'column', justifyContent: "space-between", alignItems: "center"}}>
        <Typography align='center' variant="h3">
          Thank you for dining with us!
        </Typography>
        <BillTable />
        {/* <BillTable orderItems={orderItems} */}
        <Box alignItems='end' sx={{ px: '16px', py: '8px', bgcolor: 'text.secondary', borderRadius: '24px' }}>
          <Typography color='background.paper' align="center" variant="h4" component="div" sx={{ flexGrow: 1 }}>
            Total Charge: ${charge.toFixed(2)}
          </Typography>
          <Typography color='background.paper' align="center" variant="h7" component="div" sx={{ flexGrow: 1 }}>
            Please pay at the counter
          </Typography>
        </Box>
      </Box>
      <Footer initialValue={"order"} title={"Bill"} />
    </ >
  );
}

export default Bill;