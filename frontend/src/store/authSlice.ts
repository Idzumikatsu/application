import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types';
import AuthService from '../services/authService';
import { LoginResponse } from '../types';

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

// Union type for payload: nested {user, token} or flat API response
type CredentialsPayload = { user: User; token: string } | { id: number; firstName: string; lastName: string; email: string; role: string; token: string; isActive?: boolean };

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
      // Clear tokens from localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      // Remove authorization header from httpClient
      // Authorization header is now handled in httpClient.ts
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    setCredentials: (state, action: PayloadAction<CredentialsPayload>) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      const payload = action.payload as any; // Type assertion for flat handling
      if (payload.user) {
        state.user = payload.user;
      } else {
        // Handle flat response from API
        state.user = {
          id: payload.id || 0,
          firstName: payload.firstName || '',
          lastName: payload.lastName || '',
          email: payload.email || '',
          role: payload.role || '',
          isActive: payload.isActive !== undefined ? payload.isActive : true,
        };
      }
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
        state.token = action.payload.token;
        const payload = action.payload as any; // Type assertion for flat handling
        if (payload.user) {
          state.user = payload.user;
        } else {
          // Handle flat response from API
          state.user = {
            id: payload.id || 0,
            firstName: payload.firstName || '',
            lastName: payload.lastName || '',
            email: payload.email || '',
            role: payload.role || '',
            isActive: payload.isActive !== undefined ? payload.isActive : true,
          };
        }
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        console.error('❌ Login rejected:', action.payload);
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, setUser, setCredentials } = authSlice.actions;

export default authSlice.reducer;