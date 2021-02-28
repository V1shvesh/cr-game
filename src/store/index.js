import { configureStore } from '@reduxjs/toolkit'
import cellReducer from './slices/cell';

export default configureStore({
  reducer: {
      cell: cellReducer,
  }
})