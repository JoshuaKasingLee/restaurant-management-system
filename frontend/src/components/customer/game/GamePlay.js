// https://javascript.plainenglish.io/create-a-click-shape-game-with-react-and-javascript-c4fa18698081
import React, { useState, useEffect, useRef } from "react";
import { Box, IconButton, Typography } from '@mui/material';
import PauseCircleFilledRoundedIcon from '@mui/icons-material/PauseCircleFilledRounded';
import StopCircleRoundedIcon from '@mui/icons-material/StopCircleRounded';
import cookie from './cookie.png';
import PauseDialog from './PauseDialog'

const gameTop = 184;
const gameHeight = 574;
const gameWidth = 1180;
const circleSize = 100;

function GamePlay({submit}) {
  const boxRef = useRef();
  const [score, setScore] = useState(0); 
  const [circleX, setCircleX] = useState();
  const [circleY, setCircleY] = useState();
  const [timer, setTimer] = useState();
  const [paused, setPaused] = useState(false);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    // console.log(boxRef.current.offsetTop);
    start();
  }, []);

  const onClick = () => {
    if (!paused) setScore((s) => s + 100);
  };

  const start = () => {
    setPaused(false);
    const timer = setInterval(() => {
      setCircleX(Math.floor(Math.random() * (gameWidth - circleSize)));
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
    submit(false);
  };

  const handleClickOpen = () => {
    pause();
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    if (value === 'resume') start();
    else end();
  };

  return (
    <>
      <Box sx={{ border: 1, borderRadius: 3 }}>
        <Box display="flex" justifyContent="space-between">
          <Typography sx={{ml: 1}} variant='h2'>
            Score: {score}
          </Typography>
          <Box>
            <IconButton onClick={handleClickOpen}>
              <PauseCircleFilledRoundedIcon sx={{width: 40, height:40 }} />
            </IconButton> 
            <PauseDialog
              open={open}
              onClose={handleClose}
            />
          </Box>
        </Box>
        <Box className="Game" ref={boxRef} sx={{ height: '70vh' }}>
          {circleX && circleY && (
            <div
              style={{
                position: "absolute",
                top: `${circleY}px`,
                left: `${circleX}px`,
                width: `${circleSize}px`,
                height: `${circleSize}px`
              }}
              onClick={onClick}
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