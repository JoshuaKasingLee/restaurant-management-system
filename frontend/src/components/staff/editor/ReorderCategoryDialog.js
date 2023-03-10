import * as React from 'react';
import { Draggable, DragDropContext, Droppable } from 'react-beautiful-dnd';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, List, 
  ListItem } from '@mui/material';
import useAlert from '../../../utilities/useAlert';

export default function ReorderCategoryDialog({open, categoriesProps, handleClose, updateMenu}) {

  const [categories, setCategories] = React.useState(categoriesProps);
  const [unassigned, setUnassigned] = React.useState(null);

  const { setAlert } = useAlert();

  async function reorderCategories() {
    const response = await fetch(`http://localhost:5000/manager/categories`, {  
        method: 'PUT',
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          categories: convertCategories()
      })
    });
    const data = await response.json();
    if (response.ok) {
      updateMenu(true);
      handleClose();
    } else {
      setAlert(await data.error);
    }
  }

  const convertCategories = () => {
    var result = [];
    // eslint-disable-next-line
    categories.map((c, i) => {
      result.push({
        id: c.id, 
        positionId: i + 1
      })
    });
    result.push(unassigned);
    return result;
  }

  const onDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newCategories = Array.from(categories);
    const draggableCategory = categories[source.index];
    newCategories.splice(source.index, 1);
    newCategories.splice(destination.index, 0, draggableCategory);
    setCategories(newCategories);
  }

  React.useEffect(() => {
    let content = [];
    for (let i=0; i < categoriesProps.length; i++) {
      if (categoriesProps.length === 0) continue;
      if (categoriesProps[i].name === "Unassigned") {
        setUnassigned({
          id: categoriesProps[i].id,
          positionId: categoriesProps[i].display_order,
          name: categoriesProps[i].name
        });
      } else {
        content.push({ 
          id: categoriesProps[i].id,
          positionId: categoriesProps[i].display_order,
          name: categoriesProps[i].name
        });
      }
    }
    content.sort( (a, b) => a.positionId < b.positionId ? -1 : 1 );
    setCategories( categories => content );
  }, [categoriesProps]);

  return(<>
    <Dialog
      open={open}
      onClose={handleClose}
    >
      <DialogTitle>
        Reorder Categories
      </DialogTitle>
      <DialogContent style={{overflow: "unset"}}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="reorder-categories-droppable">
            {(provided) => (
              <List
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {categories.map((category, index) => (
                  <Draggable 
                    draggableId={`draggable-${category.id}`} 
                    index={index} 
                    key={`key-${category.id}`}
                  >
                  {(provided) => (
                    <ListItem
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                      divider
                    >
                      {category.name}
                    </ListItem>
                  )}
                </Draggable>
                ))}
                {provided.placeholder}
              </List>
            )}
          </Droppable>
        </DragDropContext>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={reorderCategories}>Save</Button>
      </DialogActions>
    </Dialog>
  </>)
}