import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import { BarChart, People, School, Event, Refresh } from '@mui/icons-material';

interface StudentEndingSoon {
  studentId: number;
  studentName: string;
  teacherName: string;
  remainingLessons: number;
  totalLessons: number;
  packageEndDate: string;
}

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalManagers: number;
  activeStudents: number;
  activeTeachers: number;
  lessonsToday: number;
  lessonsThisWeek: number;
  studentsEndingSoon: StudentEndingSoon[];
  lastUpdated: string;
}

interface AdminStatsProps {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

const AdminStats: React.FC<AdminStatsProps> = ({ stats, loading, error, onRefresh }) => {
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
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          startIcon={<Refresh />}
          onClick={onRefresh}
        >
          Повторить попытку
        </Button>
      </Box>
    );
  }

  if (!stats) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          Данные статистики недоступны. Попробуйте обновить страницу.
        </Alert>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={onRefresh}
        >
          Обновить данные
        </Button>
      </Box>
    );
  }

  // Use default values for missing fields
  const safeStats = {
    totalStudents: stats.totalStudents || 0,
    totalTeachers: stats.totalTeachers || 0,
    totalManagers: stats.totalManagers || 0,
    activeStudents: stats.activeStudents || 0,
    activeTeachers: stats.activeTeachers || 0,
    lessonsToday: stats.lessonsToday || 0,
    lessonsThisWeek: stats.lessonsThisWeek || 0,
    studentsEndingSoon: stats.studentsEndingSoon || [],
    lastUpdated: stats.lastUpdated || new Date().toISOString(),
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => window.location.hash = '#/admin/students'}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <People sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Typography variant="h5">{safeStats.totalStudents}</Typography>
              </Box>
              <Typography variant="h6">Всего студентов</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => window.location.hash = '#/admin/teachers'}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <School sx={{ fontSize: 40, color: 'secondary.main', mr: 2 }} />
                <Typography variant="h5">{safeStats.totalTeachers}</Typography>
              </Box>
              <Typography variant="h6">Всего преподавателей</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => window.location.hash = '#/admin/managers'}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <People sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
                <Typography variant="h5">{safeStats.totalManagers}</Typography>
              </Box>
              <Typography variant="h6">Всего менеджеров</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => window.location.hash = '#/admin/lessons'}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Event sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                <Typography variant="h5">{safeStats.lessonsToday}</Typography>
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
              
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                <Button 
                  variant="outlined" 
                  startIcon={<Refresh />} 
                  onClick={onRefresh}
                >
                  Обновить
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminStats;
