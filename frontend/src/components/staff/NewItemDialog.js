import * as React from 'react';
import { Box, Button, TextField, Typography, FormControl, InputLabel, OutlinedInput, InputAdornment } from '@mui/material';
import Dropdown from './Dropdown';
import Checkboxes from './Checkboxes';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

export default function NewItemDialog({open, updateMenu, handleClose}) {
    
    const [name, setName] = React.useState('');
    const [category, setCategory] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [ingredients, setIngredients] = React.useState('');
    const [tags, setTags] = React.useState([]);
    const [cost, setCost] = React.useState(0.0);
    const [image, setImage] = React.useState('https://assets.stickpng.com/images/58889577bc2fc2ef3a1860be.png');

    const setCostWrapper = (value) => {
        setCost(parseFloat(value))
    }

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
            updateMenu(true);
            handleClose();
        } else {
          alert(await data.error);
        }
    } 

    // React.useEffect(() => {console.log("CAT", category)})

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth='md'>
        <DialogTitle>Edit Item</DialogTitle>
        <DialogContent>
        <Box maxWidth="md" m="auto" component="form"
            sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', p: 5 }} >
            <TextField
                required
                label="Title"
                value={name}
                onChange={e => setName(e.target.value)}
            />
            <FormControl fullWidth sx={{ m: 1 }} required>
                <InputLabel htmlFor="outlined-adornment-amount">Cost</InputLabel>
                <OutlinedInput
                    id="outlined-adornment-amount"
                    onChange={e => setCostWrapper(e.target.value)}
                    startAdornment={<InputAdornment position="start">$</InputAdornment>}
                    label="Cost"
                    value={cost}
                    type="number"
                    min="0"
                    step=".01"
                />
            </FormControl>
            <TextField
                label="Description"
                value={description}
                multiline
                required
                rows={3}
                onChange={e => setDescription(e.target.value)}
            />
            <TextField
                label="Ingredients"
                value={ingredients}
                multiline
                required
                rows={3}
                onChange={e => setIngredients(e.target.value)}
            />
            <Dropdown update={setCategory} category={category}/>
            <Checkboxes update={setTags} tags={tags}/>
            <TextField
                required
                label="Image Link"
                value={image}
                onChange={e => setImage(e.target.value)}
            />
        </Box>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={addNewItem}>Save</Button>
        </DialogActions>
        </Dialog>
    )
}