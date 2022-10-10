import * as React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, TextField, Typography } from '@mui/material';
import Dropdown from '../../components/staff/Dropdown';
import Checkboxes from '../../components/staff/Checkboxes';

export default function NewItem() {
    return (
        <Box maxWidth="md" m="auto" component="form"
            sx={{ display: 'flex', flexDirection: 'column', gap: '2rem', p: 10 }} >
            <Typography variant="h5">New Item</Typography>
            <TextField
                required
                label="Title"
            />
            <TextField
                required
                label="Cost"
            />
            <TextField
                label="Description"
                multiline
                required
                rows={3}
            />
            <TextField
                label="Ingredients"
                multiline
                required
                rows={3}
            />
            <Dropdown />
            <Checkboxes />
            <div>
                <Button variant="contained">Add</Button>
                <Button sx={{marginLeft: 2}}>Cancel</Button>
            </div>
        </Box>
    )
}