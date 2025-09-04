import React from 'react';
import { Trophy } from 'lucide-react';
import { GameState, GameStats } from '../types/game';

interface GameUIProps {
  gameState: GameState;
  stats: GameStats;
}

export const GameUI: React.FC<GameUIProps> = ({ gameState, stats }) => {
  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold text-green-400 mb-4">The Hungry Snake</h2>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-sm text-gray-400">Score</div>
          <div className="text-xl font-bold text-green-400">{stats.score}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-400">Level</div>
          <div className="text-xl font-bold text-blue-400">{stats.level}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-400 flex items-center justify-center gap-1">
            <Trophy size={14} />
            High Score
          </div>
          <div className="text-xl font-bold text-yellow-400">{stats.highScore}</div>
        </div>
      </div>

      {gameState === GameState.PAUSED && (
        <div className="text-center py-4 bg-blue-900 rounded-lg border border-blue-600">
          <h3 className="text-xl font-bold text-blue-400">Game Paused</h3>
          <p className="text-gray-300">Press Resume to continue</p>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-400">
        <h4 className="font-semibold mb-2">Controls:</h4>
        <div className="space-y-1">
          <p>↑ ↓ ← → Arrow keys to move</p>
          <p>Space to pause/resume</p>
          <p>R to restart</p>
        </div>
      </div>
    </div>
  );
};