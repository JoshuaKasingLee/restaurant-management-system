import * as React from 'react';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
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
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { ReactComponent as DairyIcon } from '../customer/menu/DF.svg';
import { ReactComponent as GlutenIcon } from '../customer/menu/GF.svg';
import { ReactComponent as NutIcon } from '../customer/menu/NF.svg';
import { ReactComponent as StarIcon } from '../customer/menu/CR.svg';
import { ReactComponent as VeganIcon } from '../customer/menu/VE.svg';
import { ReactComponent as VegIcon } from '../customer/menu/V.svg';
import SvgIcon from '@mui/material/SvgIcon';
import useAlert from '../../utilities/useAlert';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function MenuItemCard({item, categoryName, updateMenu}) {

  const [open, setOpen] = React.useState(false);
  const [visible, setVisible] = React.useState(item.visible);

  const [openEditItem, setOpenEditItem] = React.useState(false);

  const { setAlert } = useAlert();

  const handleCloseEditItem = () => {
    setOpenEditItem(false);
  };
  
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleToggleVisibility = (e) => {
    visible ? setVisible(false) : setVisible(true);
    editItem();
    e.stopPropagation();
  };

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
        newName: item.title,
        category: categoryName,
        description: item.description,
        ingredients: item.ingredients,
        tags: {
            vegetarian: item.actualTags.includes("vegetarian"),
            vegan: item.actualTags.includes("vegan"),
            "gluten free": item.actualTags.includes("gluten free"),
            "nut free": item.actualTags.includes("nut free"),
            "dairy free": item.actualTags.includes("dairy free"),
            "chef recommended": item.actualTags.includes("chef recommended"),
        },
        cost: parseFloat(item.cost),
        img: item.img,
        show: visible
        })
    });
    const data = await response.json();
    if (response.ok) {
      updateMenu(true);
    } else {
      setAlert(await data.error);
    }
  }

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
    const data = await response.json();
    if (response.ok) {
      updateMenu(true);
      setOpen(false);
    } else {
      setAlert(await data.error);
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
    < div key={item.img} style={{ borderRadius: '5% 5% 0% 0%' }}>
      <ImageListItem sx={{ width: 230, boxShadow: 3, borderRadius: '5%' }} onClick={handleClickOpen}>
        <img
          style={{ borderRadius: '5% 5% 0% 0%' }}
          src={`${item.img}?w=230&h=200&fit=crop&auto=format`}
          srcSet={`${item.img}?w=230&h=200&fit=crop&auto=format&dpr=2 2x`}
          alt={item.title}
          loading="lazy"
        />
        <ImageListItemBar
          position="top"
          sx={{
            background:
              'linear-gradient(to bottom, rgba(255,255,255,0.7) 0%, ' +
              'rgba(255,255,255,0.3) 70%, rgba(255,255,255,0) 100%)',
          }}
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
          sx={{ px: 1 }}
          actionIcon={           
            <IconButton
            onClick={(e) => handleToggleVisibility(e)}>
            {visible
              ? <VisibilityIcon/>
              : <VisibilityOffIcon/>
            }
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
              <Typography component='div' gutterBottom>
                {item.tags.includes("Chef's Recommendation") && <SvgIcon component={StarIcon}/>}
                {item.tags.includes("Vegetarian") && <SvgIcon component={VegIcon}/>}
                {item.tags.includes("Vegan") && <SvgIcon component={VeganIcon}/>}
                {item.tags.includes("Gluten Free") && <SvgIcon component={GlutenIcon}/>}
                {item.tags.includes("Nut Free") && <SvgIcon component={NutIcon}/>}
                {item.tags.includes("Diary Free") && <SvgIcon component={DairyIcon}/>}
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