import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function EditCategoryDialog({open, category, handleClose, updateMenu}) {

  const [name, setName] = React.useState(category.title);
  // const [show, setShow] = React.useState(category.visible);

  // React.useEffect(() => {console.log("name", name)})
  // React.useEffect(() => {console.log("category.title", category.title)},[category])

  const [disabled, setDisabled] = React.useState(true);

  React.useEffect(() => {
    if (name.length <= 100 && name.length > 0) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [name])

  async function editCategory() {
    const response = await fetch(`http://localhost:5000/manager/categories/${category.id}`, {  
        method: 'PUT',
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
            name: name,
            // show: show
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

  const [openDeleteOptionsDialog, setOpenDOD] = React.useState(false);

  async function deleteCategory(deleteType) {
    const response = await fetch(`http://localhost:5000/manager/categories/${category.id}`, {  
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
            type: deleteType
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

  const handleCloseDOD = () => {
    setOpenDOD(false);
  }

  return(<>
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit Category</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Enter the name you would like your new category to be.
        </DialogContentText>
        <TextField
          autoFocus
          required
          margin="dense"
          id="newCategory"
          value={name}
          fullWidth
          helperText="Max 100 characters"
          onChange={e => setName(e.target.value)}
        />
        
      </DialogContent>
      <DialogActions>
        <Button onClick={() => {setOpenDOD(true);}}>Delete</Button>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={editCategory} disabled={disabled}>Save</Button>
      </DialogActions>
    </Dialog>
    
    <Dialog
      open={openDeleteOptionsDialog}
      onClose={handleCloseDOD}
    >
      <DialogTitle>
        What would you like to do with the items in this category?
      </DialogTitle>
      <DialogContent>
        "Remove Items" will permanently delete all items within this category.
        "Keep Items" will move the items to the 'Unassigned' category.
      </DialogContent>
      <DialogActions>
        <Button onClick={() => {deleteCategory("removeItems"); handleCloseDOD();}}>Remove Items</Button>
        <Button onClick={() => {deleteCategory("keepItems"); handleCloseDOD();}}>Keep Items</Button>
      </DialogActions>
    </Dialog>
  </>)
}