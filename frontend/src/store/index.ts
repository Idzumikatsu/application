import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '../apiSlice';
import authReducer from './authSlice';
import userReducer from './userSlice';
import lessonReducer from './lessonSlice';
import availabilityReducer from './availabilitySlice';
import notificationReducer from './notificationSlice';
import packageReducer from './packageSlice';
import adminNotificationsReducer from './adminNotificationsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    lessons: lessonReducer,
    availability: availabilityReducer,
    notifications: notificationReducer,
    adminNotifications: adminNotificationsReducer,
    packages: packageReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;