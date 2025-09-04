import React, { useEffect } from 'react';
import { GameCanvas } from './GameCanvas';
import { GameUI } from './GameUI';
import { useGameState } from '../hooks/useGameState';
import { useGameLoop } from '../hooks/useGameLoop';
import { Direction, GameState } from '../types/game';

export const SnakeGame: React.FC = () => {
  const {
    snake,
    food,
    gameState,
    stats,
    moveSnake,
    changeDirection,
    resetGame,
    togglePause,
    gameSpeed
  } = useGameState();

  // Game loop
  useGameLoop(moveSnake, gameSpeed, gameState === GameState.PLAYING);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          changeDirection(Direction.UP);
          break;
        case 'ArrowDown':
          e.preventDefault();
          changeDirection(Direction.DOWN);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          changeDirection(Direction.LEFT);
          break;
        case 'ArrowRight':
          e.preventDefault();
          changeDirection(Direction.RIGHT);
          break;
        case ' ':
          e.preventDefault();
          togglePause();
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          resetGame();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [changeDirection, togglePause, resetGame]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="flex flex-col lg:flex-row gap-6 items-center">
        <div className="relative">
          <GameCanvas
            snake={snake}
            food={food}
            className="border-2 border-gray-700 rounded-lg shadow-2xl"
          />
          {gameState !== GameState.PLAYING && (
            <div className="absolute inset-0 bg-black bg-opacity-60 rounded-lg flex items-center justify-center">
              <div className="text-center text-white">
                {gameState === GameState.PAUSED && (
                  <div className="text-4xl font-bold">PAUSED</div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <GameUI
          gameState={gameState}
          stats={stats}
          onPause={togglePause}
          onRestart={resetGame}
        />
      </div>
    </div>
  );
};