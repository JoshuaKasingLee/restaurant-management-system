import * as React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, TextField, Typography, FormControl, InputLabel, OutlinedInput, InputAdornment } from '@mui/material';
import Dropdown from '../../components/staff/Dropdown';
import Checkboxes from '../../components/staff/Checkboxes';
import { useNavigate } from 'react-router-dom';

export default function NewItem() {
    
    const [name, setName] = React.useState('');
    const [category, setCategory] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [ingredients, setIngredients] = React.useState('');
    const [tags, setTags] = React.useState('');
    const [cost, setCost] = React.useState(0);
    const [image, setImage] = React.useState('https://assets.stickpng.com/images/58889577bc2fc2ef3a1860be.png');

    const navigate = useNavigate();

    const addNewItem = async () => {
        const response = await fetch('http://localhost:5000/manager/items', {
          method: 'POST',
          mode: 'cors',
          headers: {
          'Content-type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            name: name,
            category: category,
            description: description,
            ingredients: ingredients,
            tags: {
                vegetarian: tags.includes("vegetarian"),
                vegan: tags.includes("vegan"),
                "gluten free": tags.includes("gluten free"),
                "nut free": tags.includes("nut free"),
                "dairy free": tags.includes("dairy free"),
                "chef recommended": tags.includes("chef recommended"),
            },
            cost: cost,
            img: image
            })
        });
        const data = await response.json();
        if (response.ok) {
            navigate('/staff/manager/')
        } else {
          alert(await data.error);
        }
    } 
    
    
    return (
        <Box maxWidth="md" m="auto" component="form"
            sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', p: 10 }} >
            <Typography variant="h5">New Item</Typography>
            <TextField
                required
                label="Title"
                onChange={e => setName(e.target.value)}
            />
            <FormControl fullWidth sx={{ m: 1 }} required>
                <InputLabel htmlFor="outlined-adornment-amount">Cost</InputLabel>
                <OutlinedInput
                    id="outlined-adornment-amount"
                    onChange={e => setCost(e.target.value)}
                    startAdornment={<InputAdornment position="start">$</InputAdornment>}
                    label="Cost"
                    type="number"
                    min="0"
                    step=".01"
                />
            </FormControl>
            <TextField
                label="Description"
                multiline
                required
                rows={3}
                onChange={e => setDescription(e.target.value)}
            />
            <TextField
                label="Ingredients"
                multiline
                required
                rows={3}
                onChange={e => setIngredients(e.target.value)}
            />
            <Dropdown update={setCategory}/>
            <Checkboxes update={setTags}/>
            <TextField
                required
                label="Image Link"
                onChange={e => setImage(e.target.value)}
            />
            <div>
                <Button variant="contained" onClick={addNewItem}>Add</Button>
                <Button sx={{marginLeft: 2}} onClick={() => navigate('/staff/manager/')}>Cancel</Button>
            </div>
        </Box>
    )
}