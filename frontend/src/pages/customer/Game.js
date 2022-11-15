import React, { useState } from "react";
import Header from '../../utilities/Header';
import Footer from '../../components/customer/Footer';
import Leaderboard from '../../components/customer/game/Leaderboard';
import GamePlay from '../../components/customer/game/GamePlay';

function Game() {

  const [play, setPlay] = useState(false);

  return (
    <>
      <Header
        image={localStorage.getItem('restaurantImage')}
        title={"Game"}
        heading={"Table " + localStorage.getItem('table')}
      />
      {play 
        ? <GamePlay start submit = { play => setPlay(play) } />
        : <Leaderboard submit = { play => setPlay(play) } />
      } 
      <Footer initialValue={"game"}/>
    </ >
  );
}

export default Game;