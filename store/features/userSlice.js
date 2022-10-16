import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: {},
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearUser: state => {
      state.user = {};
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUser } = userSlice.actions;

export default userSlice.reducer;
