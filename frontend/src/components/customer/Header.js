import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import logo from './logo.png'

const drawerWidth = 50;

function Header({title}) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Box>
            <img src={logo} alt="Logo" height="125px" width="125px"/>
          </Box>
          <Typography variant="h1" component="div" sx={{ flexGrow: 1, ml: `${drawerWidth}px` }}>
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Header;
