import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MenuCategoryEditor from './MenuCategoryEditor';
import AddNewButton from './AddNewButton';

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

function MenuEditor() {
  const [value, setValue] = React.useState(0);
  const [label, setLabel] = React.useState("");
  const [menu, setMenu] = React.useState({'categories': []});
  const [trigger, setTrigger] = React.useState(false);

  const handleChange = (event, newValue, newLabel) => {
    setValue(newValue);
    setLabel(newLabel);
  };

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
          <MenuCategoryEditor category={menu.categories[value]} updateMenu={setTrigger}/>
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
        <AddNewButton />
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
    </ >
  );
}

export default MenuEditor;
