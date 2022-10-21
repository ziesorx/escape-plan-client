import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentRoom: null,
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
  },
});

// Action creators are generated for each case reducer function
export const { setCurrentRoom, clearCurrentRoom } = roomSlice.actions;

export default roomSlice.reducer;
