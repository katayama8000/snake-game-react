import React, { useEffect, useRef, useState } from 'react';
import { useInterval } from '@hooks/useInterval';
import { NextPage } from 'next';

const CanvasX = 1000;
const CanvasY = 1000;
//配列が増える＝蛇の長さが増える
const InitialSnake: number[][] = [
  [4, 10],
  [4, 10],
];
const InitialReactIcon = [14, 10];
const Scale = 50;
const TimeDelay = 100;

const Home: NextPage = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [snake, setSnake] = useState<number[][]>(InitialSnake);
  const [rIcon, setRIcon] = useState<number[]>(InitialReactIcon);
  const [direction, setDirection] = useState<number[]>([0, -1]);
  const [delay, setDelay] = useState<number | null>(null);
  const [isgameOver, setIsGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<string | null>(null);
  const [left, setLeft] = useState<number>(20);
  const [speedUp, setSpeedUp] = useState<number>(20);

  //0.1秒おきにrunGame()が一回呼ばれる
  useInterval(() => runGame(), delay);

  useEffect(() => {
    if (isgameOver) {
      if (score > Number(highScore)) {
        setHighScore(localStorage.getItem('snakeScore'));
      }
    }
  }, [isgameOver]);

  useEffect(() => {
    const reactIcon = document.getElementById('react') as HTMLCanvasElement;
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        //全体的なスケールを指定
        ctx.setTransform(Scale, 0, 0, Scale, 0, 0);
        //この領域内のすべてのピクセルが消去される
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        switch (speedUp) {
          case 20:
            ctx.fillStyle = '#7CFC00';
            break;
          case 40:
            ctx.fillStyle = '#FFD700';
            break;
          case 60:
            ctx.fillStyle = '#FF8C00';
            break;
          case 80:
            ctx.fillStyle = '#FF0000';
            break;
          default:
            ctx.fillStyle = '#7CFC00';
            break;
        }

        //四角形をsnakeの長さ分描画
        snake.forEach(([x, y]) => ctx.fillRect(x, y, 1, 1));
        //Reactのアイコンを描画
        //drawImage(画像, 座標x, 座標y, 幅, 高さ)
        ctx.drawImage(reactIcon, rIcon[0], rIcon[1], 1, 1);
      }
    }
  }, [snake, rIcon, isgameOver, speedUp]);

  //スコアを更新する
  const handleSetScore = (): void => {
    if (score > Number(highScore)) {
      localStorage.setItem('snakeScore', JSON.stringify(score));
    }
  };

  //ゲームを開始する
  const play = (): void => {
    setSnake(InitialSnake);
    setRIcon(InitialReactIcon);
    //初めは右
    setDirection([1, 0]);
    setDelay(TimeDelay);
    setScore(0);
    setIsGameOver(false);
    setSpeedUp(20);
  };

  const checkCollision = (head: number[]): boolean => {
    for (let i = 0; i < 2; i++) {
      if (head[i] < 0 || head[i] * Scale >= CanvasX) return true;
    }
    for (const s of snake) {
      if (head[0] === s[0] && head[1] === s[1]) return true;
    }
    //falseが返ってきたら、ゲームオーバー
    return false;
  };

  const ReactIconAte = (newSnake: number[][]): boolean => {
    //ランダム座標をセット
    const newRIcon = rIcon.map(() =>
      Math.floor((Math.random() * CanvasX) / Scale)
    );
    //Iconを食べたら
    if (newSnake[0][0] === rIcon[0] && newSnake[0][1] === rIcon[1]) {
      const score: number = newSnake.length - InitialSnake.length;
      const isFiveOrZero: boolean = score % 5 === 0;
      setScore(score);
      if (isFiveOrZero && score !== 0) {
        setDelay(TimeDelay - speedUp);
        setSpeedUp((prev) => prev + 20);
      }
      setRIcon(newRIcon);
      return true;
    }
    return false;
  };

  //intervalごとに呼ばれる関数
  const runGame = (): void => {
    const newSnake = [...snake];
    //進む方向を決める
    const newSnakeHead: number[] = [
      newSnake[0][0] + direction[0],
      newSnake[0][1] + direction[1],
    ];
    //配列の先頭に追加
    newSnake.unshift(newSnakeHead);
    //Game over
    if (checkCollision(newSnakeHead)) {
      setDelay(null);
      setIsGameOver(true);
      handleSetScore();
    }
    if (!ReactIconAte(newSnake)) {
      //これがないと、蛇が伸び続ける
      newSnake.pop();
    }
    setSnake(newSnake);
  };

  const changeDirection = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    const { key } = e;
    switch (key) {
      case 'ArrowLeft':
        setDirection([-1, 0]);
        break;
      case 'ArrowUp':
        setDirection([0, -1]);
        break;
      case 'ArrowRight':
        setDirection([1, 0]);
        break;
      case 'ArrowDown':
        setDirection([0, 1]);
        break;
      case 'Enter':
        play();
        break;
      default:
        break;
    }
  };

  return (
    <div onKeyDown={(e) => changeDirection(e)}>
      <img
        src={
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSISAMlSDXN3aCpjHjbdrUP4vebVgG-UhE-Aw&usqp=CAU'
        }
        width="20"
        height="30"
        id="react"
        alt="react"
      />
      <canvas
        className="playArea"
        ref={canvasRef}
        width={`${CanvasX}px`}
        height={`${CanvasY}px`}
      />
      {isgameOver && (
        <div className="gameOver">
          Game Over
          <br />
          Press Enter to restart
        </div>
      )}
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
