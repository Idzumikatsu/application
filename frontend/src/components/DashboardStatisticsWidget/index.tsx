import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Grid,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Event as EventIcon,
  CheckCircle as CheckCircleIcon,
  Group as GroupIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface StatisticsData {
  totalStudents: number;
  totalTeachers: number;
  lessonsToday: number;
  lessonsThisWeek: number;
  lessonsThisMonth: number;
  completedLessons: number;
  cancelledLessons: number;
  attendanceRate: number;
  cancellationRate: number;
  newStudentsThisWeek: number;
  newTeachersThisWeek: number;
  revenueThisMonth: number;
  activePackages: number;
  expiringPackages: number;
}

const DashboardStatisticsWidget: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [statistics, setStatistics] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadStatistics();
    }
  }, [user?.id]);

  const loadStatistics = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call to fetch statistics
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Demo data - in real implementation, fetch from API
      const demoStats: StatisticsData = {
        totalStudents: 156,
        totalTeachers: 24,
        lessonsToday: 42,
        lessonsThisWeek: 218,
        lessonsThisMonth: 892,
        completedLessons: 785,
        cancelledLessons: 45,
        attendanceRate: 92.5,
        cancellationRate: 7.2,
        newStudentsThisWeek: 12,
        newTeachersThisWeek: 2,
        revenueThisMonth: 356800,
        activePackages: 142,
        expiringPackages: 8,
      };

      setStatistics(demoStats);
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки статистики');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(amount);
  };


  if (loading) {
    return (
      <Card elevation={3}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card elevation={3}>
        <CardContent>
          <Alert severity="error">{error}</Alert>
        </CardContent>
      </Card>
    );
  }

  if (!statistics) {
    return (
      <Card elevation={3}>
        <CardContent>
          <Alert severity="warning">Нет данных для отображения</Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card elevation={3}>
      <CardHeader
        title="Статистика системы"
        subheader="Обзор ключевых показателей эффективности"
      />
      
      <CardContent>
        <Grid container spacing={3}>
          {/* Students Statistics */}
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <PersonIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" color="primary" gutterBottom>
                {statistics.totalStudents}
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                Всего студентов
              </Typography>
              <Chip 
                label={`+${statistics.newStudentsThisWeek} за неделю`}
                color="success"
                size="small"
                icon={<TrendingUpIcon />}
              />
            </Box>
          </Grid>

          {/* Teachers Statistics */}
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <SchoolIcon color="secondary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" color="secondary" gutterBottom>
                {statistics.totalTeachers}
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                Всего преподавателей
              </Typography>
              <Chip 
                label={`+${statistics.newTeachersThisWeek} за неделю`}
                color="success"
                size="small"
                icon={<TrendingUpIcon />}
              />
            </Box>
          </Grid>

          {/* Lessons Statistics */}
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <EventIcon color="info" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" color="info" gutterBottom>
                {statistics.lessonsToday}
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                Уроков сегодня
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                <Chip 
                  label={`${statistics.lessonsThisWeek}/нед`}
                  color="info"
                  size="small"
                  variant="outlined"
                />
                <Chip 
                  label={`${statistics.lessonsThisMonth}/мес`}
                  color="info"
                  size="small"
                  variant="outlined"
                />
              </Box>
            </Box>
          </Grid>

          {/* Attendance Statistics */}
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <CheckCircleIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" color="success" gutterBottom>
                {statistics.attendanceRate}%
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                Посещаемость
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                <Chip 
                  label={`${statistics.completedLessons} завершено`}
                  color="success"
                  size="small"
                  variant="outlined"
                />
                <Chip 
                  label={`${statistics.cancelledLessons} отменено`}
                  color="error"
                  size="small"
                  variant="outlined"
                />
              </Box>
            </Box>
          </Grid>

          {/* Packages Statistics */}
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <GroupIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" color="warning" gutterBottom>
                {statistics.activePackages}
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                Активных пакетов
              </Typography>
              {statistics.expiringPackages > 0 ? (
                <Chip 
                  label={`${statistics.expiringPackages} заканчивается`}
                  color="warning"
                  size="small"
                  icon={<TrendingDownIcon />}
                />
              ) : (
                <Chip 
                  label="Все пакеты активны"
                  color="success"
                  size="small"
                  icon={<CheckCircleIcon />}
                />
              )}
            </Box>
          </Grid>

          {/* Revenue Statistics */}
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <TrendingUpIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" color="success" gutterBottom>
                {formatCurrency(statistics.revenueThisMonth)}
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                Доход за месяц
              </Typography>
              <Chip 
                label="+15% к прошлому месяцу"
                color="success"
                size="small"
                icon={<TrendingUpIcon />}
              />
            </Box>
          </Grid>

          {/* Performance Statistics */}
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <TrendingUpIcon color="info" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" color="info" gutterBottom>
                {statistics.attendanceRate}%
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                Эффективность
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                <Chip 
                  label={`Отмены: ${statistics.cancellationRate}%`}
                  color="error"
                  size="small"
                  variant="outlined"
                />
              </Box>
            </Box>
          </Grid>

          {/* System Health */}
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <CheckCircleIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" color="success" gutterBottom>
                99.9%
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                Доступность системы
              </Typography>
              <Chip 
                label="Стабильная работа"
                color="success"
                size="small"
                icon={<CheckCircleIcon />}
              />
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="body2" color="textSecondary" align="center">
            📊 Статистика обновляется в реальном времени. Последнее обновление: {new Date().toLocaleString('ru-RU')}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DashboardStatisticsWidget;