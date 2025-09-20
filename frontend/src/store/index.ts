import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import lessonReducer from './lessonSlice';
import { apiSlice } from '../apiSlice'; // Note: path might need adjustment if apiSlice is in src/apiSlice.ts

// Add other reducers as needed, e.g., adminNotificationsReducer, etc.

export const store = configureStore({
  reducer: {
    auth: authReducer,
    lessons: lessonReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;