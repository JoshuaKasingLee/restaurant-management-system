// https://javascript.plainenglish.io/create-a-click-shape-game-with-react-and-javascript-c4fa18698081
import React, { useState, useEffect, useRef } from "react";
import { Box, IconButton, Typography } from '@mui/material';
import PauseCircleFilledRoundedIcon from '@mui/icons-material/PauseCircleFilledRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import cookie from './cookie.png';
import brick from './brick.png';
import PauseDialog from './PauseDialog'
import EndDialog from './EndDialog'

const gameTop = 275;
const gameHeight = 476;
const gameLeft = 25;
const gameWidth = 1130;
const circleSize = 100;
const circles = 4;
const bricks = 1;

function GamePlay({submit}) {
  const boxRef = useRef();
  const [score, setScore] = useState(0); 
  const [circleX, setCircleX] = useState(Array(circles).fill(undefined));
  const [circleY, setCircleY] = useState(Array(circles).fill(undefined));
  const [brickX, setBrickX] = useState(Array(bricks).fill(undefined));
  const [brickY, setBrickY] = useState(Array(bricks).fill(undefined));
  // const [timerCircle, setTimerCircle] = useState(Array(circles));
  // const [timerBrick, setTimerBrick] = useState(Array(bricks));
  const [timer, setTimer] = useState();
  const [paused, setPaused] = useState(false);
  const [openPause, setOpenPause] = React.useState(false);
  const [openEnd, setOpenEnd] = React.useState(false);
  const [lives, setLives] = React.useState(3);
  const [counter, setCounter] = React.useState(60);

  useEffect(() => {
    start();
  }, []);

  React.useEffect(() => {
    if(!paused)
      counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
  }, [paused, counter]);


  useEffect(() => {
    // console.log(boxRef.current.offsetTop);
    if (lives === 0 || counter === 0) 
      handleClickOpenEnd();
  });

  const onClickCircle = (i) => {
    if (!paused) setScore((s) => s + 10);
  };

  const onClickBrick = (i) => {
    if (!paused) setLives((l) => Math.max(0, l - 1));
    setBrickX()
  };

  const onClickBox = (event) => {
    event.preventDefault();

    if (event.target === event.currentTarget) {
      if (!paused) setLives((l) => Math.max(0, l - 1));
    }
  };

  const start = () => {
    setPaused(false);
    // for (let i = 0; i < circles; i++) {
    //   const timer = setInterval(() => {
    //     setCircleX(value => ({...value, [i]: Math.floor(Math.random() * (gameWidth - circleSize) + gameLeft)}));
    //     setCircleY(value => ({...value, [i]: Math.floor(Math.random() * (gameHeight - circleSize) + gameTop)}));
    //   }, 1000);
    //   setTimerCircle(value => ({...value, [i]: timer}));
    // }
    // for (let i = 0; i < bricks; i++) {
    //   const timer = setInterval(() => {
    //     setBrickX(value => ({...value, [i]: Math.floor(Math.random() * (gameWidth - circleSize) + gameLeft)}));
    //     setBrickY(value => ({...value, [i]: Math.floor(Math.random() * (gameHeight - circleSize) + gameTop)}));
    //   }, 1000);
    //   setTimerBrick(value => ({...value, [i]: timer}));
    // }

    const timer = setInterval(() => {
      let newCircleX = [];
      let newCircleY = [];
      for (let i = 0; i < circles; i++) {
        newCircleX.push(Math.floor(Math.random() * (gameWidth - circleSize) + gameLeft));
        newCircleY.push(Math.floor(Math.random() * (gameHeight - circleSize) + gameTop));
      }
      setCircleX(newCircleX);
      setCircleY(newCircleY);

      let newBrickX = [];
      let newBrickY = [];
      for (let i = 0; i < circles; i++) {
        newBrickX.push(Math.floor(Math.random() * (gameWidth - circleSize) + gameLeft));
        newBrickY.push(Math.floor(Math.random() * (gameHeight - circleSize) + gameTop));
      }
      setBrickX(newBrickX);
      setBrickY(newBrickY);
    }, 1000);
    setTimer(timer);
  };

  const pause = () => {
    setPaused(true);
    // for(let i = 0; i < circles; i++) {
    //   clearInterval(timerCircle[i]);
    // }
    // for(let i = 0; i < bricks; i++) {
    //   clearInterval(timerBrick[i]);
    // }
    clearInterval(timer);
  };

  const end = () => {
    // for(let i = 0; i < circles; i++) {
    //   clearInterval(timerCircle[i]);
    // }
    // for(let i = 0; i < bricks; i++) {
    //   clearInterval(timerBrick[i]);
    // }
    clearInterval(timer);
    setScore(0);
    setCircleX(Array(circles).fill(undefined));
    setCircleY(Array(circles).fill(undefined));
    setBrickX(Array(bricks).fill(undefined));
    setBrickY(Array(bricks).fill(undefined));
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
      setCounter(60);
      setLives(3);
      start();
    } else {
      end();
      submit(false);
    }
  };

  const getRenderedCircles = () => {
    let renderedContent = [];
    for ( let i = 0; i < circles; i++) {
      if (circleX[i] && circleY[i]) {
        renderedContent.push(
          <div
            style={{
              position: "absolute",
              top: `${circleY[i]}px`,
              left: `${circleX[i]}px`,
              width: `${circleSize}px`,
              height: `${circleSize}px`
            }}
            onClick={() => onClickCircle(i)}
          >
            <img src={cookie} alt='cookie'/>
          </div>
        )
      }
    }
    return renderedContent;
  };

  const getRenderedBricks = () => {
    let renderedContent = [];
    for ( let i = 0; i < bricks; i++) {
      if (brickX[i] && brickY[i]) {
        renderedContent.push(
          <div
            style={{
              position: "absolute",
              top: `${brickY[i]}px`,
              left: `${brickX[i]}px`,
              width: `${circleSize}px`,
              height: `${circleSize}px`
            }}
            onClick={() => onClickBrick(i)}
          >
            <img src={brick} alt='boo'/>
          </div>
        )
      }
    }
    return renderedContent;
  };

  return (
    <>
      <Box sx={{ mx: 3, my: 2, border: 1, borderRadius: 3 }}>
        <Box display="flex" justifyContent="space-between">
          <Typography sx={{ml: 2, mt: 1}} variant='h2'>
            Score: {score}
          </Typography>
          <Typography sx={{ml: -10, mt: 1}} variant='h2'>
            {counter === 60 ? '1:00' : `0:${counter}`}
          </Typography>
          <Box>
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
          {getRenderedCircles()}
          {getRenderedBricks()}
        </Box>
      </Box>
    </ >
  );
}

export default GamePlay;