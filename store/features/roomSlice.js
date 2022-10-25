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
    clearCurrentRoom: (state) => {
      state.currentRoom = null;
    },
    setCurrentPlayer: (state, action) => {
      state.currentPlayer = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setCurrentRoom, clearCurrentRoom, setCurrentPlayer } =
  roomSlice.actions;

export default roomSlice.reducer;
