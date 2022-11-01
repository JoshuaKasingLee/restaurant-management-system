// https://javascript.plainenglish.io/create-a-click-shape-game-with-react-and-javascript-c4fa18698081
import React, { useState, useEffect, useRef } from "react";
import { Box, IconButton, Typography } from '@mui/material';
import PlayCircleRoundedIcon from '@mui/icons-material/PlayCircleRounded';
import PauseCircleFilledRoundedIcon from '@mui/icons-material/PauseCircleFilledRounded';
import StopCircleRoundedIcon from '@mui/icons-material/StopCircleRounded';
import Header from '../../components/customer/Header';
import Footer from '../../components/customer/Footer';

function Game() {
  const boxRef = useRef();
  const [score, setScore] = useState(0);
  const [x, setX] = useState();
  const [y, setY] = useState();
  const [height, setHeight] = useState();  
  const [circleX, setCircleX] = useState();
  const [circleY, setCircleY] = useState();
  const [timer, setTimer] = useState();
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    getPosition();

    console.log(y);
    console.log(x);
    console.log(height);
  }, [y, x, height]);

  const getPosition = () => {
    setY(boxRef.current.offsetTop);
    setX(window.innerWidth);
    setHeight(boxRef.current.offsetHeight);

  };

  const onClick = () => {
    if (!paused) setScore((s) => s + 1);
  };

  const start = () => {
    setPaused(false);
    const timer = setInterval(() => {
      setCircleX(Math.floor(Math.random() * (window.innerWidth - 50)));
      setCircleY(Math.floor(Math.random() * (height - 50) + y));
      // setCircleX(Math.floor(1));
      // setCircleY(Math.floor(y + 1));
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

  return (
    <>
      <Header image={localStorage.getItem('restaurantImage')} title={"Game"} />
      <Box display="flex" justifyContent="space-between">
        <Typography>
          Score: {score}
        </Typography>
        <IconButton variant="outlined" onClick={pause}>
          <PauseCircleFilledRoundedIcon/>
        </IconButton> 
      </Box>
      <Box className="Game" ref={boxRef} sx={{ height: '70vh', border: 1 }}>
        <style>
          {`
          .circle {
            border: 1px solid black;
            width: 50px;
            height: 50px;
            border-radius: 50%;
          }
          `}
        </style>
        <IconButton variant="outlined" onClick={start}>
          <PlayCircleRoundedIcon/>
        </IconButton>
        <IconButton variant="outlined" onClick={pause}>
          <PauseCircleFilledRoundedIcon/>
        </IconButton> 
        <IconButton variant="outlined" onClick={end}>
          <StopCircleRoundedIcon/>
        </IconButton> 
        {circleX && circleY && (
          <div
            className="circle"
            style={{
              position: "absolute",
              top: `${circleY}px`,
              left: `${circleX}px`
            }}
            onClick={onClick}
          >
            &nbsp;
          </div>
        )}
      </Box>
      <Footer initialValue={"game"}/>
    </ >
  );
}

export default Game;