import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import Request from './Request';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Card } from '@mui/material';
import Popup from '../../../utilities/Popup';
import useAlert from '../../../utilities/useAlert';


export default function Requests() {

  const [requests, setRequests] = React.useState([]);

  const { setAlert } = useAlert();

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
        setAlert(await data.error);
      }
    }

    const intervalID = setInterval(getRequests, 1000)

    return (() => {
      clearInterval(intervalID)
    })

  }, []); 

  return (
    <Card sx={{ px: 5, pr: 0, pt: 3, display: 'flex', flexDirection: 'column', flex: 1 }}>
      <Typography variant="h3">Assistance</Typography>
      <TableContainer component={Paper}>
      <Table sx={{ minWidth: 200 }}>
        <TableHead>
          <TableRow>
            <TableCell>Table</TableCell>
            <TableCell ></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {requests.map((request, i) => (
            <Request
              key={i}
              table={request.table}/>
          ))}
        </TableBody>
      </Table>
      </TableContainer>
    </Card>
  );
}