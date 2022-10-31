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

  const getCategoriesTabs = menu => {
    let content = [];
    for (let i = 0; i < menu.categories.length; i++) {
      if (menu.categories[i].name == "Unassigned") {
        content.push(<Tab
          key={i}
          label={menu.categories[i].name}
          {...a11yProps(i)}/>
        );
      } else {
        content.push(<Tab
          key={i}
          label={menu.categories[i].name}
          icon={<EditIcon fontSize="small" onClick={() => handleOpenEditCategory(i)}/>}
          iconPosition="end"
          {...a11yProps(i)}/>
        );
      }
    }
    return content;
  };

  const [openEditCategory, setOpenEditCategory] = React.useState(false);
  const [category, setCategory] = React.useState(null);

  const handleOpenEditCategory = (key) => {
    console.log(key)
    setCategory(menu.categories[key]);
    setOpenEditCategory(true);
  }

  const handleCloseEditCategory = () => {
    setOpenEditCategory(false);
  };

  const handleChange = (e, value, label) => {
    setValue(value);
    setLabel(label);
  }

  const getCategoriesTabPanels = menu => {
    let content = [];
    for (let i = 0; i < menu.categories.length; i++) {
      content.push(
        <TabPanel  key={i} value={value} index={i}>
          <Typography component='span' variant="h3" >{menu.categories[value].name}</Typography>
          <MenuItemList category={menu.categories[value]} updateMenu={setTrigger}/>
        </TabPanel>
      );
    }
    return content;
  };

  

  return (
    <>
      <Box
        sx={{
          height: 70,
          position: 'fixed',
          right: '40px',
        }}>
        <AddNewButton updateMenu={setTrigger}/>
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