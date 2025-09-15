import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
} from '@mui/material';
import { RootState } from '../store';
import { setLessons, setLoading, setError } from '../store/lessonSlice';
import LessonService from '../services/lessonService';
import { LessonStatusBadge } from '../components/LessonStatus';

const StudentSchedulePage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { lessons, loading, error } = useSelector((state: RootState) => state.lessons);
  const dispatch = useDispatch();
  

  const loadLessons = useCallback(async () => {
    if (!user?.id) return;
    
    dispatch(setLoading(true));
    try {
      const today = new Date();
      const nextMonth = new Date();
      nextMonth.setMonth(today.getMonth() + 1);
      
      const startDate = today.toISOString().split('T')[0];
      const endDate = nextMonth.toISOString().split('T')[0];
      const data = await LessonService.getStudentLessons(user.id, startDate, endDate);
      dispatch(setLessons(data));
    } catch (err: any) {
      dispatch(setError(err.message || 'Ошибка загрузки расписания'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [user?.id, dispatch]);

  useEffect(() => {
    if (user?.id) {
      loadLessons();
    }
  }, [user?.id, loadLessons]);



  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Мое расписание
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
          {lessons.map((lesson) => {
            const teacher = lesson.teacher; // Предполагаем, что объект преподавателя доступен
            
            return (
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
                  {teacher && (
                    <Typography variant="body1">
                      Преподаватель: {teacher.firstName} {teacher.lastName}
                    </Typography>
                  )}
                  <Box sx={{ mt: 1 }}>
                    <LessonStatusBadge status={lesson.status} />
                  </Box>
                  {lesson.notes && (
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                      Заметки: {lesson.notes}
                    </Typography>
                  )}
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};

export default StudentSchedulePage;