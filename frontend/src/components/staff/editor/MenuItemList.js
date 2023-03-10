import * as React from 'react';
import { ImageList } from '@mui/material';
import MenuItemCard from './MenuItemCard';
import { ALL_TAGS_LIST } from '../../../utilities/constants';


export default function MenuItemList({category, updateMenu}) {
  const [categoryItems, setCategoryItems] = React.useState([]);
  
  React.useEffect(() => {
    let content = [];
    for (let i=0; i < category.menu_items.length; i++) {
      if (category.menu_items.length === 0) continue;
      let tagList = [];
      if (category.menu_items[i].tags.vegetarian) tagList.push('Vegetarian');
      if (category.menu_items[i].tags.vegan) tagList.push('Vegan');
      if (category.menu_items[i].tags['gluten free']) tagList.push('Gluten Free');
      if (category.menu_items[i].tags['nut free']) tagList.push('Nut Free');
      if (category.menu_items[i].tags['dairy free']) tagList.push('Dairy Free');
      if (category.menu_items[i].tags['chef recommended']) tagList.push("Chef's Recommendation");
      
      let actualTags = ALL_TAGS_LIST.filter(tag => category.menu_items[i].tags[tag]);
      content.push(
        { 
          id: category.menu_items[i].id,
          img: category.menu_items[i].img,
          title: category.menu_items[i].name,
          cost: category.menu_items[i].cost,
          description: category.menu_items[i].description,
          ingredients: category.menu_items[i].ingredients,
          order: category.menu_items[i].display_order,
          tags: tagList,
          actualTags: actualTags,
          visible: category.menu_items[i].visible
        }
      );
      content.sort( (a, b) => a.order < b.order ? -1 : 1 );
      setCategoryItems( content );
    }
  }, [category]);
 
  return ( categoryItems &&
    <ImageList sx={{ width: '100%', minHeight: '550px', px: 2, pb: 3 }} cols={4} rowHeight={250}>
      {categoryItems.map((item) => (
        <MenuItemCard 
          key={`item-${item.id}`} 
          item={item} 
          categoryName={category.name} 
          updateMenu={updateMenu}
        />
      ))}
    </ImageList>
  );
}