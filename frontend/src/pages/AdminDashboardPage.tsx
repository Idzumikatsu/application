import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { RootState } from '@/store';
import AdminStats from '@/components/Admin/AdminStats';
import adminService from '@/services/adminService';
import { DashboardStats as ApiDashboardStats } from '@/types';

// Define the local interface that matches what AdminStats expects
interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalManagers: number;
  activeStudents: number;
  activeTeachers: number;
  lessonsToday: number;
  lessonsThisWeek: number;
  studentsEndingSoon: Array<{
    studentId: number;
    studentName: string;
    teacherName: string;
    remainingLessons: number;
    totalLessons: number;
    packageEndDate: string;
  }>;
  lastUpdated: string;
}

const AdminDashboardPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Fetching dashboard stats...');
      
      // Fetch real dashboard stats from the backend API
      const apiStats: ApiDashboardStats = await adminService.getDashboardStats();
      
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
      console.log('✅ Dashboard stats loaded successfully');
    } catch (err: any) {
      console.error('❌ Error loading dashboard stats:', err);
      setError(err.message || 'Ошибка загрузки статистики');
    } finally {
      setLoading(false);
    }
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
        loading={loading} 
        error={error} 
        onRefresh={fetchDashboardStats} 
      />
    </Box>
  );
};

export default AdminDashboardPage;