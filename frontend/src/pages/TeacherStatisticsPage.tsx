import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  CircularProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  Event as EventIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { RootState } from '../store';
import { TeacherStats } from '../types';

const TeacherStatisticsPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [stats, setStats] = useState<TeacherStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStatistics = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // В реальной реализации здесь будет вызов API
      // const data = await LessonService.getTeacherStatistics(user.id);
      
      // Демо данные
      const demoStats: TeacherStats = {
        totalLessons: 156,
        completedLessons: 132,
        cancelledLessons: 12,
        missedLessons: 8,
        averageRating: 4.8,
        totalStudents: 24,
        upcomingLessons: 7,
      };
      
      setStats(demoStats);
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки статистики');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.id) {
      loadStatistics();
    }
  }, [user?.id, loadStatistics]);
  const getCompletionRate = () => {
    if (!stats || stats.totalLessons === 0) return 0;
    return Math.round((stats.completedLessons / stats.totalLessons) * 100);
  };

  const getCancellationRate = () => {
    if (!stats || stats.totalLessons === 0) return 0;
    return Math.round(((stats.cancelledLessons + stats.missedLessons) / stats.totalLessons) * 100);
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!stats) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Нет данных для отображения</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Статистика преподавателя
      </Typography>
      
      <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
        Анализ вашей преподавательской деятельности
      </Typography>

      <Grid container spacing={3}>
        {/* Основные метрики */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📊 Общая статистика
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <EventIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Всего уроков" 
                    secondary={stats.totalLessons}
                  />
                </ListItem>
                
                <Divider />
                
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Проведено уроков" 
                    secondary={`${stats.completedLessons} (${getCompletionRate()}%)`}
                  />
                </ListItem>
                
                <Divider />
                
                <ListItem>
                  <ListItemIcon>
                    <CancelIcon color="error" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Отменено/пропущено" 
                    secondary={`${stats.cancelledLessons + stats.missedLessons} (${getCancellationRate()}%)`}
                  />
                </ListItem>
                
                <Divider />
                
                <ListItem>
                  <ListItemIcon>
                    <PersonIcon color="secondary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Всего студентов" 
                    secondary={stats.totalStudents}
                  />
                </ListItem>
                
                <Divider />
                
                <ListItem>
                  <ListItemIcon>
                    <ScheduleIcon color="info" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Предстоящие уроки" 
                    secondary={stats.upcomingLessons}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Детализированная статистика */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📈 Детализированная статистика
              </Typography>
              
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.light', color: 'white' }}>
                    <Typography variant="h4">{stats.completedLessons}</Typography>
                    <Typography variant="body2">Проведено</Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'error.light', color: 'white' }}>
                    <Typography variant="h4">{stats.cancelledLessons}</Typography>
                    <Typography variant="body2">Отменено</Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.light', color: 'white' }}>
                    <Typography variant="h4">{stats.missedLessons}</Typography>
                    <Typography variant="body2">Пропущено</Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'info.light', color: 'white' }}>
                    <Typography variant="h4">{stats.upcomingLessons}</Typography>
                    <Typography variant="body2">Запланировано</Typography>
                  </Paper>
                </Grid>
              </Grid>
              
              {stats.averageRating && (
                <Box sx={{ mt: 3, p: 2, bgcolor: 'primary.main', color: 'white', borderRadius: 1 }}>
                  <Typography variant="h6" align="center">
                    ⭐ Средний рейтинг: {stats.averageRating}/5
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Еженедельная статистика */}
        <Grid item xs={12}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📅 Еженедельная активность
              </Typography>
              
              <Grid container spacing={2}>
                {[
                  { week: 'Текущая неделя', lessons: 8, completed: 7 },
                  { week: 'Прошлая неделя', lessons: 12, completed: 10 },
                  { week: '2 недели назад', lessons: 10, completed: 9 },
                ].map((weekData, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="subtitle2">{weekData.week}</Typography>
                      <Typography variant="h6" color="primary">
                        {weekData.lessons} уроков
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {weekData.completed} проведено
                      </Typography>
                      <Chip 
                        label={`${Math.round((weekData.completed / weekData.lessons) * 100)}%`}
                        color="success"
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TeacherStatisticsPage;