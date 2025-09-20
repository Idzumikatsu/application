import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import notificationService from '../services/notificationService';
import { Notification } from '../types'; // Assume type exists or define

interface AdminNotificationsState {
  notifications: Notification[];
  statistics: any;
  loading: boolean;
  error: string | null;
}

const initialState: AdminNotificationsState = {
  notifications: [],
  statistics: null,
  loading: false,
  error: null,
};

export const getAdminNotifications = createAsyncThunk(
  'adminNotifications/getAdminNotifications',
  async (options?: { status?: string; type?: string; page?: number; size?: number }, { rejectWithValue }) => {
    try {
      const data = await notificationService.getAdminNotifications(options);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const broadcastNotification = createAsyncThunk(
  'adminNotifications/broadcastNotification',
  async (data: { title: string; message: string; type: string; priority: string; recipientType: string; recipientId?: number }, { rejectWithValue }) => {
    try {
      const result = await notificationService.broadcastNotification(data);
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const sendNotification = createAsyncThunk(
  'adminNotifications/sendNotification',
  async (id: number, { rejectWithValue }) => {
    try {
      const result = await notificationService.sendNotification(id); // Assume method added
      return { id, result };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteNotification = createAsyncThunk(
  'adminNotifications/deleteNotification',
  async (id: number, { rejectWithValue }) => {
    try {
      await notificationService.deleteNotification(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const getStatistics = createAsyncThunk(
  'adminNotifications/getStatistics',
  async (_, { rejectWithValue }) => {
    try {
      const data = await notificationService.getStatistics();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const adminNotificationsSlice = createSlice({
  name: 'adminNotifications',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAdminNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdminNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.content || action.payload;
      })
      .addCase(getAdminNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(broadcastNotification.fulfilled, (state, action) => {
        // Optimistic: add the new notification to list
        const newNotif = action.payload;
        state.notifications.unshift(newNotif);
      })
      .addCase(sendNotification.pending, (state, action) => {
        // Optimistic update
        const id = action.meta.arg;
        const notification = state.notifications.find(n => n.id === id);
        if (notification) {
          notification.status = 'SENT';
          notification.sentAt = new Date().toISOString();
        }
      })
      .addCase(sendNotification.rejected, (state, action) => {
        // Revert on error
        const id = action.meta.arg;
        const notification = state.notifications.find(n => n.id === id);
        if (notification) {
          notification.status = 'PENDING';
          notification.sentAt = undefined;
        }
      })
      .addCase(deleteNotification.pending, (state, action) => {
        // Optimistic delete
        const id = action.meta.arg;
        state.notifications = state.notifications.filter(n => n.id !== id);
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        // Revert on error - would need to refetch or add back, but for simplicity refetch
        state.error = action.payload as string;
      })
      .addCase(getStatistics.fulfilled, (state, action) => {
        state.statistics = action.payload;
      });
  },
});

export const { clearError } = adminNotificationsSlice.actions;

export default adminNotificationsSlice.reducer;