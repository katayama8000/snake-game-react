import React, { useEffect, useRef, useState } from "react";
import useInterval from "@hooks/useInterval";
import { Image } from "@mantine/core";

const canvasX = 1000;
const canvasY = 1000;
const initialSnake = [
  [4, 10],
  [4, 10],
];
const initialReactIcon = [14, 10];
const scale = 50;
const timeDelay = 100;

const Home = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [snake, setSnake] = useState<number[][]>(initialSnake);
  const [rIcon, setRIcon] = useState<number[]>(initialReactIcon);
  const [direction, setDirection] = useState<number[]>([0, -1]);
  const [delay, setDelay] = useState<number | null>(null);
  const [isgameOver, setIsGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<string | null>("");
  const [left, setLeft] = useState<number>(20);

  console.log(snake);

  useInterval(() => runGame(), delay);

  useEffect(() => {
    setHighScore(localStorage.getItem("snakeScore"));
  }, []);

  useEffect(() => {
    const reactIcon = document.getElementById("react") as HTMLCanvasElement;
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.setTransform(scale, 0, 0, scale, 0, 0);
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        ctx.fillStyle = "#a3d001";
        snake.forEach(([x, y]) => ctx.fillRect(x, y, 1, 1));
        ctx.drawImage(reactIcon, rIcon[0], rIcon[1], 1, 1);
      }
    }
  }, [snake, rIcon, isgameOver]);

  const handleSetScore = () => {
    if (score > Number(localStorage.getItem("snakeScore"))) {
      localStorage.setItem("snakeScore", JSON.stringify(score));
    }
  };

  const play = () => {
    setSnake(initialSnake);
    setRIcon(initialReactIcon);
    setDirection([1, 0]);
    setDelay(timeDelay);
    setScore(0);
    setIsGameOver(false);
  };

  const checkCollision = (head: number[]) => {
    for (let i = 0; i < head.length; i++) {
      if (head[i] < 0 || head[i] * scale >= canvasX) return true;
    }
    for (const s of snake) {
      if (head[0] === s[0] && head[1] === s[1]) return true;
    }
    return false;
  };

  const ReactIconAte = (newSnake: number[][]): boolean => {
    const coord = rIcon.map(() =>
      Math.floor((Math.random() * canvasX) / scale)
    );
    if (newSnake[0][0] === rIcon[0] && newSnake[0][1] === rIcon[1]) {
      const newRIcon = coord;
      setScore(score + 1);
      setRIcon(newRIcon);
      return true;
    }
    return false;
  };

  const runGame = () => {
    const newSnake = [...snake];
    const newSnakeHead: number[] = [
      newSnake[0][0] + direction[0],
      newSnake[0][1] + direction[1],
    ];
    newSnake.unshift(newSnakeHead);
    //Game over
    if (checkCollision(newSnakeHead)) {
      setDelay(null);
      setIsGameOver(true);
      handleSetScore();
    }
    //check if snake ate the React Icon
    if (!ReactIconAte(newSnake)) {
      newSnake.pop();
    }
    setSnake(newSnake);
  };

  const changeDirection = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case "ArrowLeft":
        setDirection([-1, 0]);
        break;
      case "ArrowUp":
        setDirection([0, -1]);
        break;
      case "ArrowRight":
        setDirection([1, 0]);
        break;
      case "ArrowDown":
        setDirection([0, 1]);
        break;
    }
  };

  return (
    <div onKeyDown={(e) => changeDirection(e)}>
      <img
        src={
          "https://play-lh.googleusercontent.com/AFY95yFw1P4ErzREpYWiSRyy6GyFA34pc70dP7MuHfkP12alfktC0Rp2ht-LbPAvO5sg"
        }
        width="20"
        height="30"
        id="react"
        alt="react"
      />
      <canvas
        className="playArea"
        ref={canvasRef}
        width={`${canvasX}px`}
        height={`${canvasY}px`}
      />
      {isgameOver && <div className="gameOver">Game Over</div>}
      <button onClick={play} className="playButton">
        Play
      </button>

      <div className="scoreBox">
        <h2>Score: {score}</h2>
        {highScore && <h2>High Score: {highScore}</h2>}
        <h2>Left: {left}</h2>
      </div>
    </div>
  );
};

export default Home;
