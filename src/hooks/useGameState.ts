import { useState, useCallback, useEffect } from 'react';
import { Position, Direction, GameState, GameStats } from '../types/game';
import { 
  getRandomPosition, 
  checkCollision, 
  isOutOfBounds, 
  getNextPosition, 
  isOppositeDirection,
  calculateSpeed,
  INITIAL_SNAKE_LENGTH
} from '../utils/gameUtils';

const STORAGE_KEY = 'snake-game-high-score';

export const useGameState = () => {
  const [snake, setSnake] = useState<Position[]>([
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
  ]);
  const [food, setFood] = useState<Position>(getRandomPosition());
  const [direction, setDirection] = useState<Direction>(Direction.RIGHT);
  const [gameState, setGameState] = useState<GameState>(GameState.READY);
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    highScore: parseInt(localStorage.getItem(STORAGE_KEY) || '0'),
    level: 1
  });
  const [hasPlayedBefore, setHasPlayedBefore] = useState<boolean>(false);

  const generateFood = useCallback((currentSnake: Position[]): Position => {
    let newFood: Position;
    do {
      newFood = getRandomPosition();
    } while (currentSnake.some(segment => checkCollision(segment, newFood)));
    return newFood;
  }, []);

  const moveSnake = useCallback(() => {
    if (gameState !== GameState.PLAYING) return;

    setSnake(currentSnake => {
      const head = currentSnake[0];
      const newHead = getNextPosition(head, direction);

      // Check wall collision
      if (isOutOfBounds(newHead)) {
        setGameState(GameState.GAME_OVER);
        return currentSnake;
      }

      // Check self collision
      if (currentSnake.some(segment => checkCollision(segment, newHead))) {
        setGameState(GameState.GAME_OVER);
        return currentSnake;
      }

      const newSnake = [newHead, ...currentSnake];

      // Check food collision
      if (checkCollision(newHead, food)) {
        setFood(generateFood(newSnake));
        setStats(prevStats => {
          const newScore = prevStats.score + 10;
          const newLevel = Math.floor(newScore / 50) + 1;
          const newHighScore = Math.max(prevStats.highScore, newScore);
          
          if (newHighScore > prevStats.highScore) {
            localStorage.setItem(STORAGE_KEY, newHighScore.toString());
          }
          
          return {
            score: newScore,
            highScore: newHighScore,
            level: newLevel
          };
        });
        return newSnake; // Don't remove tail when eating
      } else {
        return newSnake.slice(0, -1); // Remove tail for normal movement
      }
    });
  }, [direction, food, gameState, generateFood]);

  const changeDirection = useCallback((newDirection: Direction) => {
    if (gameState !== GameState.PLAYING) return;
    if (isOppositeDirection(direction, newDirection)) return;
    setDirection(newDirection);
  }, [direction, gameState]);

  const startGame = useCallback(() => {
    setGameState(GameState.PLAYING);
    setHasPlayedBefore(true);
  }, []);

  const resetGame = useCallback(() => {
    const initialSnake = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 }
    ];
    setSnake(initialSnake);
    setFood(generateFood(initialSnake));
    setDirection(Direction.RIGHT);
    setGameState(GameState.READY);
    setStats(prev => ({ ...prev, score: 0, level: 1 }));
  }, [generateFood]);

  const togglePause = useCallback(() => {
    setGameState(prev => 
      prev === GameState.PLAYING ? GameState.PAUSED : GameState.PLAYING
    );
  }, []);

  return {
    snake,
    food,
    direction,
    gameState,
    stats,
    hasPlayedBefore,
    moveSnake,
    changeDirection,
    startGame,
    resetGame,
    togglePause,
    gameSpeed: calculateSpeed(stats.level)
  };
};