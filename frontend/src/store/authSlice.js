import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  user: null, // store user data here
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.token = action.payload.token;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },
    register(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.token = action.payload.token
    }
  },
});

export const { login, logout, register } = authSlice.actions;
export default authSlice.reducer;
