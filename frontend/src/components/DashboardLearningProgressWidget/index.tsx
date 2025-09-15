import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider,
  CircularProgress,
  Button,
  LinearProgress,
  Rating,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  School as SchoolIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { setLessons, setGroupLessons, setLoading, setError } from '../../store/lessonSlice';
import LessonService from '../../services/lessonService';
import { Lesson, LessonStatus, GroupLesson, GroupLessonStatus } from '../../types';

interface LearningProgress {
  totalLessons: number;
  completedLessons: number;
  attendanceRate: number;
  currentStreak: number;
  longestStreak: number;
  subjects: Array<{
    name: string;
    completed: number;
    total: number;
    progress: number;
  }>;
}

const DashboardLearningProgressWidget: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { loading, error } = useSelector((state: RootState) => state.lessons);
  const [progress, setProgress] = useState<LearningProgress>({
    totalLessons: 0,
    completedLessons: 0,
    attendanceRate: 0,
    currentStreak: 0,
    longestStreak: 0,
    subjects: [],
  });

  useEffect(() => {
    const loadLearningProgress = async () => {
      if (!user?.id || user.role !== 'STUDENT') return;
      
      dispatch(setLoading(true));
      try {
        // Load student's lessons
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 3); // Last 3 months
        const endDate = new Date();
        
        const studentLessons = await LessonService.getStudentLessons(
          user.id,
          startDate.toISOString().split('T')[0],
          endDate.toISOString().split('T')[0]
        );
        
        const studentGroupLessons = (await LessonService.getStudentGroupLessons(
          user.id,
          0,
          100,
          startDate.toISOString().split('T')[0],
          endDate.toISOString().split('T')[0]
        )).content;
        
        dispatch(setLessons(studentLessons));
        dispatch(setGroupLessons(studentGroupLessons));
        
        // Calculate progress metrics
        const allLessons = [...studentLessons, ...studentGroupLessons];
        const completedLessons = allLessons.filter(lesson => {
          if ('status' in lesson) {
            return (lesson as Lesson).status === LessonStatus.COMPLETED;
          } else {
            return (lesson as GroupLesson).status === GroupLessonStatus.COMPLETED;
          }
        }).length;
        
        const totalLessons = allLessons.length;
        const attendanceRate = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
        
        // Simulate streak calculation
        const currentStreak = Math.floor(Math.random() * 10);
        const longestStreak = Math.max(currentStreak, Math.floor(Math.random() * 15));
        
        // Simulate subject progress
        const subjects = [
          {
            name: 'Грамматика',
            completed: Math.floor(Math.random() * 20),
            total: 30,
            progress: 0,
          },
          {
            name: 'Разговорная практика',
            completed: Math.floor(Math.random() * 15),
            total: 25,
            progress: 0,
          },
          {
            name: 'Аудирование',
            completed: Math.floor(Math.random() * 12),
            total: 20,
            progress: 0,
          },
        ].map(subject => ({
          ...subject,
          progress: subject.total > 0 ? (subject.completed / subject.total) * 100 : 0,
        }));
        
        setProgress({
          totalLessons,
          completedLessons,
          attendanceRate,
          currentStreak,
          longestStreak,
          subjects,
        });
      } catch (err: any) {
        dispatch(setError(err.message || 'Ошибка загрузки прогресса обучения'));
      } finally {
        dispatch(setLoading(false));
      }
    };
    
    if (user?.role === 'STUDENT') {
      loadLearningProgress();
    }
  }, [user?.id, user?.role, dispatch]);


  const getOverallRating = () => {
    if (progress.attendanceRate >= 90) return 5;
    if (progress.attendanceRate >= 80) return 4;
    if (progress.attendanceRate >= 70) return 3;
    if (progress.attendanceRate >= 60) return 2;
    return 1;
  };

  if (user?.role !== 'STUDENT') {
    return null;
  }

  return (
    <Card elevation={3}>
      <CardHeader
        avatar={<TrendingUpIcon color="success" />}
        title="Прогресс обучения"
        subheader={`Общая посещаемость: ${Math.round(progress.attendanceRate)}%`}
      />
      
      <CardContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Rating 
                value={getOverallRating()} 
                readOnly 
                size="large" 
                emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
              />
              <Typography variant="h6" sx={{ ml: 1 }}>
                {getOverallRating()}/5
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {progress.completedLessons}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Завершено
                </Typography>
              </Box>
              
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="success">
                  {progress.currentStreak}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Текущая серия
                </Typography>
              </Box>
              
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="warning">
                  {progress.longestStreak}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Лучшая серия
                </Typography>
              </Box>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle1" gutterBottom>
              Прогресс по предметам:
            </Typography>
            
            <List disablePadding>
              {progress.subjects.map((subject, index) => (
                <React.Fragment key={subject.name}>
                  <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36, mr: 1 }}>
                      <SchoolIcon fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2">
                          {subject.name}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="caption">
                              {subject.completed}/{subject.total} занятий
                            </Typography>
                            <Chip 
                              label={`${Math.round(subject.progress)}%`} 
                              color={subject.progress >= 80 ? "success" : subject.progress >= 60 ? "warning" : "error"}
                              size="small"
                            />
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={subject.progress} 
                            color={subject.progress >= 80 ? "success" : subject.progress >= 60 ? "warning" : "error"}
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < progress.subjects.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button variant="outlined" size="small" startIcon={<TrendingUpIcon />}>
                Подробный отчет
              </Button>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardLearningProgressWidget;