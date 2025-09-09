import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { RootState } from '../store';
import { setGroupLessons, addGroupLesson, setLoading, setError } from '../store/lessonSlice';
import LessonService from '../services/lessonService';
import { GroupLesson, GroupLessonStatus, GroupLessonRegistration, RegistrationStatus } from '../types';

const StudentGroupLessonsPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { groupLessons, loading, error } = useSelector((state: RootState) => state.lessons);
  const dispatch = useDispatch();
  
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<GroupLesson | null>(null);
  const [registrations, setRegistrations] = useState<GroupLessonRegistration[]>([]);
  const [availableLessons, setAvailableLessons] = useState<GroupLesson[]>([]);
  
  const today = new Date();
  const nextMonth = new Date();
  nextMonth.setMonth(today.getMonth() + 1);

  useEffect(() => {
    if (user?.id) {
      loadGroupLessons();
      loadRegistrations();
      loadAvailableLessons();
    }
  }, [user?.id]);

  const loadGroupLessons = async () => {
    if (!user?.id) return;
    
    dispatch(setLoading(true));
    try {
      const startDate = today.toISOString().split('T')[0];
      const endDate = nextMonth.toISOString().split('T')[0];
      const response = await LessonService.getStudentGroupLessons(user.id, 0, 100, startDate, endDate);
      dispatch(setGroupLessons(response.content));
    } catch (err: any) {
      dispatch(setError(err.message || 'Ошибка загрузки групповых уроков'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const loadRegistrations = async () => {
    if (!user?.id) return;
    
    try {
      const response = await LessonService.getStudentRegistrations(user.id, 0, 100);
      setRegistrations(response.content);
    } catch (err: any) {
      dispatch(setError(err.message || 'Ошибка загрузки регистраций'));
    }
  };

  const loadAvailableLessons = async () => {
    try {
      // Здесь должна быть реализация загрузки доступных групповых уроков
      // Пока используем заглушку
      const mockLessons: GroupLesson[] = [
        {
          id: 1,
          teacherId: 1,
          lessonTopic: 'Основы грамматики английского языка',
          scheduledDate: '2023-06-20',
          scheduledTime: '10:00',
          durationMinutes: 60,
          maxStudents: 10,
          currentStudents: 5,
          status: GroupLessonStatus.SCHEDULED,
        },
        {
          id: 2,
          teacherId: 2,
          lessonTopic: 'Разговорная практика',
          scheduledDate: '2023-06-22',
          scheduledTime: '14:00',
          durationMinutes: 90,
          maxStudents: 8,
          currentStudents: 3,
          status: GroupLessonStatus.SCHEDULED,
        },
      ];
      setAvailableLessons(mockLessons);
    } catch (err: any) {
      dispatch(setError(err.message || 'Ошибка загрузки доступных уроков'));
    }
  };

  const handleRegisterForLesson = async () => {
    if (!user?.id || !selectedLesson) return;
    
    try {
      const registration = await LessonService.registerForGroupLesson(selectedLesson.id, user.id);
      setRegistrations([...registrations, registration]);
      handleCloseDialog();
    } catch (err: any) {
      dispatch(setError(err.message || 'Ошибка регистрации на урок'));
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedLesson(null);
  };

  const getStatusColor = (status: GroupLessonStatus) => {
    switch (status) {
      case GroupLessonStatus.SCHEDULED: return 'primary';
      case GroupLessonStatus.CONFIRMED: return 'success';
      case GroupLessonStatus.IN_PROGRESS: return 'warning';
      case GroupLessonStatus.COMPLETED: return 'success';
      case GroupLessonStatus.CANCELLED: return 'error';
      case GroupLessonStatus.POSTPONED: return 'info';
      default: return 'default';
    }
  };

  const getStatusText = (status: GroupLessonStatus) => {
    switch (status) {
      case GroupLessonStatus.SCHEDULED: return 'Запланирован';
      case GroupLessonStatus.CONFIRMED: return 'Подтвержден';
      case GroupLessonStatus.IN_PROGRESS: return 'В процессе';
      case GroupLessonStatus.COMPLETED: return 'Завершен';
      case GroupLessonStatus.CANCELLED: return 'Отменен';
      case GroupLessonStatus.POSTPONED: return 'Перенесен';
      default: return 'Неизвестно';
    }
  };

  const getRegistrationStatusText = (status: RegistrationStatus) => {
    switch (status) {
      case RegistrationStatus.REGISTERED: return 'Зарегистрирован';
      case RegistrationStatus.ATTENDED: return 'Посетил';
      case RegistrationStatus.MISSED: return 'Пропустил';
      case RegistrationStatus.CANCELLED: return 'Отменен';
      default: return 'Неизвестно';
    }
  };

  const getRegistrationStatusColor = (status: RegistrationStatus) => {
    switch (status) {
      case RegistrationStatus.REGISTERED: return 'primary';
      case RegistrationStatus.ATTENDED: return 'success';
      case RegistrationStatus.MISSED: return 'warning';
      case RegistrationStatus.CANCELLED: return 'error';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Групповые уроки</Typography>
        <Button 
          variant="contained" 
          onClick={() => setOpenDialog(true)}
        >
          Записаться на урок
        </Button>
      </Box>

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
        <>
          <Typography variant="h6" gutterBottom>
            Мои записи на групповые уроки
          </Typography>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {registrations.map((registration) => {
              const lesson = groupLessons.find(l => l.id === registration.groupLessonId);
              
              return (
                <Grid item xs={12} sm={6} md={4} key={registration.id}>
                  <Paper sx={{ p: 2, height: '100%' }}>
                    <Typography variant="h6">
                      {lesson?.lessonTopic || 'Групповой урок'}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      {lesson ? new Date(lesson.scheduledDate).toLocaleDateString('ru-RU') : ''}
                    </Typography>
                    <Typography variant="body1">
                      Время: {lesson?.scheduledTime}
                    </Typography>
                    <Chip 
                      label={getRegistrationStatusText(registration.registrationStatus)} 
                      color={getRegistrationStatusColor(registration.registrationStatus)}
                      sx={{ mt: 1 }}
                    />
                    {lesson && (
                      <Chip 
                        label={getStatusText(lesson.status)} 
                        color={getStatusColor(lesson.status)}
                        sx={{ mt: 1, ml: 1 }}
                      />
                    )}
                  </Paper>
                </Grid>
              );
            })}
          </Grid>

          <Typography variant="h6" gutterBottom>
            Доступные групповые уроки
          </Typography>
          <Grid container spacing={2}>
            {availableLessons.map((lesson) => {
              const isRegistered = registrations.some(r => r.groupLessonId === lesson.id);
              
              return (
                <Grid item xs={12} sm={6} md={4} key={lesson.id}>
                  <Paper sx={{ p: 2, height: '100%' }}>
                    <Typography variant="h6">
                      {lesson.lessonTopic}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      {new Date(lesson.scheduledDate).toLocaleDateString('ru-RU')}
                    </Typography>
                    <Typography variant="body1">
                      Время: {lesson.scheduledTime}
                    </Typography>
                    <Typography variant="body1">
                      Длительность: {lesson.durationMinutes} минут
                    </Typography>
                    <Typography variant="body1">
                      Участники: {lesson.currentStudents}/{lesson.maxStudents || '∞'}
                    </Typography>
                    <Chip 
                      label={getStatusText(lesson.status)} 
                      color={getStatusColor(lesson.status)}
                      sx={{ mt: 1 }}
                    />
                    {isRegistered && (
                      <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                        Вы уже записаны
                      </Typography>
                    )}
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Записаться на групповой урок</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Выберите урок</InputLabel>
            <Select
              value={selectedLesson?.id || ''}
              onChange={(e) => {
                const lesson = availableLessons.find(l => l.id === Number(e.target.value));
                setSelectedLesson(lesson || null);
              }}
            >
              {availableLessons
                .filter(lesson => !registrations.some(r => r.groupLessonId === lesson.id))
                .map(lesson => (
                  <MenuItem key={lesson.id} value={lesson.id}>
                    {lesson.lessonTopic} - {new Date(lesson.scheduledDate).toLocaleDateString('ru-RU')} {lesson.scheduledTime}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          
          {selectedLesson && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6">
                {selectedLesson.lessonTopic}
              </Typography>
              <Typography variant="body1">
                Дата: {new Date(selectedLesson.scheduledDate).toLocaleDateString('ru-RU')}
              </Typography>
              <Typography variant="body1">
                Время: {selectedLesson.scheduledTime}
              </Typography>
              <Typography variant="body1">
                Длительность: {selectedLesson.durationMinutes} минут
              </Typography>
              <Typography variant="body1">
                Участники: {selectedLesson.currentStudents}/{selectedLesson.maxStudents || '∞'}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отмена</Button>
          <Button 
            onClick={handleRegisterForLesson} 
            variant="contained"
            disabled={!selectedLesson}
          >
            Записаться
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentGroupLessonsPage;