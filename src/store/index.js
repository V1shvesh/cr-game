import { configureStore } from '@reduxjs/toolkit'
import gameReducer from './slices/game';

export default configureStore({
  reducer: {
      game: gameReducer,
  }
})