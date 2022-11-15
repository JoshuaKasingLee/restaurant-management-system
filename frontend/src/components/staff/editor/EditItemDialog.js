import * as React from 'react';
import { Box, Button, TextField, FormControl, InputLabel, OutlinedInput, InputAdornment } from '@mui/material';
import Dropdown from './Dropdown';
import Checkboxes from './Checkboxes';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
// import CameraAltRoundedIcon from '@mui/icons-material/CameraAltRounded';
import useAlert from '../../../utilities/useAlert';

export default function EditItemDialog({open, item, categoryName, updateMenu, handleClose}) {
    
    const [name, setName] = React.useState(item.title);
    const [category, setCategory] = React.useState(categoryName);
    const [description, setDescription] = React.useState(item.description);
    const [ingredients, setIngredients] = React.useState(item.ingredients);
    const [tags, setTags] = React.useState(item.actualTags);
    const [cost, setCost] = React.useState(item.cost);
    const [image, setImage] = React.useState(item.img);
    const { setAlert } = useAlert();

    // const setCostWrapper = (value) => {
    //     setCost(parseFloat(value))
    // }

    const [disabled, setDisabled] = React.useState(false);

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
      
      setDisabled(false);

    }, [name, ingredients, description, cost, category])

    const editItem = async () => {
        const response = await fetch(`http://localhost:5000/manager/items/${item.id}`, {
          method: 'PUT',
          mode: 'cors',
          headers: {
          'Content-type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            newName: name,
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
            img: image,
            show: item.visible
            })
        });
        const data = await response.json();
        if (response.ok) {
            updateMenu(true);
            handleClose();
        } else {
          setAlert(await data.error);
        }
    }

    async function deleteItem() {
        const response = await fetch(`http://localhost:5000/manager/items/${item.id}`, {
          method: 'DELETE',
          mode: 'cors',
          headers: {
          'Content-type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            category: category,
            })
        });
        const data = await response.json();
        if (response.ok) {
            updateMenu(true);
            handleClose();
        } else {
          setAlert(await data.error);
        }
    }

    // React.useEffect(() => {console.log("CAT", category)})
    // const handleChangeImage = (event) => {
    //     setImage(URL.createObjectURL(event.target.files[0]))
    // }

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
                helperText="Max 100 characters"
                onChange={e => setName(e.target.value)}
            />
            <FormControl fullWidth sx={{ m: 0 }} required>
                <InputLabel htmlFor="outlined-adornment-amount">Cost</InputLabel>
                <OutlinedInput
                    id="outlined-adornment-amount"
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
            {/* <Button variant="outlined" component="label" startIcon={<CameraAltRoundedIcon />}>
                Upload Image
                <input hidden accept="image/*" type="file" onChange={handleChangeImage}/>
            </Button> */}
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
            <Button sx={{marginLeft: 2}} onClick={deleteItem}>Delete</Button>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={editItem} disabled={disabled}>Save</Button>
        </DialogActions>
        </Dialog>
    )
}