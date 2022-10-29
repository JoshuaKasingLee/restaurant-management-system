import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import RoomServiceRoundedIcon from '@mui/icons-material/RoomServiceRounded';

const drawerWidth = 50;

function Header({title}) {
  const [selected, setSelected] = React.useState(JSON.parse(localStorage.getItem('assistance')));
  // const [name, setName] = React.useState('');
  // const [image, setImage] = React.useState('');  

  // React.useEffect(() => {
  //   const getRestaurantInfo = async () => {
  //     const response = await fetch(`http://localhost:5000/restaurant`, {  
  //       method: 'GET',
  //       headers: {
  //         'Content-type': 'application/json'
  //       },
  //     });
  //     const data = await response.json();
  //     if (response.ok) {
  //       setName(data.name);
  //       setImage(data.image);
  //     } else {
  //       alert(await data.error);
  //     }
  //   };
  //   getRestaurantInfo();
  // }, []);

  const handleChange = () => {
    setSelected( selected => !selected );
  };

  React.useEffect(() => {
    localStorage.setItem('assistance', selected);
    if (selected !== null) {
      const geAssistance = async () => {
        const response = await fetch(`http://localhost:5000/customer/assistance`, {  
          method: 'PUT',
          mode: 'cors',
          headers: {
          'Content-type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(
            { 
              table: localStorage.getItem("table"),
              //request: selected,
            }
          )
        });
        const data = await response.json();
        if (response.ok) {
          localStorage.setItem('assistance', selected);
          // console.log(localStorage.getItem('assistance'));
        } else {
          alert(await data.error);
        }
      };
      geAssistance();
    }
  }, [selected]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="transparent">
        <Toolbar>
          <Box>
            <img src={'https://menufyproduction.imgix.net/637950714526548063+871748.png'} alt="Logo" height="125px" width="125px"/>
            {/* <img src={image} alt="Logo" height="125px" width="125px"/> */}
          </Box>
          <Typography variant="h1" component="div" sx={{ flexGrow: 1, ml: `${drawerWidth}px` }}>
            {title}
          </Typography>
          {title !== 'Table Selection' && title !== 'Admin' && <ToggleButton
          value="check"
          selected={selected}
          color="primary"
          onChange={handleChange}
          >
            <RoomServiceRoundedIcon fontSize="large" />
          </ToggleButton>}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Header;
