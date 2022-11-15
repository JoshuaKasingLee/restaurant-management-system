import * as React from 'react';
import Button from '@mui/material/Button';
// import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
// import ReorderIcon from '@mui/icons-material/Reorder';
import { List, ListItem } from '@mui/material';
import { DragDropContext } from 'react-beautiful-dnd';
import { Droppable } from 'react-beautiful-dnd';
import { Draggable } from 'react-beautiful-dnd';
import useAlert from '../../../utilities/useAlert';

export default function ReorderItemDialog({open, itemsProps, handleClose, updateMenu}) {

  const [items, setItems] = React.useState(itemsProps);

  const { setAlert } = useAlert();

  async function reorderItems() {
    const response = await fetch(`http://localhost:5000/manager/items`, {  
        method: 'PUT',
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          items: convertItems()
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

  const convertItems = () => {
    var result = [];
    items.map((c, i) => {
      result.push({
        id: c.id, 
        positionId: i
      })
    });
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

    const newItems = Array.from(items);
    const draggableItem = items[source.index];
    newItems.splice(source.index, 1);
    newItems.splice(destination.index, 0, draggableItem);
    console.log(newItems);

    setItems(newItems);
  }

  React.useEffect(() => {
    let content = [];
    for (let i=0; i < itemsProps.length; i++) {
      if (itemsProps.length === 0) continue;
      content.push({ 
        id: itemsProps[i].id,
        positionId: itemsProps[i].display_order,
        name: itemsProps[i].name
      });
    }
    content.sort( (a, b) => a.positionId < b.positionId ? -1 : 1 );
    setItems( items => content );
  }, [itemsProps]);

  return(<>
    <Dialog
      open={open}
      onClose={handleClose}
    >
      <DialogTitle>
        Reorder Items In Selected Category
      </DialogTitle>
      <DialogContent style={{overflow: "unset"}}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="reorder-items-droppable">
            {(provided) => (
              <List
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {items.map((item, index) => (
                  <Draggable 
                    draggableId={`draggable-${item.id}`} 
                    index={index} 
                    key={`key-${item.id}`}
                  >
                  {(provided) => (
                    <ListItem
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                      divider
                    >
                      {item.name}
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
        <Button onClick={reorderItems}>Save</Button>
      </DialogActions>
    </Dialog>
  </>)
}