import React, { useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  CircularProgress,
} from '@mui/material';
import {
  People as PeopleIcon,
  School as SchoolIcon,
  Event as EventIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import StatCard from '../StatCard';
import { loadDashboardStats } from '../../store/dashboardSlice';
import { DashboardStats } from '../../types';

const DashboardStatsWidget: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { stats, loading, error } = useSelector((state: RootState) => state.dashboard);
  
  useEffect(() => {
    dispatch(loadDashboardStats());
  }, [dispatch]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <Typography color="error">Ошибка загрузки статистики: {error}</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Всего студентов"
          value={stats?.totalStudents || 0}
          icon={<PeopleIcon />}
          color="primary"
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Всего преподавателей"
          value={stats?.totalTeachers || 0}
          icon={<SchoolIcon />}
          color="secondary"
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Запланировано занятий"
          value={stats?.scheduledLessons || 0}
          icon={<EventIcon />}
          color="info"
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Завершено занятий"
          value={stats?.completedLessons || 0}
          icon={<CheckCircleIcon />}
          color="success"
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Отменено занятий"
          value={stats?.cancelledLessons || 0}
          icon={<CancelIcon />}
          color="error"
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Доступные слоты"
          value={stats?.availableSlots || 0}
          icon={<AccessTimeIcon />}
          color="warning"
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Забронированные слоты"
          value={stats?.bookedSlots || 0}
          icon={<AssignmentIcon />}
          color="primary"
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Непрочитанные уведомления"
          value={stats?.unreadNotifications || 0}
          icon={<EventIcon />}
          color="secondary"
        />
      </Grid>
    </Grid>
  );
};

export default DashboardStatsWidget;