import * as React from 'react';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import StarsRoundedIcon from '@mui/icons-material/StarsRounded';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import Slide from '@mui/material/Slide';
import EditItemDialog from './EditItemDialog';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function MenuItemCard({item, categoryName, updateMenu}) {

  const [open, setOpen] = React.useState(false);

  const [openEditItem, setOpenEditItem] = React.useState(false);

  const handleCloseEditItem = () => {
    setOpenEditItem(false);
  };
  
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    const response = await fetch(`http://localhost:5000/manager/items/${item.id}`, {
      method: 'DELETE',
      mode: 'cors',
      headers: {
      'Content-type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(
        { 
          category: categoryName
        }
      )
    });
    const data = await response;
    if (response.ok) {
      updateMenu(true);
      setOpen(false);
    } else {
      alert(await data.error);
    }
  };

  // React.useEffect(() => {console.log("open", openEditItem);})

  
  const Img = styled('img')({
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  });

  return(
    < div >
      <ImageListItem sx={{ width: 230 }} onClick={handleClickOpen}>
        <img
          src={`${item.img}?w=230&h=200&fit=crop&auto=format`}
          srcSet={`${item.img}?w=230&h=200&fit=crop&auto=format&dpr=2 2x`}
          alt={item.title}
          loading="lazy"
        />
        {item.tags === "Chef's Reccomendation" && <ImageListItemBar
          subtitle={<StarsRoundedIcon />}
          position="top"
          sx={{ bgcolor: 'transparent' }}
          
        />}
        <ImageListItemBar
          title={item.title}
          subtitle={<span>${item.cost.toFixed(2)}</span>}
          position="below"
          actionIcon={
            <IconButton
              aria-label={`info about ${item.title}`}
            >
              <InfoIcon />
            </IconButton>
          }
        />
      </ImageListItem>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        fullWidth={true}
        maxWidth='sm'
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          {item.title}
        </DialogTitle>
        <DialogContent dividers sx={{ flexGrow: 1 }}>
          <Grid container spacing={2} alignItems="center"  sx={{ border:'1' }}>
            <Grid item xs={6} sx={{ width: 230, border:'1' }}>
              <Img
                src={`${item.img}?w=230&h=200&fit=crop&auto=format`}
                alt={item.title}
                loading="lazy"
              />
            </Grid>
            <Grid item xs={6}>
              <Typography gutterBottom>
                Description: {item.description}
              </Typography>
              <Typography gutterBottom>
                Ingredients: {item.ingredients}
              </Typography>
              <Typography gutterBottom>
                Category: {categoryName}
              </Typography>
              <Typography gutterBottom>
                Tags: {item.tags.join(', ')}
              </Typography>
              <Typography gutterBottom>
                Cost: ${item.cost.toFixed(2)}
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDelete}>Delete</Button>
          <Button onClick={() => setOpenEditItem(true)}>Edit</Button>
        </DialogActions>
      </Dialog>
      <EditItemDialog
        open={openEditItem}
        item={item}
        categoryName={categoryName}
        updateMenu={updateMenu}
        handleClose={handleCloseEditItem}/>
    </div>
  );
}