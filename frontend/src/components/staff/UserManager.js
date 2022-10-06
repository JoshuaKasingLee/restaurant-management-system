import * as React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, TextField, Typography } from '@mui/material';
import { MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import Dropdown from '../../components/staff/Dropdown';
import Checkboxes from '../../components/staff/Checkboxes';

export default function NewItem() {
    const numTables = 20;
    const [table, setTable] = React.useState('');

    const getTableContent = numTables => {
        let content = [];
        for (let i = 1; i <= numTables; i++) {
          content.push(<MenuItem value={i}>{i}</MenuItem>);
        }
        return content;
    };
    
    return (
        <Box maxWidth="md" m="auto" component="form"
            sx={{ display: 'flex', flexDirection: 'column', gap: '2rem', p: 10 }} >
            <Typography variant="h5">Restaurant</Typography>
            <TextField
            required
            label="Name"
            />
            <FormControl fullWidth required>
                <InputLabel>Tables</InputLabel>
                <Select
                value={table}
                label="Table"
                onChange={e => setTable(e.target.value)}
                >
                {getTableContent(numTables)}
                </Select>
            </FormControl>
            <Button variant="outlined">Upload Image</Button>
            <Typography variant="h5">Passwords</Typography>
            <TextField
            label="Kitchen Password"
            required
            type="password"
            autoComplete="current-password"
            />
            <TextField
            label="Wait Password"
            required
            type="password"
            autoComplete="current-password"
            />
            <TextField
            label="Manager Password"
            required
            type="password"
            autoComplete="current-password"
            />
            <div>
                <Button variant="contained">Save</Button>
                <Button sx={{marginLeft: 2}}>Reset</Button>
            </div>
        </Box>
    )
}


