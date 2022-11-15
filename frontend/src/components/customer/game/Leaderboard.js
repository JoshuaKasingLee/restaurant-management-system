import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Grid, IconButton, Paper, Typography } from '@mui/material';
import PlayCircleRoundedIcon from '@mui/icons-material/PlayCircleRounded';
import LeaderboardTable from './LeaderboardTable';
import useAlert from '../../../utilities/useAlert';

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

  return (
    <Box sx={{ ml: 4, mr: 1, mt: 4, flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid container direction="column" item xs={6} md={3.8} sx={{ height: '75vh', mx:1 }}>
          <Grid item xs={4} sx={{ height: '42vh', p: 1, mt: -2, ml: -2, borderRadius: 2, boxShadow: 3 }}>
            <Item>
              <Typography variant='h2'>
                Play
              </Typography>
              <Box sx={{ height: '30vh' }} display='flex' justifyContent='center' alignItems='center'>
                <IconButton onClick={start}>
                  <PlayCircleRoundedIcon sx={{width: 150, height:150 }} />
                </IconButton>
              </Box>
            </Item>
          </Grid>
          <br />
          <Grid item xs={4} sx={{ height: '40vh', p: 2, ml: -2, borderRadius: 2, boxShadow: 3 }}>
            <Item>
              <Typography variant='h2'>
                Instructions
              </Typography>
              <Typography variant='h6'>
                Tap the cookie before they move.
              </Typography>
              <Typography variant='h6'>
                You get 10 points for each cookie.
              </Typography>
              <Typography variant='h6'>
                You lose a life if you miss a cookie.
              </Typography>
              <Typography variant='h6'>
                Score as many points as possible before you lose all your lives!
              </Typography>
            </Item>
          </Grid>
        </Grid>
        <Grid item xs={6} md={7.8} sx={{  height: '74vh', mx: 1, borderRadius: 2, boxShadow: 3 }}>
          <Item>
            <Typography variant='h2'>
              Leaderboard
            </Typography>
            <br/>
            <LeaderboardTable leaderboard={leaderboard} />
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Leaderboard;