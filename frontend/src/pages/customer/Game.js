import * as React from 'react';
import { Box } from '@mui/material';
import background from '../../components/customer/game/header.jpg';
import Footer from '../../components/customer/Footer';
import Leaderboard from '../../components/customer/game/Leaderboard';
import GamePlay from '../../components/customer/game/GamePlay';
import Header from '../../utilities/Header';

function Game() {

  const [play, setPlay] = React.useState(false);

  return (
    <>
      <Header
        image={localStorage.getItem('restaurantImage')}
        title={"Game"}
        heading={"Table " + localStorage.getItem('table')}
      />
      
      {play 
        ? <Box sx={{ pt: 1, height: '92.7vh', backgroundImage: `url(${background})`}}>
            <GamePlay start submit = { play => setPlay(play) } />
          </Box>
        : <Leaderboard submit = { play => setPlay(play) } />
      } 
      <Footer initialValue={"game"}/>
    </ >
  );
}

export default Game;