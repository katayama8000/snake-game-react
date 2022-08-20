import React, { useEffect, useRef, useState } from "react";
import useInterval from "@hooks/useInterval";

const canvasX = 1000;
const canvasY = 1000;
const initialSnake: number[][] = [
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
  const [speedUp, setSpeedUp] = useState<number>(20);

  //console.log(snake);

  //0.1秒おきにrunGame()が一回呼ばれる
  useInterval(() => runGame(), delay);

  //localStorageからhighScoreを取得
  useEffect(() => {
    setHighScore(localStorage.getItem("snakeScore"));
  }, []);

  useEffect(() => {
    const reactIcon = document.getElementById("react") as HTMLCanvasElement;
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        //全体的なスケールを指定
        ctx.setTransform(scale, 1, 0, scale, 0, 0);
        //この領域内のすべてのピクセルが消去される
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        switch (speedUp) {
          case 20:
            ctx.fillStyle = "#7CFC00";
            break;
          case 40:
            ctx.fillStyle = "#FFD700";
            break;
          case 60:
            ctx.fillStyle = "#FF8C00";
            break;
          case 80:
            ctx.fillStyle = "#FF0000";
            break;
          default:
            ctx.fillStyle = "#7CFC00";
            break;
        }

        //四角形をsnakeの長さ分描画
        snake.forEach(([x, y]) => ctx.fillRect(x, y, 1, 1));
        //Reactのアイコンを描画
        //drawImage(画像, 座標x, 座標y, 幅, 高さ)
        ctx.drawImage(reactIcon, rIcon[0], rIcon[1], 1, 1);
      }
    }
  }, [snake, rIcon, isgameOver, score, speedUp]);

  //スコアを更新する
  const handleSetScore = (): void => {
    if (score > Number(highScore)) {
      localStorage.setItem("snakeScore", JSON.stringify(score));
    }
  };

  //ゲームを開始する
  const play = (): void => {
    setSnake(initialSnake);
    setRIcon(initialReactIcon);
    setDirection([1, 0]);
    setDelay(timeDelay);
    setScore(0);
    setIsGameOver(false);
    setSpeedUp(20);
  };

  const checkCollision = (head: number[]): boolean => {
    console.log(head);
    //
    for (let i = 0; i < 2; i++) {
      if (head[i] < 0 || head[i] * scale >= canvasX) return true;
      console.log(1);
    }
    //
    for (const s of snake) {
      if (head[0] === s[0] && head[1] === s[1]) return true;
      console.log(2);
    }
    //falseが返ってきたら、ゲームオーバー
    return false;
  };

  const ReactIconAte = (newSnake: number[][]): boolean => {
    const coord = rIcon.map(() =>
      Math.floor((Math.random() * canvasX) / scale)
    );
    if (newSnake[0][0] === rIcon[0] && newSnake[0][1] === rIcon[1]) {
      const newRIcon = coord;
      const isFiveOrZero: boolean = (score + 1) % 5 === 0;
      setScore(score + 1);
      if (isFiveOrZero && score !== 0) {
        console.log("-------------------------------");
        console.log(timeDelay, score, speedUp);
        setDelay(timeDelay - speedUp);
        setSpeedUp((prev) => prev + 20);
      }

      setRIcon(newRIcon);
      return true;
    }
    return false;
  };

  const runGame = (): void => {
    const newSnake = [...snake];
    const newSnakeHead: number[] = [
      newSnake[0][0] + direction[0],
      newSnake[0][1] + direction[1],
    ];
    console.log("蛇の頭", newSnakeHead);
    //配列の先頭に追加
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

  const changeDirection = (e: React.KeyboardEvent<HTMLDivElement>): void => {
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
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSISAMlSDXN3aCpjHjbdrUP4vebVgG-UhE-Aw&usqp=CAU"
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
        <h2>Speed: {speedUp}</h2>
      </div>
    </div>
  );
};

export default Home;
