import * as React from 'react';
import PropTypes from 'prop-types';
import { Box, Card, Tab, Tabs, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import MenuItemList from '../../components/staff/editor/MenuItemList';
import AddNewButton from '../../components/staff/editor/AddNewButton';
import EditCategoryDialog from '../../components/staff/editor/EditCategoryDialog';
import ReorderButton from '../../components/staff/editor/ReorderButton';
import Footer from '../../components/staff/Footer';
import Loading from '../../components/Loading';
import Header from '../../utilities/Header';
import useAlert from '../../utilities/useAlert';
import truncateString from '../../utilities/helpers';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
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
    id: `vertical-tab-${index}`
  };
}

function MenuEditor() {
  const [value, setValue] = React.useState(0);
  const [label, setLabel] = React.useState("");
  const [menu, setMenu] = React.useState({'categories': localStorage.getItem('menu') !== null 
    ? JSON.parse(localStorage.getItem('menu')) : []});
  const [trigger, setTrigger] = React.useState(false);
  
  const { setAlert } = useAlert();
  const [reorderTrigger, setReorderTrigger] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const getMenu = async () => {
      const response = await fetch(`http://localhost:5000/manager/menu`, {  
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setMenu( data );
        localStorage.setItem('menu', JSON.stringify(data));
        setIsLoading(false);
      } else {
        setAlert(await data.error);
      }
    };
    getMenu();
    setTrigger(false);
    setReorderTrigger(false);
  // eslint-disable-next-line
  }, [trigger, reorderTrigger]);

  async function editCategory(id, name, visible) {
    const response = await fetch(`http://localhost:5000/manager/categories/${id}`, {  
        method: 'PUT',
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
            name: name,
            show: visible
        })
    });
    const data = await response.json();
    if (response.ok) {
      setTrigger(true);
    } else {
      setAlert(await data.error);
    }
  }

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

  const handleToggleVisibility = (e, category, currVisible) => {
    let newVisible = currVisible ? false : true;
    editCategory(category.id, category.title, newVisible);
    e.stopPropagation();
  };

  const getCategoriesTabs = () => {
    let renderedContent = [];
    let sortedContent = getContent().sort( (a, b) => a.order < b.order ? -1 : 1 );
    for (let i = 0; i < sortedContent.length; i++) {
      if(sortedContent[i].title === 'Unassigned') {
        renderedContent.push(<Tab
          key={i}
          label={sortedContent[i].title}
          {...a11yProps(i)} />);
      } else {
        renderedContent.push(<Tab
          key={i}
          label={truncateString(sortedContent[i].title)}
          iconPosition="start"
          icon={ sortedContent[i].visible
              ? <VisibilityIcon fontSize='small' onClick={(e) => handleToggleVisibility(e, sortedContent[i], true)}/>
              : <VisibilityOffIcon fontSize='small' onClick={(e) => handleToggleVisibility(e, sortedContent[i], false)}/>
          }
          sx={{ minHeight: '48px'}}
          {...a11yProps(i)} />);
      }
    }
    return renderedContent;
  };

  const getCategoriesTabPanels = () => {
    let renderedContent = [];
    let content = getContent();
    let sortedContent = getContent().sort( (a, b) => a.order < b.order ? -1 : 1 );
    for (let i = 0; i < sortedContent.length; i++) {
      renderedContent.push(
        <TabPanel key={i} value={value} index={i} sx={{ minHeight: '750px' }}>
          <div style={{ display: 'inline-flex' }}>
            { sortedContent[i].title !== "Unassigned" &&
              <IconButton onClick={() => {handleOpenEditCategory()}} sx={{ mr: 2 }}>
                <EditIcon/>
              </IconButton>
            }
            <Typography variant="h3" >{sortedContent[i].title}</Typography>
          </div>
          <MenuItemList 
            category={menu.categories[content.findIndex(obj => 
              obj.order === sortedContent[i].order)]}
            updateMenu={setTrigger}
          />
          <EditCategoryDialog
            open={openEditCategory}
            category={content[content.findIndex(obj => 
              obj.order === sortedContent[i].order)]} 
            handleClose={handleCloseEditCategory}
            updateMenu={setTrigger}
          />
        </TabPanel>
      );
    }
    return renderedContent;
  };

  const [openEditCategory, setOpenEditCategory] = React.useState(false);

  const  handleOpenEditCategory = () => {
    setOpenEditCategory(true);
  }

  const handleCloseEditCategory = () => {
    setOpenEditCategory(false);
  };

  const handleChange = (e, value, label) => {
    setValue(value);
    setLabel(label);
  }

  const renderedContent = (<>
    <Box sx={{ width: 150, borderRight: 1, borderColor: 'divider', position: 'fixed' }}>
      <Tabs
        orientation="vertical"
        value={value}
        label={label}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ height: '675px', mr: -0.2}}
      >
        {getCategoriesTabs()}
      </Tabs>
    </Box>
    <Box 
      display='flex'
      sx={{ flexGrow: 1, m: 'auto', pl: 22 }}
    >
      {getCategoriesTabPanels()}
    </Box>
  </>)

  return (
    <>
      <Header
        image={localStorage.getItem('restaurantImage')}
        title={"Admin-Manager"}
        heading="Manager"
      />
      { menu.categories.length > 0 && 
        <>
          <Box
            sx={{
              mx: 'auto',
              mt: 2,
              width: '1300px',
              display: 'flex',
              justifyContent: 'end',
              zIndex: 50,
              py: 3,
              px: 2,
            }}
            gap={2}>
            <ReorderButton categories={menu.categories}
              items={menu.categories.filter(c => c.display_order === getSortedContent()[value].order)[0].menu_items}
              updateMenu={setReorderTrigger}/>
            <AddNewButton updateMenu={setTrigger}/>
          </Box>
      </>}
      <Card
        sx={{
          m: 'auto',
          width: '1300px',
          height: '750px',
          py: 4,
          display: 'flex',
          alignItems: 'center',
          overflowY: 'auto'
        }}
      >
      { isLoading
        ? <Loading/>
        : renderedContent
      }
      </Card>      
      <Footer initialValue={"Editor"}></Footer>
    </ >
  );
}

export default MenuEditor;