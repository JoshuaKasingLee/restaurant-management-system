import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import RoomServiceRoundedIcon from '@mui/icons-material/RoomServiceRounded';
import logo from './logo.png'

const drawerWidth = 50;

function Header({title}) {
  const [selected, setSelected] = React.useState(JSON.parse(localStorage.getItem('assistance')));

  React.useEffect(() => {
    localStorage.setItem('assistance', selected)
  }, [selected]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="transparent">
        <Toolbar>
          <Box>
            <img src={'https://menufyproduction.imgix.net/637950714526548063+871748.png'} alt="Logo" height="125px" width="125px"/>
          </Box>
          <Typography variant="h1" component="div" sx={{ flexGrow: 1, ml: `${drawerWidth}px` }}>
            {title}
          </Typography>
          {title !== 'Table Selection' && title !== 'Admin' && <ToggleButton
          value="check"
          selected={selected}
          color="info"
          onChange={() => {
            setSelected( selected => !selected );
          }}
          >
            <RoomServiceRoundedIcon fontSize="large" />
          </ToggleButton>}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Header;
