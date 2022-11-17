import * as React from 'react';
import { Link } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction, Card } from '@mui/material';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import SettingsIcon from '@mui/icons-material/Settings';
import SportsEsportsRoundedIcon from '@mui/icons-material/SportsEsportsRounded';

function Footer({initialValue}) {
  const [value, setValue] = React.useState(initialValue);

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
        padding: 0,
        pb: 0.4}}
      >
        <BottomNavigation
          elevation={3} 
          value={value} 
          onChange={handleChange}
        >
        <BottomNavigationAction
          label="Editor"
          value="Editor"
          icon={<DesignServicesIcon fontSize="medium" />}
          component={Link} to={'/staff/manager/menuEditor'}
        />
        <BottomNavigationAction
            label="Settings"
            value="Settings"
            icon={
                <SettingsIcon fontSize="medium" />
            }
            component={Link} to={'/staff/manager/settings'}
        />
        <BottomNavigationAction
            label="Game" 
            value="Game" 
            icon={<SportsEsportsRoundedIcon fontSize="medium" />} 
            component={Link} to={'/staff/manager/entertainment'}
        />
      </BottomNavigation>
    </Card>
  );
}

export default Footer;