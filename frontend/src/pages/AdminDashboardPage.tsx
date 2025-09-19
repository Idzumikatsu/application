import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from '@mui/material';
import { BarChart, People, School, Event } from '@mui/icons-material';
import { RootState } from '../store';
import { adminService } from '../services';

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
  }>;
  lastUpdated: string;
}

const AdminDashboardPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const response = await adminService.getDashboardStats();
      setStats(response as unknown as DashboardStats);
      } catch (err: any) {
        setError(err.message || 'Ошибка загрузки статистики');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4">Панель администратора</Typography>
        <Typography variant="body1" color="textSecondary">
          Добро пожаловать, {user?.firstName}! Здесь вы можете управлять всей системой.
        </Typography>
      </Box>

      {stats && (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <People sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                    <Typography variant="h5">{stats.totalStudents}</Typography>
                  </Box>
                  <Typography variant="h6">Всего студентов</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <School sx={{ fontSize: 40, color: 'secondary.main', mr: 2 }} />
                    <Typography variant="h5">{stats.totalTeachers}</Typography>
                  </Box>
                  <Typography variant="h6">Всего преподавателей</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <People sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
                    <Typography variant="h5">{stats.totalManagers}</Typography>
                  </Box>
                  <Typography variant="h6">Всего менеджеров</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Event sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                    <Typography variant="h5">{stats.lessonsToday}</Typography>
                  </Box>
                  <Typography variant="h6">Уроков сегодня</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Студенты с заканчивающимися пакетами
                  </Typography>
                  {stats.studentsEndingSoon && stats.studentsEndingSoon.length > 0 ? (
                    <Grid container spacing={2}>
                      {stats.studentsEndingSoon.map((student) => (
                        <Grid item xs={12} sm={6} key={student.studentId}>
                          <Box 
                            sx={{ 
                              p: 2, 
                              border: '1px solid', 
                              borderColor: 'warning.light', 
                              borderRadius: 1,
                              backgroundColor: 'warning.lighter'
                            }}
                          >
                            <Typography variant="subtitle1">
                              {student.studentName}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              Преподаватель: {student.teacherName}
                            </Typography>
                            <Typography variant="body2">
                              Осталось уроков: {student.remainingLessons} из {student.totalLessons}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Typography color="textSecondary">
                      Нет студентов с заканчивающимися пакетами
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <BarChart sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                    <Typography variant="h6">Статистика</Typography>
                  </Box>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    Уроков на этой неделе: {stats.lessonsThisWeek}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    Активных студентов: {stats.activeStudents}
                  </Typography>
                  <Typography variant="body1">
                    Активных преподавателей: {stats.activeTeachers}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default AdminDashboardPage;