import * as React from 'react';
import { styled } from '@mui/material/styles';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import StarsRoundedIcon from '@mui/icons-material/StarsRounded';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%',
});

function MenuCategory({category, filters}) {
  const [categoryItems, setCategoryItems] = React.useState([]);
  const [open, setOpen] = React.useState(new Array(category.menu_items.length).fill(false));
  const [quantity, setQuantity] = React.useState(new Array(category.menu_items.length).fill(1));

  React.useEffect(() => {
    let content = [];
    for (let i=0; i < category.menu_items.length; i++) {
      let tagList = [];
      if (category.menu_items[i].tags.vegetarian) tagList.push('Vegetarian');
      if (category.menu_items[i].tags.vegan) tagList.push('Vegan');
      if (category.menu_items[i].tags['gluten free']) tagList.push('Gluten Free');
      if (category.menu_items[i].tags['nut free']) tagList.push('Nut Free');
      if (category.menu_items[i].tags['dairy free']) tagList.push('Dairy Free');
      if (category.menu_items[i].tags['chef recommended']) tagList.push("Chef's Recommendation");
      content.push(
        { 
          img: category.menu_items[i].img,
          title: category.menu_items[i].name,
          cost: category.menu_items[i].cost,
          description: category.menu_items[i].description,
          ingredients: category.menu_items[i].ingredients,
          tags: tagList //"Chef's Reccomendation"
        }
      );
      setCategoryItems( categoryItems => content );
      setOpen( open => (new Array(category.menu_items.length).fill(false)) );
    }
    // console.log(content);
  }, [category]);

  const handleClickOpen = (index) => () => {
    setOpen( state => ({ 
      ...state, 
      [index]: true
    }));
  };

  const handleClose = (index) => () => {
    setOpen( state => ({ 
      ...state, 
      [index]: false
    }));
    setQuantity( state => ({ 
      ...state, 
      [index]: 1
    }));
  };

  const handleSubtract = (index) => () => {
    setQuantity( state => ({ 
      ...state, 
      [index]: (Math.max(1, state[index] - 1))
    }));
  };

  const handleAdd = (index) => () => {
    setQuantity( state => ({ 
      ...state, 
      [index]: (state[index] + 1)
    }));
  };
  
  const handleOrder = (item, index) => async () => {
    const response = await fetch('http://localhost:5000/customer/order', {
      method: 'POST',
      mode: 'cors',
      headers: {
      'Content-type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(
        { 
          table: localStorage.getItem("table"),
          menuItem: item.title,
          quantity: quantity[index]
        }
      )
    });
    const data = await response;
    if (response.ok) {
      setOpen( state => ({ 
        ...state, 
        [index]: false
      }));
      setQuantity( state => ({ 
        ...state, 
        [index]: 1
      }));
    } else {
      alert(await data.error);
    }

  };

  return (
    <ImageList sx={{ width: 950, height: 500 }} cols={4} rowHeight={250}>
      {categoryItems.map((item, index) => (
        < div key={item.img}>
          <ImageListItem sx={{ width: 230 }} onClick={handleClickOpen(index)}>
            <Img
              src={`${item.img}?w=230&h=200&fit=crop&auto=format`}
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
            open={open[index]}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose(index)}
            aria-describedby="alert-dialog-slide-description"
            fullWidth={true}
            maxWidth='sm'
          >
            <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose(index)}>
              {item.title}
            </BootstrapDialogTitle>
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
                    Category: {category.name}
                  </Typography>
                  <Typography gutterBottom>
                    Tags: {item.tags.join(', ')}
                  </Typography>
                  <Typography gutterBottom>
                    Cost: ${item.cost.toFixed(2)}
                  </Typography>
                  <ButtonGroup variant="outlined" aria-label="outlined button group">
                    <Button sx={{ width: 50 }} onClick={handleSubtract(index)}>
                      <Typography variant="h4">
                        -
                      </Typography>
                    </Button>
                    <Box display="flex" sx={{ border: 1, width: 50, textAlign: 'center' }} justifyContent="center" alignItems="center">
                      <Typography variant="h4">
                        {JSON.stringify(quantity[index])}
                      </Typography>
                    </Box>
                    <Button sx={{ width: 50 }} onClick={handleAdd(index)}>
                      <Typography variant="h4">
                        +
                      </Typography>
                    </Button>
                </ButtonGroup>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleOrder(item, index)}>Order</Button>
            </DialogActions>
          </Dialog>
        </div>
      ))}
    </ImageList>
  );
}

export default MenuCategory;