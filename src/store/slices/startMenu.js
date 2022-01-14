import { createSlice } from '@reduxjs/toolkit';

const INITIAL_STATE = {
  showMenu: true,
};

export const startMenuSlice = createSlice({
  name: 'startMenu',
  initialState: INITIAL_STATE,
  reducers: {
    goToGame: (state) => {
      state.showMenu = false;
    },
  },
});

// Reducer
export default startMenuSlice.reducer;

// Actions

export const { goToGame } = startMenuSlice.actions;

// Selector
export const showMenuSelector = (state) => state.startMenu.showMenu;
