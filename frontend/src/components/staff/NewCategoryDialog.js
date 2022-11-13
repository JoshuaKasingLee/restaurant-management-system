  import * as React from 'react';
  import Button from '@mui/material/Button';
  import TextField from '@mui/material/TextField';
  import Dialog from '@mui/material/Dialog';
  import DialogActions from '@mui/material/DialogActions';
  import DialogContent from '@mui/material/DialogContent';
  import DialogContentText from '@mui/material/DialogContentText';
  import DialogTitle from '@mui/material/DialogTitle';
  import useAlert from '../../utilities/useAlert';
  
  export default function NewCategoryDialog({open, handleClose, updateMenu}) {

  const [name, setName] = React.useState('');
  const [disabled, setDisabled] = React.useState(true);

  const { setAlert } = useAlert();

  React.useEffect(() => {
    if (name.length <= 100 && name.length > 0) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [name])

  async function createNewCategory() {
    const response = await fetch(`http://localhost:5000/manager/categories`, {  
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
            name: name
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

  return(
    <Dialog open={open} onClose={handleClose}>
    <DialogTitle>New Category</DialogTitle>
    <DialogContent>
    <DialogContentText>
      Enter the name you would like your new category to be.
    </DialogContentText>
    <TextField
      autoFocus
      required
      margin="dense"
      id="newCategory"
      label="Category Name"
      fullWidth
      variant="standard"
      helperText="Max 100 characters"
      onChange={e => setName(e.target.value)}
    />
    </DialogContent>
    <DialogActions>
    <Button onClick={handleClose}>Cancel</Button>
    <Button onClick={createNewCategory} disabled={disabled}>Create</Button>
    </DialogActions>
    </Dialog>
  )
}