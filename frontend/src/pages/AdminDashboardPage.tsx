import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { RootState } from '@/store';
import { useGetDashboardStatsQuery } from '@/apiSlice';
import AdminStats from '@/components/Admin/AdminStats';
import { DashboardStats } from '@/types';

const AdminDashboardPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  const { data: apiStats, isLoading, error, refetch } = useGetDashboardStatsQuery(undefined);

  React.useEffect(() => {
    if (apiStats) {
      // Transform the data to match the expected interface
      const transformedStats: DashboardStats = {
        totalStudents: apiStats.totalStudents,
        totalTeachers: apiStats.totalTeachers,
        totalManagers: 0, // This field doesn't exist in the API response
        activeStudents: 0, // This field doesn't exist in the API response
        activeTeachers: 0, // This field doesn't exist in the API response
        lessonsToday: 0, // This field doesn't exist in the API response
        lessonsThisWeek: 0, // This field doesn't exist in the API response
        studentsEndingSoon: [], // This field doesn't exist in the API response
        lastUpdated: new Date().toISOString() // This field doesn't exist in the API response
      };
      setStats(transformedStats);
    }
  }, [apiStats]);

  React.useEffect(() => {
    if (error) {
      toast.error((error as any)?.data?.message || 'Ошибка загрузки статистики дашборда');
    }
  }, [error]);

  const handleRefresh = () => {
    refetch();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4">Панель администратора</Typography>
        <Typography variant="body1" color="textSecondary">
          Добро пожаловать, {user?.firstName}! Здесь вы можете управлять всей системой.
        </Typography>
      </Box>

      <AdminStats 
        stats={stats} 
        loading={isLoading} 
        error={error ? (error as any)?.data?.message || 'Ошибка загрузки' : null} 
        onRefresh={handleRefresh} 
      />
    </Box>
  );
};

export default AdminDashboardPage;
