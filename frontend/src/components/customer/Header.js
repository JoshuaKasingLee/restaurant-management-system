import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import RecordVoiceOverRoundedIcon from '@mui/icons-material/RecordVoiceOverRounded';

const drawerWidth = 50;

function Header({image, title}) {
  const [selected, setSelected] = React.useState(JSON.parse(localStorage.getItem('assistance')));

  const handleChange = () => {
    localStorage.setItem('assistance', !selected);
    setSelected( selected => !selected );
  };

  React.useEffect(() => {
    if (selected !== null) {
      if (title === 'Menu' || title === 'Orders' || title === 'Game') {
        const setAssistance = async () => {
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
                request: selected
              }
            )
          });
          const data = await response.json();
          if (response.ok) {
          } else {
            alert(await data.error);
          }
        };
        setAssistance();
        // console.log(selected + title + ' effect');
        // console.log(localStorage.getItem('assistance') + title + ' local');
        if (selected === true) {
          const getAssistance = async () => {
            const response = await fetch(`http://localhost:5000/customer/assistance?table=${localStorage.getItem('table')}`, {  
              method: 'GET',
              headers: {
              'Content-type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              },
            });
            const data = await response.json();
            if (response.ok) {
              localStorage.setItem('assistance', data.request);
              setSelected(data.request);
              // console.log(data.request);
            } else {
              alert(await data.error);
            }
          };
          const intervalID = setInterval(getAssistance, 1000)

          return (() => {
            clearInterval(intervalID)
          })
        }
      }
    }
  }, [title, selected]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="transparent">
        <Toolbar>
          <Box>
            {/* <img src={'https://menufyproduction.imgix.net/637950714526548063+871748.png'} alt="Logo" height="125px" width="125px"/> */}
            <img src={image} alt="Logo" height="125px" width="125px"/>
          </Box>
          <Typography variant="h1" component="div" sx={{ flexGrow: 1, ml: `${drawerWidth}px` }}>
          {title}
          </Typography>
          {title !== 'Table Selection' && title !== 'Admin' && title !== 'Bill' && <ToggleButton
          value="check"
          selected={selected}
          color="primary"
          onChange={handleChange}
          >
            <RecordVoiceOverRoundedIcon  sx={{width: 40, height: 40 }} />
          </ToggleButton>}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Header;
