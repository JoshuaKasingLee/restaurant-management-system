// https://javascript.plainenglish.io/create-a-click-shape-game-with-react-and-javascript-c4fa18698081
import React, { useState, useEffect, useRef } from "react";
import { Box, IconButton, Typography } from '@mui/material';
import PauseCircleFilledRoundedIcon from '@mui/icons-material/PauseCircleFilledRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import cookie from './cookie.png';
import PauseDialog from './PauseDialog'
import EndDialog from './EndDialog'

const gameTop = 275;
const gameHeight = 476;
const gameLeft = 25;
const gameWidth = 1130;
const circleSize = 100;

function GamePlay({submit}) {
  const boxRef = useRef();
  const [score, setScore] = useState(0); 
  const [circleX, setCircleX] = useState();
  const [circleY, setCircleY] = useState();
  const [timer, setTimer] = useState();
  const [paused, setPaused] = useState(false);
  const [openPause, setOpenPause] = React.useState(false);
  const [openEnd, setOpenEnd] = React.useState(false);
  const [lives, setLives] = React.useState(3);
  const [counter, setCounter] = React.useState(60);

  useEffect(() => {
    // console.log(boxRef.current.offsetTop);
    start();
  }, []);

  React.useEffect(() => {
    counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
  }, [counter]);


  useEffect(() => {
    // console.log(boxRef.current.offsetTop);
    if (lives === 0) 
      handleClickOpenEnd();
  });

  const onClickCircle = () => {
    if (!paused) setScore((s) => s + 10);
  };

  const onClickBox = (event) => {
    event.preventDefault();

    if (event.target === event.currentTarget) {
      if (!paused) setLives((l) => Math.max(0, l - 1));
    }
  };

  const start = () => {
    setPaused(false);
    const timer = setInterval(() => {
      setCircleX(Math.floor(Math.random() * (gameWidth - circleSize) + gameLeft));
      setCircleY(Math.floor(Math.random() * (gameHeight - circleSize) + gameTop));
    }, 1000);
    setTimer(timer);
  };

  const pause = () => {
    setPaused(true);
    clearInterval(timer);
  };

  const end = () => {
    clearInterval(timer);
    setScore(0);
    setCircleX(undefined);
    setCircleY(undefined);
  };

  const handleClickOpenPause = () => {
    pause();
    setOpenPause(true);
  };

  const handleClosePause = (value) => {
    setOpenPause(false);
    if (value === 'resume') start();
    else {
      handleClickOpenEnd();
    }
  };

  const handleClickOpenEnd = () => {
    pause();
    setOpenEnd(true);
  };

  const handleCloseEnd = (value) => {
    setOpenEnd(false);
    if (value === 'replay') {
      end();
      setLives(3);
      start();
    } else {
      end();
      submit(false);
    }
  };

  return (
    <>
      <Box sx={{ mx: 3, my: 2, border: 1, borderRadius: 3 }}>
        <Box display="flex" justifyContent="space-between">
          <Typography sx={{ml: 2, mt: 1}} variant='h2'>
            Score: {score}
          </Typography>
          <Box>
            <div>Countdown: {counter}</div>
            <IconButton onClick={handleClickOpenPause}>
              <PauseCircleFilledRoundedIcon sx={{width: 40, height:40 }} />
            </IconButton> 
            <PauseDialog
              open={openPause}
              onClose={handleClosePause}
            />
            <EndDialog
              open={openEnd}
              onClose={handleCloseEnd}
              score={score}
            />
          </Box>
        </Box>
        <Box sx={{ ml: 2 }}>
          { lives > 0 
          ? (new Array(lives).fill(0).map((item, index) => 
            <FavoriteRoundedIcon key={index} sx={{ color: 'red', width: 60, height: 60 }}/>))
          : <Box sx={{ color: 'red', width: 60, height: 60 }} />
          }
        </Box>
        <Box className="Game" ref={boxRef} sx={{ height: '58vh' }} onClick={onClickBox}>
          {circleX && circleY && (
            <div
              style={{
                position: "absolute",
                top: `${circleY}px`,
                left: `${circleX}px`,
                width: `${circleSize}px`,
                height: `${circleSize}px`
              }}
              onClick={onClickCircle}
            >
              <img src={cookie} alt='cookie'/>
            </div>
          )}
        </Box>
      </Box>
    </ >
  );
}

export default GamePlay;