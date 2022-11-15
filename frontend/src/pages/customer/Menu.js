import * as React from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Tab, Tabs, Typography } from '@mui/material';

import Header from '../../components/customer/Header';
import Footer from '../../components/customer/Footer';
import MenuCategory from '../../components/customer/menu/MenuCategory';
import MenuSort from '../../components/customer/menu/MenuSort';
import MenuFilter from '../../components/customer/menu/MenuFilter';
import BudgetDialog from '../../components/customer/menu/BudgetDialog';
import useAlert from '../../utilities/useAlert';

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
  const [budget, setBudget] = React.useState(null); 
  const [remaining, setRemaining] = React.useState(null); 
  const [order, setOrder] = React.useState(0); 
  const [ordered, setOrdered] = React.useState(true); 
  const [open, setOpen] = React.useState(false);

  const { setAlert } = useAlert();

  const handleChange = (event, newValue, newLabel) => {
    setValue(newValue);
    setLabel(newLabel);
  };

  const handleClose = (budgetValue) => {
    if(budgetValue !== budget) {
      const updateBudget = async () => {
        const response = await fetch('http://localhost:5000/customer/budget', {
          method: 'PUT',
          mode: 'cors',
          headers: {
          'Content-type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(
            { 
              table: localStorage.getItem('table'),
              budget: budgetValue
            }
          )
        });
        const data = await response.json();
        if (response.ok) {
          setBudget(budgetValue);
        } else {
          setAlert(await data.error);
        }
      }
      updateBudget();
    }
    setOpen(false);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  React.useEffect(() => {
    // if (localStorage.getItem('assistance') === null)
    //   localStorage.setItem('assistance', false);
    const getMenu = async () => {
      // await new Promise(response => setTimeout(response, 1000));
      const response = await fetch(`http://localhost:5000/customer/menu`, {  
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('menu', JSON.stringify(data));
        setMenu( data );
        // console.log(data.categories);
      } else {
        setAlert(await data.error);
      }
    };

    getMenu();
  }, []);

  React.useEffect(() => {
    const getBudget = async () => {
      const response = await fetch(`http://localhost:5000/customer/budget?table=${localStorage.getItem('table')}`, {  
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setBudget( data.budget );
        setRemaining( data.remaining );
        setOrder( data.orderTotal );
      } else {
        setAlert(await data.error);
      }
    };

    getBudget();
  }, [budget, ordered]);

  const getContent = () => {
    let content = [];
    for (let i = 0; i < menu.categories.length; i++) {
      content.push({ 
        order: menu.categories[i].display_order,
        title: menu.categories[i].name,
        visible: menu.categories[i].visible,
      });
    }
    return content;
  }

  const getFilteredContent = () => {
    return getContent().filter(value => value.title !== 'Unassigned' && value.visible === true);
  }

  const getCategoriesTabs = () => {
    let renderedContent = [];
    let sortedContent = getFilteredContent().sort( (a, b) => a.order < b.order ? -1 : 1 );
    for (let i = 0; i < sortedContent.length; i++) {
        renderedContent.push(<Tab key={i} label={sortedContent[i].title} {...a11yProps(i)} />);
        // console.log('tab' + i);
    }
    return renderedContent;
  };

  const getCategoriesTabPanels = () => {
    let renderedContent = [];
    let content = getContent();
    let sortedContent = getFilteredContent().sort( (a, b) => a.order < b.order ? -1 : 1 );
    for (let i = 0; i < sortedContent.length; i++) {
      renderedContent.push(
        <TabPanel  key={i} value={value} index={i}>
          <MenuCategory 
            submit = {(ordered) => setOrdered(ordered)}
            category={menu.categories[content.findIndex(obj => 
              obj.order === sortedContent[i].order)]} 
            filters={filters} 
            sort={sort}
          />
        </TabPanel>
      );
    }
    return renderedContent;
  };

  return (
    <>
      <Header image={localStorage.getItem('restaurantImage')} title={"Menu"} />
      <Box
        sx={{ height: '100vh', bgcolor: 'background.paper', display: 'flex' }}
      >
        <Box sx={{ width: 150, borderRight: 1, borderColor: 'divider', pt: 5, position: 'fixed', height: '100vh', zIndex: 50 }}>
          <Tabs
            orientation="vertical"
            value={value}
            label={label}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ height: '75vh', mr: -0.2}}
          >
            {getCategoriesTabs()}
          </Tabs>
        </Box>
        <Box display='flex' alignItems='flex-end' flexDirection="column" spacing={1} sx={{ mt: '10px', mr: '25px', justifyContent: 'right' }}>
          <MenuFilter submit = { filters => { setFilters(filters) }} />
          <MenuSort submit = { sort => { setSort(sort) }} />
          {getCategoriesTabPanels()}
        </Box>
      </Box>
      <Button 
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 30,
          width:'160px',
          height: '60px',
          bgcolor: (theme) => theme.palette.primary.light
        }}
        variant='contained'
        onClick={handleClickOpen}
      >
        {budget === null || remaining === null
          ? <>Set budget</>
          : <>Remaining: ${remaining.toFixed(0)}</>
        }
      </Button>
      <BudgetDialog
        open={open}
        onClose={handleClose}
        budget={budget}
        remaining={remaining}
        order={order}
      />
      <Footer initialValue={"menu"}/>
    </ >
  );
}

export default Menu;
