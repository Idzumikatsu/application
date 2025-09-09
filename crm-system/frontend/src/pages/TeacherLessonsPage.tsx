import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Chip,
} from '@mui/material';
import { RootState } from '../store';
import { setLessons, setLoading, setError } from '../store/lessonSlice';
import LessonService from '../services/lessonService';
import { Lesson, LessonStatus } from '../types';

const TeacherLessonsPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { lessons, loading, error } = useSelector((state: RootState) => state.lessons);
  const dispatch = useDispatch();
  
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);

  useEffect(() => {
    if (user?.id) {
      loadLessons();
    }
  }, [user?.id]);

  const loadLessons = async () => {
    if (!user?.id) return;
    
    dispatch(setLoading(true));
    try {
      const startDate = today.toISOString().split('T')[0];
      const endDate = nextWeek.toISOString().split('T')[0];
      const data = await LessonService.getTeacherLessons(user.id, startDate, endDate);
      dispatch(setLessons(data));
    } catch (err: any) {
      dispatch(setError(err.message || 'Ошибка загрузки уроков'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const getStatusColor = (status: LessonStatus) => {
    switch (status) {
      case LessonStatus.SCHEDULED: return 'primary';
      case LessonStatus.COMPLETED: return 'success';
      case LessonStatus.CANCELLED: return 'error';
      case LessonStatus.MISSED: return 'warning';
      default: return 'default';
    }
  };

  const getStatusText = (status: LessonStatus) => {
    switch (status) {
      case LessonStatus.SCHEDULED: return 'Запланирован';
      case LessonStatus.COMPLETED: return 'Завершен';
      case LessonStatus.CANCELLED: return 'Отменен';
      case LessonStatus.MISSED: return 'Пропущен';
      default: return 'Неизвестно';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Мои уроки
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {lessons.map((lesson) => (
            <Grid item xs={12} sm={6} md={4} key={lesson.id}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6">
                  {new Date(lesson.scheduledDate).toLocaleDateString('ru-RU', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  Время: {lesson.scheduledTime}
                </Typography>
                <Typography variant="body1">
                  Длительность: {lesson.durationMinutes} минут
                </Typography>
                <Typography variant="body1">
                  Студент: {lesson.studentId}
                </Typography>
                <Chip 
                  label={getStatusText(lesson.status)} 
                  color={getStatusColor(lesson.status)}
                  sx={{ mt: 1 }}
                />
                {lesson.notes && (
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    Заметки: {lesson.notes}
                  </Typography>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default TeacherLessonsPage;