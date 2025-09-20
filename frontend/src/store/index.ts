import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import lessonReducer from './lessonSlice';
import userReducer from './userSlice';
import notificationReducer from './notificationSlice';
import availabilityReducer from './availabilitySlice';
import adminNotificationsReducer from './adminNotificationsSlice';
import packageReducer from './packageSlice';
import { apiSlice } from '../apiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    lessons: lessonReducer,
    users: userReducer,
    notifications: notificationReducer,
    availability: availabilityReducer,
    adminNotifications: adminNotificationsReducer,
    packages: packageReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;