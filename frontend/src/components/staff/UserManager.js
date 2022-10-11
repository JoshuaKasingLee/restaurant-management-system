import * as React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, TextField, Typography } from '@mui/material';
import { MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import Dropdown from '../../components/staff/Dropdown';
import Checkboxes from '../../components/staff/Checkboxes';

export default function NewItem() {
    const numTables = 20;
    const [tables, setTables] = React.useState('');
    const [name, setName] = React.useState('');
    const [image, setImage] = React.useState('');
    const [kPass, setKPass] = React.useState('');
    const [wPass, setWPass] = React.useState('');
    const [mPass, setMPass] = React.useState('');

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
            alert(await data.error);
          }
        }

        getFields()

        }, []);

    const getTableContent = numTables => {
        let content = [];
        for (let i = 1; i <= numTables; i++) {
          content.push(<MenuItem value={i}>{i}</MenuItem>);
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
          alert(await data.error);
        }
    } 

    return (
        <Box maxWidth="md" m="auto" component="form"
            sx={{ display: 'flex', flexDirection: 'column', gap: '2rem', p: 10 }} >
            <Typography variant="h5">Restaurant</Typography>
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
                >
                {getTableContent(numTables)}
                </Select>
            </FormControl>
            {/* <Button variant="outlined">Upload Image</Button> */}
            <TextField
                required
                label="Image Link"
                onChange={e => setImage(e.target.value)}
            />
            <Typography variant="h5">Passwords</Typography>
            <TextField
            label="Kitchen Password"
            required
            type="password"
            value={kPass}
            onChange={e => setKPass(e.target.value)}
            />
            <TextField
            label="Wait Password"
            required
            type="password"
            value={wPass}
            onChange={e => setWPass(e.target.value)}
            />
            <TextField
            label="Manager Password"
            required
            type="password"
            value={mPass}
            onChange={e => setMPass(e.target.value)}
            />
            <div>
                <Button variant="contained" onClick={updateInfo}>Save</Button>
                <Button sx={{marginLeft: 2}}>Reset</Button>
            </div>
        </Box>
    )
}


