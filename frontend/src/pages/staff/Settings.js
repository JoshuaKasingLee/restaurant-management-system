import * as React from 'react';
import { Box, Button, MenuItem, FormControl, InputLabel, Select, TextField, 
  Typography } from '@mui/material';
import PasswordInput from '../../components/staff/settings/PasswordInput';
import Footer from '../../components/staff/Footer';
import Header from '../../utilities/Header';
import useAlert from '../../utilities/useAlert';

export default function NewItem() {
  const numTables = 20;
  const [tables, setTables] = React.useState('');
  const [name, setName] = React.useState('');
  const [image, setImage] = React.useState('');
  const [kPass, setKPass] = React.useState('');
  const [wPass, setWPass] = React.useState('');
  const [mPass, setMPass] = React.useState('');
  const [trigger, setTrigger] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);

  const { setAlert } = useAlert();

  React.useEffect(() => {
    let p = [kPass, wPass, mPass];
    for (let i = 0; i < p.length; i++) {
      let numPat = /[0-9]/;
      const upperPat = /[A-Z]/;
      if (!(p[i].length >= 10 && p[i].length <= 100 && numPat.test(p[i]) && upperPat.test(p[i]))) {
        setDisabled(true);
        return;
      } else {
        setDisabled(false);
      }
    }
  }, [kPass, wPass, mPass])

  React.useEffect(() => {  
    const getFields = async () => {
      const response = await fetch(`http://localhost:5000/manager/users`, {  
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });
      const data = await response.json();

      if (response.ok) {
        setName(data.restaurant.name)
        setTables(data.restaurant.tables)
        setImage(data.restaurant.image)
        setKPass(data.passwords.kitchen)
        setWPass(data.passwords.wait)
        setMPass(data.passwords.manager)
      } else {
        setAlert(await data.error);
      }
    }

    getFields()
    setTrigger(false)
  // eslint-disable-next-line
    }, [trigger]);

  const getTableContent = numTables => {
    let content = [];
    for (let i = 1; i <= numTables; i++) {
      content.push(<MenuItem key={i} value={i}>{i}</MenuItem>);
    }
    return content;
  };
  
  const updateInfo = async () => {
    const response = await fetch('http://localhost:5000/manager/users', {
      method: 'POST',
      mode: 'cors',
      headers: {
      'Content-type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        restaurant: {
          name: name,
          tables: tables,
          image: image
        },
        passwords: {
          kitchen: kPass,
          wait: wPass,
          manager: mPass
        }
      })
    });
    const data = await response.json();
    if (response.ok) {
      setName(data.restaurant.name)
      setTables(data.restaurant.tables)
      setImage(data.restaurant.image)
      setKPass(data.passwords.kitchen)
      setWPass(data.passwords.wait)
      setMPass(data.passwords.manager)
    } else {
      setAlert(await data.error);
    }
  } 

  return (<>
    <Header
      image={localStorage.getItem('restaurantImage')}
      title={"Admin-Manager"}
      heading="Manager"
    />
    <Box 
      maxWidth="md"
      m="auto"
      sx={{ display: 'flex', flexDirection: 'column', gap: '2rem', pt: 5, pb: 5 }}
    >
      <Typography variant="h5">Restaurant</Typography>
      <Box display='flex' flexDirection='row' justifyContent='space-between' >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: 590 }}>
          <TextField
            required
            label="Name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <FormControl fullWidth required>
            <InputLabel>Tables</InputLabel>
            <Select
              value={tables}
              label="Table"
              onChange={e => setTables(e.target.value)}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 224
                  },
                },
              }}
            >
              {getTableContent(numTables)}
            </Select>
          </FormControl>
          <TextField
            required
            label="Image Link"
            value={image}
            onChange={e => setImage(e.target.value)}
          />
        </Box>
        <Box 
          display='flex' 
          flexDirection='column' 
          alignItems='center'
          sx={{ border:1, borderRadius:2, boxShadow:2, p:2, width: 280, overflow:'hidden'}}>
          <Typography variant='h3' textAlign='center' component='div'>
            {name}
          </Typography>
          <Box sx={{ width: '150px' }}>
            <img 
              src={image}
              alt="img"
            /> 
          </Box> 
        </Box>
      </Box>
      <Typography variant="h5">Passwords</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 3}}>
        <PasswordInput 
          labelName="Kitchen Password*"
          id = "kitchen password"
          value={kPass}
          submit = { password => setKPass(password) } 
        />
        <PasswordInput 
          labelName="Wait Password*"
          id = "wait password"
          value={wPass}
          submit = { password => setWPass(password) } 
        />
        <PasswordInput 
          labelName="Manager Password*"
          id = "manager password"
          value={mPass}
          submit = { password => setMPass(password) } 
        />
      </ Box>
      <div>
        <Button variant="contained" onClick={updateInfo} disabled={disabled}>Save</Button>
        <Button variant="outlined" sx={{marginLeft: 2}} onClick={() => setTrigger(true)}>Reset</Button>
      </div>
    </Box>
    <Footer initialValue={"Settings"}></Footer>
  </>
  )
}