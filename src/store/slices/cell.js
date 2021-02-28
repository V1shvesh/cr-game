import { createSlice } from '@reduxjs/toolkit';
import { getCellIndex } from '../../utils';

const DEFAULT_CELL_STATE = {
    sphereCount: 0,
    playerId: null,
}

export const cellSlice = createSlice({
    name: 'cell',
    initialState: [],
    reducers: {
    incrementSphereCount: (state, action) => {
        const {
            row, col, playerId
        } = action.payload;

        const cellIndex = getCellIndex(row, col);

        if(!state[cellIndex]) {
            state[cellIndex] = Object.assign({}, DEFAULT_CELL_STATE);
        }

        state[cellIndex].sphereCount += 1;
        state[cellIndex].playerId = playerId;
        
    },
    resetCell: (state, action) => {
        const {
            row, col
        } = action.payload;

        const cellIndex = getCellIndex(row, col);

        state[cellIndex] = DEFAULT_CELL_STATE;
    }
  }
});

export const { incrementSphereCount, resetCell } = cellSlice.actions

export default cellSlice.reducer