import * as React from 'react';
import { Link } from 'react-router-dom';
import { Badge, BottomNavigation, BottomNavigationAction, Box, Card } from '@mui/material';
import ListAltRoundedIcon from '@mui/icons-material/ListAltRounded';
import RestaurantMenuRoundedIcon from '@mui/icons-material/RestaurantMenuRounded';
import SportsEsportsRoundedIcon from '@mui/icons-material/SportsEsportsRounded';

function Footer({initialValue, title}) {
  const [value, setValue] = React.useState(initialValue);
  const [orders, setOrders] = React.useState(localStorage.getItem('orders') !== null 
    ? parseFloat(localStorage.getItem('orders')) : 0);

  React.useEffect(() => {
    if (value === 'menu') {
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
          localStorage.setItem( 'orders', data.orderItems.length );
          setOrders( data.orderItems.length );
        } else {
          alert(await data.error);
        }
      };
      
      const intervalID = setInterval(getOrder, 1000)
  
      return (() => {
        clearInterval(intervalID)
      })  
    }
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Card sx={{
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-evenly',
      position: 'fixed',
      bottom: 20,
      left: '50%',
      ml: '-120px',
      width: '240px',
      height: '65px',
      padding: 0}}
    >
      <BottomNavigation
        elevation={3} 
        value={value} 
        onChange={handleChange}
      >
        <BottomNavigationAction
          label="Menu"
          value="menu"
          icon={<RestaurantMenuRoundedIcon fontSize="medium" />}
          component={Link} to={'/customer/menu'}
        />
        <BottomNavigationAction
            label="Order"
            value="order"
            icon={
              <Badge badgeContent={orders} color="primary">
                <ListAltRoundedIcon fontSize="medium" />
              </Badge>
            }
            component={Link} to={'/customer/order'}
        />
        <BottomNavigationAction
            label="Game" 
            value="game" 
            icon={<SportsEsportsRoundedIcon fontSize="medium" />} 
            component={Link} to={'/customer/game'}
        />
      </BottomNavigation>
    </Card>
  );
}

export default Footer;
