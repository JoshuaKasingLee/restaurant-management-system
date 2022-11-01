import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MenuItemList from './MenuItemList';
import AddNewButton from './AddNewButton';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import EditCategoryDialog from './EditCategoryDialog';
import ReorderButton from './ReorderButton';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component="span">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

function MenuEditor() {
  const [value, setValue] = React.useState(0);
  const [label, setLabel] = React.useState("");
  const [menu, setMenu] = React.useState({'categories': []});
  const [trigger, setTrigger] = React.useState(false);

  React.useEffect(() => {
    const getMenu = async () => {
      await new Promise(response => setTimeout(response, 1000));
      const response = await fetch(`http://localhost:5000/manager/menu`, {  
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        // console.log(data);
        localStorage.setItem('menu', JSON.stringify(data));
        setMenu( menu => (data) );
      } else {
        alert(await data.error);
      }
    };
    getMenu();
    setTrigger(false);
  }, [trigger]);

  const getContent = () => {
    let content = [];
    for (let i = 0; i < menu.categories.length; i++) {
      content.push({ 
        order: menu.categories[i].display_order,
        title: menu.categories[i].name,
        id: menu.categories[i].id,
        visible: menu.categories[i].visible
      });
    }
    return content;
  }

  const getSortedContent = () => {
    return getContent().sort( (a, b) => a.order < b.order ? -1 : 1 );
  }

  const getCategoriesTabs = () => {
    let renderedContent = [];
    let sortedContent = getContent().sort( (a, b) => a.order < b.order ? -1 : 1 );
    for (let i = 0; i < sortedContent.length; i++) {
      if(sortedContent[i].title == 'Unassigned') {
        renderedContent.push(<Tab
          key={i}
          label={sortedContent[i].title}
          {...a11yProps(i)} />);
      } else {
        renderedContent.push(<Tab
          key={i}
          label={sortedContent[i].title}
          icon={<EditIcon fontSize="small" onClick={() => {handleOpenEditCategory(i);}}/>}
          iconPosition="end"
          {...a11yProps(i)} />);
      }
    }
    return renderedContent;
  };

  React.useEffect(() => {console.log("check value", value)}, [value])

  const getCategoriesTabPanels = () => {
    let renderedContent = [];
    let content = getContent();
    let sortedContent = getContent().sort( (a, b) => a.order < b.order ? -1 : 1 );
    for (let i = 0; i < sortedContent.length; i++) {
      renderedContent.push(
        <TabPanel  key={i} value={value} index={i}>
          <Typography variant="h3" >{sortedContent[value].title}</Typography>
          <MenuItemList 
            category={menu.categories[content.findIndex(obj => 
              obj.order === sortedContent[value].order)]} 
              updateMenu={setTrigger}
          />
        </TabPanel>
      );
    }
    return renderedContent;
  };

  const [openEditCategory, setOpenEditCategory] = React.useState(false);
  const [category, setCategory] = React.useState(null);

  const  handleOpenEditCategory = (i) => {
    // console.log("infunc");
    // console.log(i);
    // console.log(getSortedContent());
    setCategory(getSortedContent()[i]);
    // console.log(category);
    // console.log("outfunc");
    setOpenEditCategory(true);
  }

  const handleCloseEditCategory = () => {
    setOpenEditCategory(false);
  };

  const handleChange = (e, value, label) => {
    setValue(value);
    setLabel(label);
  }

  return (
    <>
      <Box
        sx={{
          height: 70,
          position: 'fixed',
          right: '40px',
        }}>
        { menu.categories.length > 0 && <>
          <ReorderButton categories={menu.categories}
          items={menu.categories.filter(c => c.display_order === getSortedContent()[value].order)[0].menu_items}
          updateMenu={setTrigger}/>
          <AddNewButton updateMenu={setTrigger}/>
        </>}
      </Box>
      <Box
        sx={{ height: '80vh', bgcolor: 'background.paper', display: 'flex' }}
      >
        <Tabs
          orientation="vertical"
          value={value}
          label={label}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          sx={{ width: 180, borderRight: 1, borderColor: 'divider' }}
        >
          {getCategoriesTabs(menu)}
        </Tabs>
        {getCategoriesTabPanels(menu)}
      </Box>
      { category &&
        <EditCategoryDialog
        open={openEditCategory}
        category={category}
        handleClose={handleCloseEditCategory}
        updateMenu={setTrigger}/>
      }
    </ >
  );
}

export default MenuEditor;