import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types';
import AuthService from '../services/authService';

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await AuthService.login({ email, password });
      return response;
    } catch (error: any) {
      console.error('Login thunk error:', error);
      return rejectWithValue(error.response?.data?.message || error.message || 'Login failed');
    }
  }
);

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log('🔄 Login pending...');
      })
      .addCase(login.fulfilled, (state, action) => {
        console.log('✅ Login fulfilled, user data:', action.payload);
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        console.error('❌ Login rejected:', action.payload);
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, setUser } = authSlice.actions;

export default authSlice.reducer;