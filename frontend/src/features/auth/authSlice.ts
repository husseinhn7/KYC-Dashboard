import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { UserRole } from '../../types';


interface AuthState {
  token: string | null;
  role: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: Cookies.get('accessToken') || null,
  role: Cookies.get('role') as UserRole | null,
  isAuthenticated: Cookies.get("accessToken") ? true : false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ accessToken: string; role: string }>) => {
      state.token = action.payload.accessToken;
      state.role = action.payload.role;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      Cookies.remove('accessToken');
      Cookies.remove('role');
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
      window.location.href = '/login';
    },
    updateUser: (state, action: PayloadAction<{ token?: string; role?: string; isAuthenticated?: boolean }>) => {
      if (action.payload.token) state.token = action.payload.token;
      if (action.payload.role) state.role = action.payload.role;
      if (action.payload.isAuthenticated) state.isAuthenticated = action.payload.isAuthenticated;
    },  
  },
});

export const { loginSuccess, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;