import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './slices/gameBoard';
import startMenuReducer from './slices/startMenu';

export default configureStore({
  reducer: {
    game: gameReducer,
    startMenu: startMenuReducer,
  },
});
