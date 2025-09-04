import { Position, Direction } from '../types/game';

export const GRID_SIZE = 20;
export const CANVAS_WIDTH = 600;
export const CANVAS_HEIGHT = 600;
export const INITIAL_SNAKE_LENGTH = 3;
export const BASE_SPEED = 150; // milliseconds

export const getRandomPosition = (): Position => ({
  x: Math.floor(Math.random() * (CANVAS_WIDTH / GRID_SIZE)),
  y: Math.floor(Math.random() * (CANVAS_HEIGHT / GRID_SIZE))
});

export const checkCollision = (pos1: Position, pos2: Position): boolean => 
  pos1.x === pos2.x && pos1.y === pos2.y;

export const isOutOfBounds = (position: Position): boolean =>
  position.x < 0 || 
  position.x >= CANVAS_WIDTH / GRID_SIZE || 
  position.y < 0 || 
  position.y >= CANVAS_HEIGHT / GRID_SIZE;

export const getNextPosition = (head: Position, direction: Direction): Position => {
  switch (direction) {
    case Direction.UP:
      return { x: head.x, y: head.y - 1 };
    case Direction.DOWN:
      return { x: head.x, y: head.y + 1 };
    case Direction.LEFT:
      return { x: head.x - 1, y: head.y };
    case Direction.RIGHT:
      return { x: head.x + 1, y: head.y };
    default:
      return head;
  }
};

export const isOppositeDirection = (current: Direction, new_: Direction): boolean => {
  const opposites: Record<Direction, Direction> = {
    [Direction.UP]: Direction.DOWN,
    [Direction.DOWN]: Direction.UP,
    [Direction.LEFT]: Direction.RIGHT,
    [Direction.RIGHT]: Direction.LEFT
  };
  return opposites[current] === new_;
};

export const calculateSpeed = (level: number): number => 
  Math.max(BASE_SPEED - (level * 10), 80);