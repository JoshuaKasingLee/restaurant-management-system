import React, { useState, useEffect, useRef } from "react";
import { Box, IconButton, Typography } from '@mui/material';
import PauseCircleFilledRoundedIcon from '@mui/icons-material/PauseCircleFilledRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import cookie from './cookie.png';
import brick from './brick.png';
import PauseDialog from './PauseDialog'
import EndDialog from './EndDialog'

const gameTop = 210;
const gameHeight = 508;
const gameLeft = 25;
const gameWidth = 1130;
const circleSize = 100;
const top = gameTop + circleSize;
const bottom = gameTop + gameHeight - circleSize;
const left = gameLeft + circleSize;
const right = gameLeft + gameWidth - circleSize;

function GamePlay({submit}) {
  const random = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const boxRef = useRef();
  const [circles, setCircles] = useState(4);
  const [bricks, setBricks] = useState(1);
  const [score, setScore] = useState(0); 
  const [circleX, setCircleX] = useState(Array.from({length: circles}, () => random(left, right)));
  const [circleY, setCircleY] = useState(Array.from({length: circles}, () => random(top, bottom)));
  const [brickX, setBrickX] = useState(Array.from({length: bricks}, () => random(left, right)));
  const [brickY, setBrickY] = useState(Array.from({length: bricks}, () => random(top, bottom)));
  const [timerCircle, setTimerCircle] = useState(Array(circles));
  const [timerBrick, setTimerBrick] = useState(Array(bricks));
  const [paused, setPaused] = useState(false);
  const [openPause, setOpenPause] = React.useState(false);
  const [openEnd, setOpenEnd] = React.useState(false);
  const [lives, setLives] = React.useState(3);
  const [counter, setCounter] = React.useState(60);
  const [text, setText] = React.useState([]);
  const [checked, setChecked] = React.useState(false);

  useEffect(() => {
    start();
  }, []);

  useEffect(() => {
    if(!paused)
      counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
  }, [paused, counter]);

  useEffect(() => {
    // console.log(boxRef.current.offsetLeft);
    if (lives === 0 || counter === 0) 
      handleClickOpenEnd();
  });

  useEffect(() => {
    if (score !== 0 && score % 100 === 0) {
      setText(value => [...value, 'Warning! A new brick has been added...']);
      const timer = setInterval(() => {
        setBrickX(value => ({...value, [bricks]: random(left, right)}));
        setBrickY(value => ({...value, [bricks]: random(top, bottom)}));
      }, random(2000, 3000));
      setTimerBrick(value => ({...value, [bricks]: timer}));
      setBricks(bricks => bricks + 1);
      if (score % 200 === 0) {
        setText(value => [...value, "Good job, you've unlocked a new circle!"]);
        const timer = setInterval(() => {
          setCircleX(value => ({...value, [circles]: random(left, right)}));
          setCircleY(value => ({...value, [circles]: random(top, bottom)}));
        }, random(2000, 3000));
        setTimerCircle(value => ({...value, [circles]: timer}));
        setCircles(circles => circles + 1);
      }
      setChecked(true);
      setTimeout(() => {
        setChecked(false);
        setText([]);
      }, 2000);
    }
  }, [score]);

  const onClickCircle = (i) => {
    if (!paused) {
      setScore((s) => s + 10);
      clearInterval(timerCircle[i]);
      setCircleX(value => ({...value, [i]: random(left, right)}));
      setCircleY(value => ({...value, [i]: random(top, bottom)}));
      const timer = setInterval(() => {
        setCircleX(value => ({...value, [i]: random(left, right)}));
        setCircleY(value => ({...value, [i]: random(top, bottom)}));
      }, random(1000, 2000));
      setTimerCircle(value => ({...value, [i]: timer}));
    }
  };

  const onClickBrick = (i) => {
    if (!paused) setLives((l) => Math.max(0, l - 1));
    clearInterval(timerBrick[i]);
    setBrickX(value => ({...value, [i]: random(left, right)}));
    setBrickY(value => ({...value, [i]: random(top, bottom)}));
    const timer = setInterval(() => {
      setBrickX(value => ({...value, [i]: random(left, right)}));
      setBrickY(value => ({...value, [i]: random(top, bottom)}));
    }, random(2000, 3000));
    setTimerBrick(value => ({...value, [i]: timer}));
  };

  const start = () => {
    setPaused(false);
    for (let i = 0; i < circles; i++) {
      const timer = setInterval(() => {
        setCircleX(value => ({...value, [i]: random(left, right)}));
        setCircleY(value => ({...value, [i]: random(top, bottom)}));
      }, random(1000, 2000));
      setTimerCircle(value => ({...value, [i]: timer}));
    }
    for (let i = 0; i < bricks; i++) {
      const timer = setInterval(() => {
        setBrickX(value => ({...value, [i]: random(left, right)}));
        setBrickY(value => ({...value, [i]: random(top, bottom)}));
      }, random(2000, 3000));
      setTimerBrick(value => ({...value, [i]: timer}));
    }
  };

  const pause = () => {
    setPaused(true);
    for(let i = 0; i < circles; i++) {
      clearInterval(timerCircle[i]);
    }
    for(let i = 0; i < bricks; i++) {
      clearInterval(timerBrick[i]);
    }
  };

  const end = () => {
    for(let i = 0; i < circles; i++) {
      clearInterval(timerCircle[i]);
    }
    for(let i = 0; i < bricks; i++) {
      clearInterval(timerBrick[i]);
    }
    setScore(0);
    setCircles(4);
    setBricks(1);
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
            key={i}
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
            key={i}
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
      <Box sx={{ mx: 3, my: 2, borderRadius: 3, boxShadow: 2 }}>
        <Box display="flex" justifyContent="space-between" >
          <Typography sx={{ml: 2, mt: 1}} variant='h2'>
            Score: {score}
          </Typography>
          <Typography  sx={{ml: -10, mt: 1}} variant='h2'>
            {counter === 60 ? '1:00' : `0:${counter}`}
          </Typography>
          <Box>
            {checked && text.map((item, index) => (
              <Typography 
                variant='h7'
                sx={{
                  position: 'fixed',
                  top: 95 + (index * 25),
                  right: 60,
                  width:'300px'
                }}
              >
                {item}
              </Typography>
            ))}
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
        <Box className="Game" ref={boxRef} sx={{ height: '62vh' }}>
          {getRenderedCircles()}
          {getRenderedBricks()}
        </Box>
      </Box>
    </ >
  );
}

export default GamePlay;