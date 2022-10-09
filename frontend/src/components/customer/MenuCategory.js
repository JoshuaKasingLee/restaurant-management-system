import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import StarsRoundedIcon from '@mui/icons-material/StarsRounded';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


function MenuCategory({category}) {
  const [categoryItems, setCategoryItems] = React.useState([]);

  React.useEffect(() => {
    let content = [];
    for (let i=0; i < category.menu_items.length; i++) {
      content.push(
        { 
          img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',//images.category.menu_items[i].img.split('/')[1],
          title: category.menu_items[i].name,
          cost: '$' + category.menu_items[i].cost.toFixed(2),
          // tag: category.menu_items[i].tags //"Chef's Reccomendation"
        }
      );
      setCategoryItems( categoryItems => content );
    }
    // console.log(content);
  }, [category]);

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  
  return (
    <ImageList sx={{ width: 950, height: 500 }} cols={4} rowHeight={250}>
      {categoryItems.map((item) => (
        <>
        <ImageListItem key={item.img} sx={{ width: 230 }} onClick={handleClickOpen}>
          <img
            src={`${item.img}?w=248&fit=crop&auto=format`}
            srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
            alt={item.title}
            loading="lazy"
          />
          {item.tag === "Chef's Reccomendation" && <ImageListItemBar
            subtitle={<StarsRoundedIcon />}
            position="top"
            sx={{ bgcolor: 'transparent' }}
            
          />}
          <ImageListItemBar
            title={item.title}
            subtitle={<span>{item.cost}</span>}
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
        >
          <DialogTitle>{"Use Google's location service?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Let Google help apps determine location. This means sending anonymous
              location data to Google, even when no apps are running.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Disagree</Button>
            <Button onClick={handleClose}>Agree</Button>
          </DialogActions>
        </Dialog>
        </ >
      ))}
    </ImageList>
  );
}

export default MenuCategory;