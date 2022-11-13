import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import useAlert from '../../utilities/useAlert';

export default function Entertainment() {
  const [records, setRecords] = React.useState([]);
  const [trigger, setTrigger] = React.useState(false);
  const { setAlert } = useAlert();

  const reset = async () => {
    const response = await fetch(`http://localhost:5000/manager/entertainment/leaderboard/reset `, {  
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    const data = await response.json();
    if (response.ok) {
      setTrigger(true);
    } else {
      setAlert(await data.error);
    }
}

  React.useEffect(() => {
    const getLeaderboardRecords = async () => {
      const response = await fetch(`http://localhost:5000/manager/entertainment`, {  
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setRecords(data.players);
      } else {
        setAlert(await data.error);
      }
    };
    getLeaderboardRecords();
    setTrigger(false);
  }, [trigger]);

  return (<>
    <Card>
      <CardMedia
      component="img"
      height="100"
      image="https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2071&q=80"
      />
      <CardContent>
      <Typography gutterBottom variant="h5" component="div">
        Game
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Thanks Jan for doing this.
      </Typography>
      </CardContent>
    </Card>

    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell>Rank</TableCell>
            <TableCell align="right">Name</TableCell>
            <TableCell align="right">Email</TableCell>
            <TableCell align="right">Score</TableCell>
            <TableCell align="right">Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records.map((record, i) => (
            <TableRow
              key={i}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {record.position}
              </TableCell>
              <TableCell align="right">{record.name}</TableCell>
              <TableCell align="right">{record.email}</TableCell>
              <TableCell align="right">{record.score}</TableCell>
              <TableCell align="right">{record.time_played}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    <Button sx={{ mt: "20px" }} onClick={reset} variant="contained">
      Reset
    </Button>
  </>);
}