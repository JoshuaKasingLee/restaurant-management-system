import * as React from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
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
    <Box sx={{ position: 'fixed', bottom: 10 }}>
      {title !== 'Table Selection' && <Box width="160px" alignItems='end' sx={{ mx: '10px', bgcolor: 'text.secondary', borderRadius: '16px' }}>
        <Typography color='background.paper' align="center" variant="h4" component="div" sx={{ flexGrow: 1 }}>
        Table {localStorage.getItem('table')}
        </Typography>
      </Box>} 
      {title !== 'Table Selection' && title !== 'Bill'
      ? (<BottomNavigation  
        sx={{ position: 'fixed', display:'flex', justifyContent:'space-between', bottom: 0, left: 180, right: 0 }}  
        elevation={3} 
        value={value} 
        onChange={handleChange}
      >
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
        <BottomNavigationAction 
          label="Admin" 
          value="admin" 
          icon={<AdminPanelSettingsRoundedIcon fontSize="large" />} 
          component={Link} to={'/'}
        />
      </BottomNavigation>)
      : (<BottomNavigation 
        sx={{ position: 'fixed', display:'flex', justifyContent:'flex-end', bottom: 0, left: 180, right: 0 }}  
        elevation={3} 
        value={value} 
        onChange={handleChange}
      >
        <BottomNavigationAction 
          label="Admin" 
          value="admin" 
          icon={<AdminPanelSettingsRoundedIcon fontSize="large" />} 
          component={Link} to={'/'}
        />
      </BottomNavigation>)}
    </Box>
  );
}

export default Footer;
