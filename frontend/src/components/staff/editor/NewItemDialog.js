import * as React from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, 
  FormControl, InputLabel, OutlinedInput, InputAdornment } from '@mui/material';
import Dropdown from './Dropdown';
import Checkboxes from './Checkboxes';
import useAlert from '../../../utilities/useAlert';

export default function NewItemDialog({open, updateMenu, handleClose}) {
    
  const [name, setName] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [ingredients, setIngredients] = React.useState('');
  const [tags, setTags] = React.useState([]);
  const [cost, setCost] = React.useState('');
  const [image, setImage] = React.useState('https://backend.grindcitymedia.com/wp-content/uploads/2020/03/no-image-availabe.png');

  const { setAlert } = useAlert();

  const [disabled, setDisabled] = React.useState(true);

  React.useEffect(() => {
    if (!(name.length <= 100 && name.length > 0)) {
      setDisabled(true);
      return;
    }

    if (!(description.length <= 200 && description.length > 0)) {
      setDisabled(true);
      return;
    }

    if (!(ingredients.length <= 250 && ingredients.length > 0)) {
      setDisabled(true);
      return;
    }

    if (!(cost > 0)) {
      setDisabled(true);
      return;
    }

    if (!(category.length > 0)) {
      setDisabled(true);
      return;
    }
    
    setDisabled(false);

  }, [name, ingredients, description, cost, category])

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
        cost: parseFloat(cost),
        img: image
        })
    });
    const data = await response.json();
    if (response.ok) {
        updateMenu();
        handleCloseDialog();
    } else {
      setAlert(await data.error);
    }
  } 

  const handleCloseDialog = () => {
    setName('');
    setCategory('');
    setDescription('');
    setIngredients('');
    setTags([]);
    setCost('');
    setImage('https://backend.grindcitymedia.com/wp-content/uploads/2020/03/no-image-availabe.png');
    handleClose();
  }

  return (
    <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth='md'>
    <DialogTitle>New Item</DialogTitle>
    <DialogContent>
    <Box maxWidth="md" m="auto" component="form"
      sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', p: 5 }} >
      <TextField
          required
          label="Title"
          value={name}
          helperText="Max 100 characters"
          onChange={e => setName(e.target.value)}
      />
      <FormControl fullWidth sx={{ ml: 0 }} required>
        <InputLabel htmlFor="cost-adornment-amount">Cost</InputLabel>
        <OutlinedInput
          id="cost-adornment-amount"
          onChange={e => setCost(e.target.value)}
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
        helperText="Max 200 characters"
        onChange={e => setDescription(e.target.value)}
      />
      <TextField
        label="Ingredients"
        value={ingredients}
        multiline
        required
        rows={3}
        helperText="Max 250 characters"
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
      <Box sx={{ width: '200px' }}>
          <img 
          src={image}
          alt="img"
          /> 
      </Box> 
    </Box>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleCloseDialog}>Cancel</Button>
      <Button onClick={addNewItem} disabled={disabled}>Save</Button>
    </DialogActions>
    </Dialog>
  )
}