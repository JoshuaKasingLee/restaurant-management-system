import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import StarsRoundedIcon from '@mui/icons-material/StarsRounded';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';

function MenuCategory({category}) {
  const [categoryItems, setCategoryItems] = React.useState([]);

  React.useEffect(() => {
    let content = [];
    for (let i=0; i < category.menu_items.length; i++) {
      content.push(
        { 
          img: category.menu_items[i].img,
          title: category.menu_items[i].name,
          cost: category.menu_items[i].cost,
          // tag: category.menu_items[i].tags //"Chef's Reccomendation"
        }
      );
      setCategoryItems( categoryItems => content );
    }
    // console.log(content);
  }, [category]);
  
  return (
    <ImageList sx={{ width: 950, height: 500 }} cols={4} rowHeight={250}>
      {categoryItems.map((item) => (
        <ImageListItem key={item.img}>
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
      ))}
    </ImageList>
  );
}

export default MenuCategory;

const itemData = [
  {
    img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
    title: 'Breakfast',
    cost: '$100',
    tag: "Chef's Reccomendation"
  },
  {
    img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
    title: 'Burger',
    cost: '$9',
  },
  {
    img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
    title: 'Camera',
    cost: '$300',
    tag: "Chef's Reccomendation"
  },
  {
    img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
    title: 'Coffee',
    cost: '$3',
  },
  {
    img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
    title: 'Hats',
    cost: '$4',
    tag: "Chef's Reccomendation"
  },
  {
    img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
    title: 'Honey',
    cost: '$43',
  },
  {
    img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
    title: 'Basketball',
    cost: '$13.45',
  },
  {
    img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
    title: 'Fern',
    cost: '$19',
  },
  {
    img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
    title: 'Mushrooms',
    cost: '$32',
  },
  {
    img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
    title: 'Tomato basil',
    cost: '$42',
  },
  {
    img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
    title: 'Sea star',
    cost: '$20',
  },
  {
    img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
    title: 'Bike',
    cost: '$102',
  },
];
