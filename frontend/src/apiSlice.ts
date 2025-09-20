import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store'; // Assuming store.ts exists with RootState type

const baseQuery = fetchBaseQuery({
  baseUrl: '/api',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token; // Assuming auth slice has token
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['User', 'Notification', 'Settings', 'Lessons', 'Report', 'Dashboard', 'Auth'],
  endpoints: (builder) => ({
    // Auth endpoints for login and MFA
    login: builder.mutation({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
    verifyMfa: builder.mutation({
      query: ({ token, otp }) => ({
        url: 'auth/verify-mfa',
        method: 'POST',
        body: { token, otp },
      }),
      invalidatesTags: ['Auth'],
    }),

    // Admin endpoints
    getDashboardStats: builder.query({
      query: () => 'admin/dashboard/stats',
      providesTags: ['Dashboard'],
    }),
    getUsers: builder.query({
      query: () => 'admin/users',
      providesTags: ['User'],
    }),
    generateReport: builder.mutation({
      query: (data) => ({
        url: 'admin/reports/generate',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Report'],
    }),
    broadcastNotification: builder.mutation({
      query: (data) => ({
        url: 'admin/notifications/broadcast',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Notification'],
    }),
    getSystemSettings: builder.query({
      query: () => 'admin/settings',
      providesTags: ['Settings'],
    }),
    updateSettings: builder.mutation({
      query: (data) => ({
        url: 'admin/settings',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Settings'],
    }),
    getLessons: builder.query({
      query: () => 'admin/lessons',
      providesTags: ['Lessons'],
    }),
    changeLessonStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `admin/lessons/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Lessons'],
    }),
  }),
});

export const {
  useLoginMutation,
  useVerifyMfaMutation,
  useGetDashboardStatsQuery,
  useGetUsersQuery,
  useGenerateReportMutation,
  useBroadcastNotificationMutation,
  useGetSystemSettingsQuery,
  useUpdateSettingsMutation,
  useGetLessonsQuery,
  useChangeLessonStatusMutation,
} = apiSlice;