import { createSlice, createSelector } from '@reduxjs/toolkit';
import { getCellIndex, getCellNeighbours } from '../../gameBoard/utils';
import { GAME_STATES } from '../../gameBoard/constants';

const DEFAULT_CELL_STATE = {
  sphereCount: 0,
  playerId: null,
};

const DEFAULT_PLAYER_COUNT = 2;

const INITIAL_GAME_STATE = {
  cells: [],
  playerOccupiedCellCount: Array(DEFAULT_PLAYER_COUNT).fill(0),
  cellsToBeIncremented: 0,
  activePlayer: 0,
  playerCount: DEFAULT_PLAYER_COUNT,
  moveCount: 0,
  endGame: false,
};
export const cellSlice = createSlice({
  name: 'game',
  initialState: INITIAL_GAME_STATE,
  reducers: {
    incrementSphereCount: (state, action) => {
      const { row, col, playerId } = action.payload;

      const cellIndex = getCellIndex(row, col);
      const neighbourCount = getCellNeighbours(row, col).length;

      if (state.cells[cellIndex]) {
        /**
         * Transfer ownership of cell from
         * old player to new player.
         */
        if (
          state.cells[cellIndex].playerId !== playerId &&
          state.cells[cellIndex].playerId !== null
        ) {
          state.playerOccupiedCellCount[state.cells[cellIndex].playerId] -= 1;
          state.playerOccupiedCellCount[playerId] += 1;
        }
      } else {
        state.cells[cellIndex] = { ...DEFAULT_CELL_STATE };
        state.playerOccupiedCellCount[playerId] += 1;
      }

      state.cells[cellIndex].sphereCount += 1;
      state.cells[cellIndex].playerId = playerId;

      if (state.cells[cellIndex].sphereCount >= neighbourCount) {
        state.cellsToBeIncremented += neighbourCount;
      }

      state.cellsToBeIncremented -= 1;
      if (state.cellsToBeIncremented <= 0) {
        state.moveCount += 1;
        if (
          state.moveCount >= state.playerCount &&
          state.playerOccupiedCellCount.some((count) => count <= 0)
        ) {
          // END_GAME
          state.endGame = true;
        }
        state.activePlayer = (state.activePlayer + 1) % state.playerCount;
      }
    },
    explodeCell: (state, action) => {
      const { row, col } = action.payload;

      const cellIndex = getCellIndex(row, col);

      state.playerOccupiedCellCount[state.cells[cellIndex].playerId] -= 1;

      state.cells[cellIndex] = null;
    },
    updateCellsToBeIncremented: (state, { payload: { count } }) => {
      state.cellsToBeIncremented += count;
    },
    endGame: () => INITIAL_GAME_STATE,
  },
});

// Reducer
export default cellSlice.reducer;

// Actions
export const {
  incrementSphereCount,
  explodeCell,
  updateCellsToBeIncremented,
  endGame,
} = cellSlice.actions;

// Selectors
export const cellSelector = (state, row, col) =>
  state.game.cells[getCellIndex(row, col)] ?? DEFAULT_CELL_STATE;

export function filledCellsCountSelector(state) {
  return state.game.cellsToBeIncremented;
}
export function endGameSelector(state) {
  return state.game.endGame;
}

export const gameStateSelector = createSelector(
  filledCellsCountSelector,
  (cellsToBeIncremented) =>
    cellsToBeIncremented > 0 ? GAME_STATES.CAPTURE : GAME_STATES.MOVE
);

export const cellSphereCountSelector = createSelector(
  cellSelector,
  (cell) => cell.sphereCount
);

export const activePlayerSelector = (state) => state.game.activePlayer;
