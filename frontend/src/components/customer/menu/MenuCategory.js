import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, 
  IconButton, ImageList, ImageListItem, ImageListItemBar, Slide, Typography } from '@mui/material';
import StarsRoundedIcon from '@mui/icons-material/StarsRounded';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import QuantityButtonGroup from '../QuantityButtonGroup';
import { ReactComponent as DairyIcon } from './DF.svg';
import { ReactComponent as GlutenIcon } from './GF.svg';
import { ReactComponent as NutIcon } from './NF.svg';
import { ReactComponent as StarIcon } from './CR.svg';
import { ReactComponent as VeganIcon } from './VE.svg';
import { ReactComponent as VegIcon } from './V.svg';
import SvgIcon from '@mui/material/SvgIcon';

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

function MenuCategory({category, filters, sort}) {
  const [categoryItems, setCategoryItems] = React.useState([]);
  const [open, setOpen] = React.useState(new Array(category.menu_items.length).fill(false));
  const [quantity, setQuantity] = React.useState(new Array(category.menu_items.length).fill(1));
  const [withinBudget, setWithinBudget] = React.useState(true);

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
      tagList.sort();
      content.push(
        { 
          order: category.menu_items[i].display_order,
          img: category.menu_items[i].img,
          title: category.menu_items[i].name,
          cost: category.menu_items[i].cost,
          description: category.menu_items[i].description,
          ingredients: category.menu_items[i].ingredients,
          tags: tagList,
        }
      );
    }
    if (sort.value === 'none') 
      content.sort( (a, b) => a.order < b.order ? -1 : 1 );
    else {
      content.sort( (a, b) => {
        if (a.cost === b.cost) return a.title < b.title ? -1 : 1;
        else if (sort.value === 'priceDesc') return a.cost > b.cost ? -1 : 1;
        else return a.cost < b.cost ? -1 : 1;
      });
    }
    setCategoryItems(content.filter( state => filters.every(val => state.tags.includes(val))));
  }, [category, filters, sort]);

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
    setWithinBudget(true);
  };

  const handleOrder = (item, index) => async () => {
    const response = await fetch('http://localhost:5000/customer/checkorder', {
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
    const data = await response.json();
    if (response.ok) {
      setWithinBudget(data.withinBudget);
      if(data.withinBudget) {
        const response1 = await fetch('http://localhost:5000/customer/order', {
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
        const data1 = await response1;
        if (response1.ok) {
          setOpen( state => ({ 
            ...state, 
            [index]: false
          }));
          setQuantity( state => ({ 
            ...state, 
            [index]: 1
          }));
        } else {
          alert(await data1.error);
        }
      }
    } else {
      alert(await data.error);
    }
  };

  return (
    <ImageList sx={{ width: 950, height: 500}} cols={4} rowHeight={250}>
      {categoryItems.map((item, index) => (
        < div key={item.img} style={{ border: '1px dashed red',borderRadius: '25%' }}>
          <ImageListItem sx={{ width: 230, boxShadow: 4 }} onClick={handleClickOpen(index)}>
            <img
              style={{ border: '1px dashed red', borderRadius: '10% 10% 0% 0%' }}
              src={`${item.img}?w=230&h=200&fit=crop&auto=format`}
              srcSet={`${item.img}?w=230&h=200&fit=crop&auto=format&dpr=2 2x`}
              alt={item.title}
              loading="lazy"
            />
            <ImageListItemBar
              position="top"
              sx={{ bgcolor:'transparent'}}
              actionIcon={
                <IconButton
                  aria-label={`star ${item.title}`}
                >
                  {item.tags.includes("Chef's Recommendation") && <SvgIcon component={StarIcon}/>}
                  {item.tags.includes("Vegetarian") && <SvgIcon component={VegIcon}/>}
                  {item.tags.includes("Vegan") && <SvgIcon component={VeganIcon}/>}
                  {item.tags.includes("Gluten Free") && <SvgIcon component={GlutenIcon}/>}
                  {item.tags.includes("Nut Free") && <SvgIcon component={NutIcon}/>}
                  {item.tags.includes("Diary Free") && <SvgIcon component={DairyIcon}/>}
                </IconButton>
              }
              actionPosition="right"
            />
            <ImageListItemBar
              title={item.title}
              subtitle={<span>${item.cost.toFixed(2)}</span>}
              position="below"
              // actionIcon={
              //   <IconButton
              //     sx={{ color: 'rgba(0, 0, 0, 0.54)' }}
              //     aria-label={`info about ${item.title}`}
              //   >
              //     {item.tags.includes("Chef's Recommendation") && <StarIcon />}
              //     {item.tags.includes("Chef's Recommendation") && <VegIcon />}
              //     {item.tags.includes("Chef's Recommendation") && <VeganIcon/>}
              //     {item.tags.includes("Chef's Recommendation") && <GlutenIcon/>}
              //     {item.tags.includes("Chef's Recommendation") && <NutIcon/>}
              //     {item.tags.includes("Chef's Recommendation") && <DairyIcon />}
              //   </IconButton>
              // }
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
            <BootstrapDialogTitle onClose={handleClose(index)}>
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
                  <QuantityButtonGroup 
                    initial={1}
                    min={1}
                    max={4} 
                    submit = { quantity => setQuantity( state => ({ ...state, [index]: quantity})) } 
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose(index)}>Cancel</Button>
              <Button onClick={handleOrder(item, index)}>Order</Button>
            </DialogActions>
            {!withinBudget && 
              <Alert severity="error">
                You will exceed you budget with this order. Update your budget to order more.
              </Alert>
            }
          </Dialog>
        </div>
      ))}
    </ImageList>
  );
}

export default MenuCategory;