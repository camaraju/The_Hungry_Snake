import React, { useRef, useEffect } from 'react';
import { Position } from '../types/game';
import { GRID_SIZE, CANVAS_WIDTH, CANVAS_HEIGHT } from '../utils/gameUtils';

interface GameCanvasProps {
  snake: Position[];
  food: Position;
  className?: string;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ snake, food, className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw grid lines (subtle)
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 1;
    for (let i = 0; i <= CANVAS_WIDTH; i += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, CANVAS_HEIGHT);
      ctx.stroke();
    }
    for (let i = 0; i <= CANVAS_HEIGHT; i += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(CANVAS_WIDTH, i);
      ctx.stroke();
    }

    // Draw snake
    snake.forEach((segment, index) => {
      const x = segment.x * GRID_SIZE;
      const y = segment.y * GRID_SIZE;

      if (index === 0) {
        // Snake head - brighter green with gradient
        const gradient = ctx.createRadialGradient(
          x + GRID_SIZE / 2, y + GRID_SIZE / 2, 2,
          x + GRID_SIZE / 2, y + GRID_SIZE / 2, GRID_SIZE / 2
        );
        gradient.addColorStop(0, '#00ff41');
        gradient.addColorStop(1, '#00cc33');
        ctx.fillStyle = gradient;
      } else {
        // Snake body - darker green
        ctx.fillStyle = '#00aa22';
      }

      ctx.fillRect(x + 1, y + 1, GRID_SIZE - 2, GRID_SIZE - 2);

      // Add border to snake segments
      ctx.strokeStyle = '#00ff41';
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 1, y + 1, GRID_SIZE - 2, GRID_SIZE - 2);
    });

    // Draw food with pulsing effect
    const foodX = food.x * GRID_SIZE;
    const foodY = food.y * GRID_SIZE;
    
    const gradient = ctx.createRadialGradient(
      foodX + GRID_SIZE / 2, foodY + GRID_SIZE / 2, 2,
      foodX + GRID_SIZE / 2, foodY + GRID_SIZE / 2, GRID_SIZE / 2
    );
    gradient.addColorStop(0, '#ff4444');
    gradient.addColorStop(1, '#cc0000');
    ctx.fillStyle = gradient;
    
    ctx.beginPath();
    ctx.arc(foodX + GRID_SIZE / 2, foodY + GRID_SIZE / 2, GRID_SIZE / 2 - 2, 0, 2 * Math.PI);
    ctx.fill();

    // Food border
    ctx.strokeStyle = '#ff6666';
    ctx.lineWidth = 2;
    ctx.stroke();

  }, [snake, food]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      className={className}
    />
  );
};