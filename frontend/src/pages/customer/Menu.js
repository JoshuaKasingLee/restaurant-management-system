import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Header from '../../components/customer/Header';
import Footer from '../../components/customer/Footer';
import MenuCategory from '../../components/customer/MenuCategory';

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
  const [label, setLabel] = React.useState("Category One");

  const handleChange = (event, newValue, newLabel) => {
    setValue(newValue);
    setLabel(newLabel);
  };

  const [menu, setMenu] = React.useState('');

  React.useEffect(() => {
    const getMenu = async () => {
      const response = await fetch(`http://localhost:5000/customer/menu`, {  
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          //Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setMenu(data);
        localStorage.setItem("menu",data);
      } else {
        alert(await data.error);
      }
    };
    getMenu();
  }, []);

  const getCategories = menu => {
    let content = [];
    for (let i = 1; i <= menu.categories.length; i++) {
      content.push(<Tab label={menu.categories[i]} {...a11yProps(i)} />);
    }
    return content;
  };

  return (
    <>
      <Header title={"Menu"} />
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
          {getCategories}
          <Tab label="Category 0" {...a11yProps(0)} />
          <Tab label="Category 1" {...a11yProps(1)} />
          <Tab label="Category 2" {...a11yProps(2)} />
          <Tab label="Category 3" {...a11yProps(3)} />
          <Tab label="Category 4" {...a11yProps(4)} />
          <Tab label="Category 5" {...a11yProps(5)} />
          <Tab label="Category 6" {...a11yProps(6)} />
        </Tabs>
        <TabPanel value={value} index={0}>
          <Typography variant="h3" >Category 0</Typography>
          <MenuCategory />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Typography variant="h3" >Category 1</Typography>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Typography variant="h3" >Category 2</Typography>
        </TabPanel>
        <TabPanel value={value} index={3}>
          <Typography variant="h3" >Category 3</Typography>
        </TabPanel>
        <TabPanel value={value} index={4}>
          <Typography variant="h3" >Category 4</Typography>
        </TabPanel>
        <TabPanel value={value} index={5}>
          <Typography variant="h3" >Category 5</Typography>
        </TabPanel>
        <TabPanel value={value} index={6}>
          <Typography variant="h3" >Category 6</Typography>
        </TabPanel>
      </Box>
      <Footer initialValue={"menu"}/>
    </ >
  );
}

export default Menu;
