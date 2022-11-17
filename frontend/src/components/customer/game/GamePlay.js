import React, { useState, useEffect, useRef } from "react";
import { Alert,  Box, IconButton, Stack, Typography } from '@mui/material';
import PauseCircleFilledRoundedIcon from '@mui/icons-material/PauseCircleFilledRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import cookie from './cookie.png';
import brick from './brick.png';
import PauseDialog from './PauseDialog'
import EndDialog from './EndDialog'

const gameTop = 241;
const gameHeight = 484;
const gameLeft = 24;
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
  const [text2, setText2] = React.useState("");
  const [checked, setChecked] = React.useState(false);
  const [checked2, setChecked2] = React.useState(false);

  useEffect(() => {
    start();
  }, []);

  useEffect(() => {
    if(!paused && counter > 0) { 
      setTimeout(() => setCounter(counter - 1), 1000);
    }
  }, [paused, counter]);

  useEffect(() => {
    if (lives === 0 || counter === 0) 
      handleClickOpenEnd();
  });

  useEffect(() => {
    if (score !== 0 && score % 100 === 0) {
      const timer = setInterval(() => {
        setBrickX(value => ({...value, [bricks]: random(left, right)}));
        setBrickY(value => ({...value, [bricks]: random(top, bottom)}));
      }, random(2000, 3000));
      setTimerBrick(value => ({...value, [bricks]: timer}));
      if (bricks < 20) {
        setText(value => [...value, 'Warning! A new monster has arrived']);
        setBricks(bricks => bricks + 1);
      }
      if (score % 200 === 0) {
        const timer = setInterval(() => {
          setCircleX(value => ({...value, [circles]: random(left, right)}));
          setCircleY(value => ({...value, [circles]: random(top, bottom)}));
        }, random(2000, 3000));
        setTimerCircle(value => ({...value, [circles]: timer}));
        if (circles < 20) {
          setText(value => [...value, "Good job, extra cookie unlocked!"]);
          setCircles(circles => circles + 1);
        }
      }
      if (bricks < 20 || circles < 20) {
        setChecked(true);
        setTimeout(() => {
          setChecked(false);
          setText([]);
        }, 2000);
      }
    }
  }, [score, bricks, circles]);

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
    if (!paused) {
      setLives((l) => Math.max(0, l - 1));
      clearInterval(timerBrick[i]);
      setBrickX(value => ({...value, [i]: random(left, right)}));
      setBrickY(value => ({...value, [i]: random(top, bottom)}));
      const timer = setInterval(() => {
        setBrickX(value => ({...value, [i]: random(left, right)}));
        setBrickY(value => ({...value, [i]: random(top, bottom)}));
      }, random(2000, 3000));
      setTimerBrick(value => ({...value, [i]: timer}));
      setText2(`Oh no, you lost a life! Only ${Math.max(0, lives - 1)} remaining...`);
      setChecked2(true);
      setTimeout(() => {
        setChecked2(false);
        setText2('');
      }, 2000);
    }
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
      <Box sx={{ mx: 3, my: 5, borderRadius: 3, boxShadow: 10, backgroundColor:'background.paper'}}>
        <Box display="flex" justifyContent="space-between">
          <Typography sx={{ml: 2, mt: 1}} variant='h2'>
            Score: {score}
          </Typography>
          {counter === 60 &&
            <Typography  sx={{ml: -10, mt: 1}} variant='h2'>
              1:00
            </Typography>
          }
          {counter < 60 && counter >= 10 && 
            <Typography  sx={{ml: -10, mt: 1}} variant='h2'>
              0:{counter}
            </Typography>
          }
          {counter < 10 && 
            <Typography  sx={{ml: -10, mt: 1, color:'rgb(255,0,0)'}} variant='h2'>
              0:0{counter}
            </Typography>
          }
          <Box>
            <Stack
              sx={{
                position: 'fixed',
                top: 115,
                right: 80,
                width:'320px'
              }}
              spacing={1}
            >
            {checked && text.map((item, index) => (
              <Alert 
                severity={item.startsWith('W') ? "error" : "success"}
                key={index}
                sx={{
                  height: 50
                }}
              >
                {item}
              </Alert>
            ))}
            {checked2 &&
              <Alert 
                severity={"error"}
                key="2"
                sx={{
                  height: 50
                }}
              >
                {text2}
              </Alert>
            }
            </Stack>
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
        <Box 
          className="Game" 
          ref={boxRef} 
          sx={{ 
            height: '59vh', 
            borderRadius: '0px 0px 20px 20px', 
          }}
        >
          {getRenderedCircles()}
          {getRenderedBricks()}
        </Box>
      </Box>
    </ >
  );
}

export default GamePlay;