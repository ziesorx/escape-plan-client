import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentRoom: null,
  currentPlayer: null,
};

const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    setCurrentRoom: (state, action) => {
      state.currentRoom = action.payload;
    },
    clearCurrentRoom: state => {
      state.currentRoom = null;
    },
    setCurrentPlayer: (state, action) => {
      state.currentPlayer = action.payload;
    },
    clearCurrentPlayer: state => {
      state.currentPlayer = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setCurrentRoom,
  clearCurrentRoom,
  setCurrentPlayer,
  clearCurrentPlayer,
} = roomSlice.actions;

export default roomSlice.reducer;
