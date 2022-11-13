import * as React from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import ListAltRoundedIcon from '@mui/icons-material/ListAltRounded';
import RestaurantMenuRoundedIcon from '@mui/icons-material/RestaurantMenuRounded';
import SportsEsportsRoundedIcon from '@mui/icons-material/SportsEsportsRounded';
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import Typography from '@mui/material/Typography';

function Footer({initialValue, title}) {
  const [value, setValue] = React.useState(initialValue);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Card sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-evenly',
      position: 'fixed',
      bottom: 20,
      left: '50%',
      ml: '-120px',
      width: '240px',
      height: '60px',
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
            icon={<ListAltRoundedIcon fontSize="medium" />}
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
