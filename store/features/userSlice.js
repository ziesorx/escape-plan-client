import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: {},
  opponent: {},
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
    },
    clearUser: (state) => {
      state.user = {}
    },
    setOpponent: (state, action) => {
      state.opponent = action.payload
    },
    clearOpponent: (state) => {
      state.opponent = {}
    },
  },
})

// Action creators are generated for each case reducer function
export const { setUser, clearUser, setOpponent, clearOpponent } =
  userSlice.actions

export default userSlice.reducer
