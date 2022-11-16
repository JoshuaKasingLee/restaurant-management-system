import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Grid, IconButton, Paper, Typography } from '@mui/material';
import PlayCircleRoundedIcon from '@mui/icons-material/PlayCircleRounded';
import LeaderboardTable from './LeaderboardTable';
import { Card, CardMedia, CardContent } from '@mui/material';
import Button from '@mui/material/Button';
import useAlert from '../../../utilities/useAlert';
import header from './header.jpg';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.primary,
}));

function Leaderboard({submit}) {
  const [leaderboard, setLeaderboard] = React.useState([]);
  const { setAlert } = useAlert();

  React.useEffect(() => {
    const getLeaderboard = async () => {
      const response = await fetch(`http://localhost:5000/customer/leaderboard`, {  
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setLeaderboard( data.players );
      } else {
        setAlert(await data.error);
      }
    };

    getLeaderboard();
  }, []);

  const start = () => {
    submit(true);
  };

  return (<>
    <Box
      maxWidth="md"
      mx="auto" 
      sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', pt: 5 }}
    >
      <Card>
        <CardMedia
        component="img"
        height="100"
        image={header}
        />
        <CardContent>
        <Typography gutterBottom variant="body2" color="text.secondary">
          Waiting for your dishes to arrive? Play a game for your chance to win...
        </Typography>
        <Typography gutterBottom variant="h5" component="div">
          Grab the Cookies!
        </Typography>
        <Typography variant="body2" color="text.secondary" mb='1rem'>
          Instructions:
            Tap the cookies before they move.
            You get 10 points for each cookie.
            You lose a life if you miss a cookie.
            Score as many points as possible before time runs out, 
            or before you lose all your lives!
        </Typography>
        <Button variant="contained" fullWidth onClick={start} sx={{ mb: 2 }}>
          START GAME
        </Button>
        <LeaderboardTable leaderboard={leaderboard}/>
        </CardContent>
      </Card>
    </Box>
  </>);
}

export default Leaderboard;