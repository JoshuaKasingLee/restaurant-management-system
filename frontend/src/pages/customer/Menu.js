import * as React from 'react';
import PropTypes from 'prop-types';
import { Box, Tab, Tabs, Typography } from '@mui/material';

import Header from '../../components/customer/Header';
import Footer from '../../components/customer/Footer';
import MenuCategory from '../../components/customer/menu/MenuCategory';
import MenuSort from '../../components/customer/menu/MenuSort';
import MenuFilter from '../../components/customer/menu/MenuFilter';

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
          <Typography component="div">{children}</Typography>
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

function Menu() {
  const [value, setValue] = React.useState(0);
  const [label, setLabel] = React.useState("");
  const [menu, setMenu] = React.useState({'categories': []}); 
  const [sort, setSort] = React.useState({ value: 'none', label: 'None' });
  const [filters, setFilters] = React.useState([]);

  const handleChange = (event, newValue, newLabel) => {
    setValue(newValue);
    setLabel(newLabel);
  };

  React.useEffect(() => {
    const getMenu = async () => {
      await new Promise(response => setTimeout(response, 1000));
      const response = await fetch(`http://localhost:5000/customer/menu`, {  
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
        setMenu( data );
      } else {
        alert(await data.error);
      }
    };
    getMenu();
  }, []);

  const getCategoriesTabs = () => {
    let content = [];
    for (let i = 0; i < menu.categories.length; i++) {
      content.push(<Tab key={i} label={menu.categories[i].name} {...a11yProps(i)} />);
    }
    return content;
  };

  const getCategoriesTabPanels = () => {
    let content = [];
    for (let i = 0; i < menu.categories.length; i++) {
      content.push(
        <TabPanel  key={i} value={value} index={i}>
          <Typography variant="h3" >{menu.categories[value].name}</Typography>
          <MenuCategory category={menu.categories[value]} filters={filters} sort={sort}/>
        </TabPanel>
      );
    }
    return content;
  };

  return (
    <>
      <Header title={"Menu"} />
      <Box display='flex' alignItems='flex-end' flexDirection="column" position='fixed' right='0' spacing={1} sx={{ mt: '10px', mr: '25px' }}>
        <MenuFilter submit = { filters => { setFilters(filters) }} />
        <MenuSort submit = { sort => { setSort(sort) }} />
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
          {getCategoriesTabs()}
        </Tabs>
        {getCategoriesTabPanels()}
      </Box>
      <Footer initialValue={"menu"}/>
    </ >
  );
}

export default Menu;
