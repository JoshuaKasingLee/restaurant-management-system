import * as React from 'react';
import { Link } from 'react-router-dom';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RoomServiceRoundedIcon from '@mui/icons-material/RoomServiceRounded';
import ListAltRoundedIcon from '@mui/icons-material/ListAltRounded';
import RestaurantMenuRoundedIcon from '@mui/icons-material/RestaurantMenuRounded';
import SportsEsportsRoundedIcon from '@mui/icons-material/SportsEsportsRounded';

function Footer({initialValue}) {
  const [value, setValue] = React.useState(initialValue);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <BottomNavigation sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} value={value} onChange={handleChange}>
      <BottomNavigationAction
        label="Assistance"
        value="assistance"
        icon={<RoomServiceRoundedIcon fontSize="large" />}
      />
      <BottomNavigationAction
        label="Menu"
        value="menu"
        icon={<RestaurantMenuRoundedIcon fontSize="large" />}
        component={Link} to={'/customer/menu'}
      />
      <BottomNavigationAction
        label="Order"
        value="order"
        icon={<ListAltRoundedIcon fontSize="large" />}
        component={Link} to={'/customer/order'}
      />
      <BottomNavigationAction 
        label="Game" 
        value="game" 
        icon={<SportsEsportsRoundedIcon fontSize="large" />} 
        component={Link} to={'/customer/game'}
    />
    </BottomNavigation>
  );
}

export default Footer;
