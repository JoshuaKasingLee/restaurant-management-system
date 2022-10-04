import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Header from '../../components/customer/Header';
import Footer from '../../components/customer/Footer';

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
          <Typography>{children}</Typography>
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

  return (
    <>
      <Header title={"Category " + value } />
      <Box
        sx={{ bgcolor: 'background.paper', display: 'flex' }}
      >
        <Tabs
          orientation="vertical"
          value={value}
          label={label}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          sx={{ width: 180, borderRight: 1, borderColor: 'divider' }}
        >
          <Tab label="Category 0" {...a11yProps(0)} />
          <Tab label="Category 1" {...a11yProps(1)} />
          <Tab label="Category 2" {...a11yProps(2)} />
          <Tab label="Category 3" {...a11yProps(3)} />
          <Tab label="Category 4" {...a11yProps(4)} />
          <Tab label="Category 5" {...a11yProps(5)} />
          <Tab label="Category 6" {...a11yProps(6)} />
        </Tabs>
        <TabPanel value={value} index={0}>
          Item 0
        </TabPanel>
        <TabPanel value={value} index={1}>
          Item 1
        </TabPanel>
        <TabPanel value={value} index={2}>
          Item 2
        </TabPanel>
        <TabPanel value={value} index={3}>
          Item 3
        </TabPanel>
        <TabPanel value={value} index={4}>
          Item 4
        </TabPanel>
        <TabPanel value={value} index={5}>
          Item 5
        </TabPanel>
        <TabPanel value={value} index={6}>
          Item 6
        </TabPanel>
      </Box>
      <Footer initialValue={"menu"}/>
    </ >
  );
}

export default Menu;
