// https://javascript.plainenglish.io/create-a-click-shape-game-with-react-and-javascript-c4fa18698081
import React, { useState } from "react";
import Header from '../../components/customer/Header';
import Footer from '../../components/customer/Footer';

function Game() {
  const [score, setScore] = useState(0);
  const [circleX, setCircleX] = useState();
  const [circleY, setCircleY] = useState();
  const [timer, setTimer] = useState();
  const onClick = () => {
    setScore((s) => s + 1);
  };
  const start = () => {
    const timer = setInterval(() => {
      setCircleX(Math.floor(Math.random() * window.innerWidth));
      setCircleY(Math.floor(Math.random() * (window.innerHeight - 50) + 50));
    }, 1000);
    setTimer(timer);
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
      <div className="Game">
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
        <button onClick={start}>start game</button>
        <button onClick={end}>end game</button>
        <p>score: {score}</p>
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
      </div>
      <Footer initialValue={"game"}/>
    </ >
  );
}

export default Game;