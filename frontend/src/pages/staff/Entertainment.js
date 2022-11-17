import * as React from 'react';
import { Button, Box, Card, CardContent, CardMedia, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Typography } from '@mui/material';
import header from '../../components/customer/game/header.jpg';
import Footer from '../../components/staff/Footer';
import Header from '../../utilities/Header';
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
  // eslint-disable-next-line
  }, [trigger]);

  return (<>
    <Header
      image={localStorage.getItem('restaurantImage')}
      title={"Admin-Manager"}
      heading="Manager"
    />
    <Box maxWidth="md" m="auto"
      sx={{ display: 'flex', flexDirection: 'column', gap: '2rem', pb: 15, pt: 5 }}
    >
      <Card>
        <CardMedia
          component="img"
          height="100"
          image={header}
        />
        <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Grab the Cookies!
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Instructions:
            Tap the cookies before they move.
            You get 10 points for each cookie.
            You lose a life if you miss a cookie.
            Score as many points as you can before time runs out, 
            or before you lose all your lives!
        </Typography>
        </CardContent>
      </Card>
      <Button  onClick={reset} variant="outlined">
        Reset Leaderboard
      </Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell size='small'>Rank</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((record, i) => (
              <TableRow
                key={i}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell >{record.position}</TableCell>
                <TableCell >{record.name}</TableCell>
                <TableCell >{record.email}</TableCell>
                <TableCell >{record.score}</TableCell>
                <TableCell >{record.time_played}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
    <Footer initialValue={"Game"}></Footer>
  </>);
}