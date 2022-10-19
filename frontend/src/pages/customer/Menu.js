import * as React from 'react';
import PropTypes from 'prop-types';
import TagFacesIcon from '@mui/icons-material/TagFaces';
import { Box, Chip, Stack, Tab, Tabs, Typography } from '@mui/material';

import Header from '../../components/customer/Header';
import Footer from '../../components/customer/Footer';
import MenuCategory from '../../components/customer/MenuCategory';
import ProductSort from '../../components/customer/menu/ProductSort';

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
        setMenu( menu => (data) );
      } else {
        alert(await data.error);
      }
    };
    getMenu();
  }, []);

  const getCategoriesTabs = menu => {
    let content = [];
    for (let i = 0; i < menu.categories.length; i++) {
      content.push(<Tab key={i} label={menu.categories[i].name} {...a11yProps(i)} />);
    }
    return content;
  };

  const getCategoriesTabPanels = (menu, filters) => {
    let content = [];
    for (let i = 0; i < menu.categories.length; i++) {
      content.push(
        <TabPanel  key={i} value={value} index={i}>
          <Typography variant="h3" >{menu.categories[value].name}</Typography>
          <MenuCategory category={menu.categories[value]} filters={filters}/>
        </TabPanel>
      );
    }
    return content;
  };

  const [chipData, setChipData] = React.useState([
    { key: 0, label: "Chef's Recommendation", icon: TagFacesIcon, selected: 'outlined default' },
    { key: 1, label: 'Vegetarian', icon: TagFacesIcon, selected: 'outlined default' },
    { key: 2, label: 'Vegan', icon: TagFacesIcon, selected: 'outlined default' },
    { key: 3, label: 'Gluten Free', icon: TagFacesIcon, selected: 'outlined default' },
    { key: 4, label: 'Nut Free', icon: TagFacesIcon, selected: 'outlined default' },
    { key: 5, label: 'Dairy Free', icon: TagFacesIcon, selected: 'outlined default' },
  ]);
  const [filters, setFilters] = React.useState([]);

  const handleClick = (data) => () => {
    let newChipData = [...chipData];
    let newSelected = ((data.selected === 'filled primary') ? 'outlined default' : 'filled primary');
    newChipData[data.key] = { key: data.key, label: data.label, icon: data.icon, selected: newSelected };
    setChipData(newChipData);
    if (newSelected === 'filled primary') setFilters( state => ([...state, data.label].sort()) );
    else setFilters( filters => filters.filter(state => state !== data.label) );
  };

  return (
    <>
      <Header title={"Menu"} />
      <Box display='flex' alignItems='flex-end' flexDirection="column" position='fixed' right='0' spacing={1} sx={{ mt: '10px', mr: '25px' }}>
        <Stack direction="row" spacing={1}>
          {chipData.map((data) => (
              <Stack key={data.key}>
                <Chip 
                  variant={data.selected.split(' ')[0]} 
                  color={data.selected.split(' ')[1]} 
                  size="small"
                  icon={<data.icon/>}
                  label={data.label}
                  onClick={handleClick(data)}
                />
              </Stack>
          ))}
        </Stack>
        <ProductSort />
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
        {getCategoriesTabPanels(menu, filters)}
      </Box>
      <Footer initialValue={"menu"}/>
    </ >
  );
}

export default Menu;
