import { createSlice, createSelector } from '@reduxjs/toolkit';
import { getCellIndex, getCellNeighbours } from '../../utils';
import { GAME_STATES } from '../../constants';

const DEFAULT_CELL_STATE = {
    sphereCount: 0,
    playerId: 0,
}

export const cellSlice = createSlice({
    name: 'game',
    initialState: {
        cells: [],
        cellsToBeIncremented: 0,
        activePlayer: 1,
        playerCount: 3,
    },
    reducers: {
    incrementSphereCount: (state, action) => {
        const {
            row, col, playerId
        } = action.payload;

        const cellIndex = getCellIndex(row, col);
        const neighbourCount = getCellNeighbours(row, col).length;

        if(!state.cells[cellIndex]) {
            state.cells[cellIndex] = Object.assign({}, DEFAULT_CELL_STATE);
        }

        state.cells[cellIndex].sphereCount += 1;
        state.cellsToBeIncremented -= 1;

        if(state.cells[cellIndex].sphereCount >= neighbourCount) {
            state.cellsToBeIncremented += neighbourCount
        }

        if(state.cellsToBeIncremented <= 0) {
            state.activePlayer = (state.activePlayer % state.playerCount) + 1
        }

        state.cells[cellIndex].playerId = playerId;
        
    },
    explodeCell: (state, action) => {
        const {
            row, col
        } = action.payload;

        const cellIndex = getCellIndex(row, col);
        state.cells[cellIndex] = DEFAULT_CELL_STATE;
    },
    updateCellsToBeIncremented: (state, { payload: {count} }) => {
        state.cellsToBeIncremented += count;
    }
  }
});

// Reducer
export default cellSlice.reducer

// Actions
export const { incrementSphereCount, explodeCell, updateCellsToBeIncremented } = cellSlice.actions

// Selectors
export const cellSelector = (state, row, col) => (
    state.game.cells[getCellIndex(row, col)] ?? DEFAULT_CELL_STATE
);

export function filledCellsCountSelector(state) {
    return state.game.cellsToBeIncremented;
}

export const gameStateSelector = createSelector(
    filledCellsCountSelector,
    cellsToBeIncremented => (
        cellsToBeIncremented > 0 ? GAME_STATES.CAPTURE : GAME_STATES.MOVE
    ),
)

export const cellSphereCountSelector = createSelector(
    cellSelector,
    cell => cell.sphereCount,
);    

export const activePlayerSelector = (state) => state.game.activePlayer;
