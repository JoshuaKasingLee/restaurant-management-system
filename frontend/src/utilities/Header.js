import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import RecordVoiceOverRoundedIcon from '@mui/icons-material/RecordVoiceOverRounded';
import LogoutIcon from '@mui/icons-material/Logout';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import useAlert from './useAlert';
import { borderRadius } from '@mui/system';
import ExitDialog from '../components/customer/ExitDialog';

const drawerWidth = 50;

function Header({image, title, heading}) {
  const [selected, setSelected] = React.useState(JSON.parse(localStorage.getItem('assistance')));
  const [open, setOpen] = React.useState(false);

  const { setAlert } = useAlert();

  const handleChange = () => {
    localStorage.setItem('assistance', !selected);
    setSelected( selected => !selected );
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const renderHeading = (
    <Box 
      sx={{
        ml: 5,
        height: '30px',
        bgcolor: (theme) => theme.palette.primary.light,
        borderRadius: '8px',
        px: '16px',
        py: '5px',
        fontSize: '0.875rem',
        fontWeight: 700,
      }}
    >
      {heading}
    </Box>
  )

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
            setAlert(await data.error);
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
              setAlert(await data.error);
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
    <Box sx={{ width: '100vp', zIndex: 100, height: 60 }}>
      <AppBar sx={{bgcolor: 'background.paper' }}>
        <Toolbar >
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, pl: 3 }}>
            {/* <img src={'https://menufyproduction.imgix.net/637950714526548063+871748.png'} alt="Logo" height="125px" width="125px"/> */}
            <img src={image} alt="Logo" height="60px" width="60px"/>
            { heading !== null
              && renderHeading
            }
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'right', flexGrow: 1 }}>
            { !title.includes('Admin') && title !== 'Table Selection' && title !== 'Bill' &&
              <ToggleButton
                value="check"
                selected={selected}
                color="primary"
                onChange={handleChange}
                sx={{ width: 40, height: 40, ml: 'auto', mr: 3 }}
              >
                <RecordVoiceOverRoundedIcon/>
              </ToggleButton>
            }
            { title.includes('Admin') || title === 'Table Selection' || title === 'Bill'
              ? <>
                <ToggleButton
                  sx={{ mr: 3, width: 40, height: 40}}
                  color="primary"
                  value="exit"
                  component={Link} to={'/'}
                >
                  <LogoutIcon/>
                </ToggleButton>
              </> 
            : <>
                <ToggleButton
                  sx={{ mr: 3, width: 40, height: 40}}
                  color="primary"
                  value="exit"
                  onClick={handleClickOpen}
                >
                  <LogoutIcon/>
                </ToggleButton>
                <ExitDialog
                  open={open}
                  onClose={handleClose}
                />
              </>
            }
            
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Header;
