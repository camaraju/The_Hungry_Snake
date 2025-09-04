import React, { useEffect } from 'react';
import { Play, RotateCcw } from 'lucide-react';
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
    hasPlayedBefore,
    moveSnake,
    changeDirection,
    startGame,
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
          if (gameState === GameState.PLAYING) {
            changeDirection(Direction.UP);
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (gameState === GameState.PLAYING) {
            changeDirection(Direction.DOWN);
          }
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (gameState === GameState.PLAYING) {
            changeDirection(Direction.LEFT);
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (gameState === GameState.PLAYING) {
            changeDirection(Direction.RIGHT);
          }
          break;
        case ' ':
          e.preventDefault();
          if (gameState === GameState.PLAYING || gameState === GameState.PAUSED) {
            togglePause();
          }
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          if (gameState === GameState.GAME_OVER || gameState === GameState.PAUSED) {
            resetGame();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [changeDirection, togglePause, resetGame, gameState]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="flex flex-col lg:flex-row gap-6 items-center">
        <div className="relative">
          <GameCanvas
            snake={snake}
            food={food}
            className="border-2 border-gray-700 rounded-lg shadow-2xl"
          />
          {(gameState === GameState.READY || gameState === GameState.GAME_OVER || gameState === GameState.PAUSED) && (
            <div className="absolute inset-0 bg-black bg-opacity-60 rounded-lg flex items-center justify-center">
              <div className="text-center text-white space-y-4">
                {gameState === GameState.READY && (
                  <div>
                    <div className="text-4xl font-bold mb-6 text-green-400">
                      {hasPlayedBefore ? 'Ready to Play Again?' : 'Ready to Play?'}
                    </div>
                    <button
                      onClick={startGame}
                      className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors text-lg font-semibold mx-auto"
                    >
                      <Play size={20} />
                      {hasPlayedBefore ? 'Start New Game' : 'Start Game'}
                    </button>
                  </div>
                )}
                
                {gameState === GameState.GAME_OVER && (
                  <div>
                    <div className="text-4xl font-bold mb-4 text-red-400">Game Over!</div>
                    <div className="text-xl mb-2 text-gray-300">Final Score: {stats.score}</div>
                    {stats.score === stats.highScore && stats.score > 0 && (
                      <div className="text-yellow-400 font-bold mb-6">🎉 New High Score!</div>
                    )}
                    <button
                      onClick={resetGame}
                      className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-lg font-semibold mx-auto"
                    >
                      <RotateCcw size={20} />
                      Restart
                    </button>
                  </div>
                )}
                
                {gameState === GameState.PAUSED && (
                  <div className="text-4xl font-bold text-blue-400">PAUSED</div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <GameUI
          gameState={gameState}
          stats={stats}
        />
      </div>
    </div>
  );
};