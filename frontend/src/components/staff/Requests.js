import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import Request from './Request'


export default function Requests() {

  const [requests, setRequests] = React.useState([]);

  React.useEffect(() => {  
    const getRequests = async () => {
      const response = await fetch(`http://localhost:5000/waiter/assist`, {  
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });
      const data = await response.json();
      if (response.ok) {
        setRequests(data.tables);
      } else {
        alert(await data.error);
      }
    }

    const intervalID = setInterval(getRequests, 1000)

    return (() => {
      clearInterval(intervalID)
    })

  }, []); 

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <ListItem>
        <Typography sx={{minWidth: '56px'}}>Table</Typography>
      </ListItem>
      {requests.map((r) => {
        return (
          <Request table={r.table} />
        );
      })}
    </List>
  );
}