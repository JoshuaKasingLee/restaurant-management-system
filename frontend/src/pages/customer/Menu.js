import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Header from '../../components/customer/Header';
import Footer from '../../components/customer/Footer';
import MenuCategory from '../../components/customer/MenuCategory';
import Chip from '@mui/material/Chip';
import TagFacesIcon from '@mui/icons-material/TagFaces';

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

  const getCategoriesTabPanels = menu => {
    let content = [];
    for (let i = 0; i < menu.categories.length; i++) {
      content.push(
        <TabPanel  key={i} value={value} index={i}>
          <Typography variant="h3" >{menu.categories[value].name}</Typography>
          <MenuCategory category={menu.categories[value]}/>
        </TabPanel>
      );
    }
    return content;
  };

  const [chipData, setChipData] = React.useState([
    { key: 0, label: 'Vegetarian', icon: TagFacesIcon, selected: 'outlined default' },
    { key: 1, label: 'Vegan', icon: TagFacesIcon, selected: 'outlined default' },
    { key: 2, label: 'Gluten Free', icon: TagFacesIcon, selected: 'outlined default' },
    { key: 3, label: 'Nut Free', icon: TagFacesIcon, selected: 'outlined default' },
    { key: 4, label: 'Dairy Free', icon: TagFacesIcon, selected: 'outlined default' },
    { key: 5, label: "Chef's Recommendation", icon: TagFacesIcon, selected: 'outlined default' },
  ]);

  const handleClick = (data) => () => {
    console.log(chipData);
    let newChipData = [...chipData];
    let newSelected = ((data.selected === 'filled info') ? 'outlined default' : 'filled info');
    newChipData[data.key] = { key: data.key, label: data.label, icon: data.icon, selected: newSelected };
    setChipData(newChipData);
    // setChipData( chipData => ({ 
    //   ...chipData, 
    //   [data.key]: { key: data.key, label: data.label, icon: data.icon, selected: ((data.selected === 'filled') ? 'outlined' : 'filled') }
    // }));
    console.log(chipData);
    console.log(data.key);
  };

  return (
    <>
      <Header title={"Menu"} />
      <Stack position='fixed' right='0' direction="row" spacing={1} sx={{ mr: '25px' }}>
        {chipData.map((data, index) => (
            <Stack key={data.key}>
              <Chip 
                variant={data.selected.split(' ')[0]} 
                color={data.selected.split(' ')[1]} 
                label="Small" 
                size="small"
                icon={<data.icon/>}
                label={data.label}
                onClick={handleClick(data)}
              />
            </Stack>
        ))}
      </Stack>
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
      <Footer initialValue={"menu"}/>
    </ >
  );
}

export default Menu;
