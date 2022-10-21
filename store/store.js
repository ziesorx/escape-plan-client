import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
// modules
import userReducer from './features/userSlice';
import roomReducer from './features/roomSlice';

const reducers = combineReducers({
  user: userReducer,
  room: roomReducer,
});

export const store = configureStore({
  reducer: reducers,
});
