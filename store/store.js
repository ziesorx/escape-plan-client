import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
// modules
import userReducer from './features/userSlice';

const reducers = combineReducers({
  user: userReducer,
});

export const store = configureStore({
  reducer: reducers,
});
