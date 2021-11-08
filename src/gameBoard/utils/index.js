import { DIRECTIONS, PLAYER_COLORS } from '../constants';

export const getCellIndex = (row, col) => row * 16 + col;

export const getCellNeighbours = (row, col) => {
  const neighbours = [];
  if (row > 0) {
    neighbours.push(DIRECTIONS.UP);
  }

  if (row < 10) {
    neighbours.push(DIRECTIONS.DOWN);
  }

  if (col > 0) {
    neighbours.push(DIRECTIONS.LEFT);
  }

  if (col < 5) {
    neighbours.push(DIRECTIONS.RIGHT);
  }

  return neighbours;
};

export const getPlayerColor = (playerId) => PLAYER_COLORS[playerId];
