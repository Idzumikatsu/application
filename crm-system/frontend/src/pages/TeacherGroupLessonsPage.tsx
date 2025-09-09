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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { RootState } from '../store';
import { setGroupLessons, addGroupLesson, setLoading, setError } from '../store/lessonSlice';
import LessonService from '../services/lessonService';
import { GroupLesson, GroupLessonStatus } from '../types';

const TeacherGroupLessonsPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { groupLessons, loading, error } = useSelector((state: RootState) => state.lessons);
  const dispatch = useDispatch();
  
  const [openDialog, setOpenDialog] = useState(false);
  const [topic, setTopic] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState(60);
  const [maxStudents, setMaxStudents] = useState(5);
  const [description, setDescription] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  
  const today = new Date();
  const nextMonth = new Date();
  nextMonth.setMonth(today.getMonth() + 1);

  useEffect(() => {
    if (user?.id) {
      loadGroupLessons();
    }
  }, [user?.id]);

  const loadGroupLessons = async () => {
    if (!user?.id) return;
    
    dispatch(setLoading(true));
    try {
      const startDate = today.toISOString().split('T')[0];
      const endDate = nextMonth.toISOString().split('T')[0];
      const response = await LessonService.getTeacherGroupLessons(user.id, 0, 100, startDate, endDate);
      dispatch(setGroupLessons(response.content));
    } catch (err: any) {
      dispatch(setError(err.message || 'Ошибка загрузки групповых уроков'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleCreateGroupLesson = async () => {
    if (!user?.id) return;
    
    try {
      const newGroupLesson = await LessonService.createGroupLesson({
        teacherId: user.id,
        lessonTopic: topic,
        scheduledDate: date,
        scheduledTime: time,
        durationMinutes: duration,
        maxStudents: maxStudents,
        currentStudents: 0,
        status: GroupLessonStatus.SCHEDULED,
        description: description,
        meetingLink: meetingLink,
      });
      
      dispatch(addGroupLesson(newGroupLesson));
      handleCloseDialog();
    } catch (err: any) {
      dispatch(setError(err.message || 'Ошибка создания группового урока'));
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setTopic('');
    setDate('');
    setTime('');
    setDuration(60);
    setMaxStudents(5);
    setDescription('');
    setMeetingLink('');
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

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Групповые уроки</Typography>
        <Button 
          variant="contained" 
          onClick={() => setOpenDialog(true)}
        >
          Создать групповой урок
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
        <Grid container spacing={2}>
          {groupLessons.map((groupLesson) => (
            <Grid item xs={12} sm={6} md={4} key={groupLesson.id}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6">
                  {groupLesson.lessonTopic}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {new Date(groupLesson.scheduledDate).toLocaleDateString('ru-RU', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </Typography>
                <Typography variant="body1">
                  Время: {groupLesson.scheduledTime}
                </Typography>
                <Typography variant="body1">
                  Длительность: {groupLesson.durationMinutes} минут
                </Typography>
                <Typography variant="body1">
                  Участники: {groupLesson.currentStudents}/{groupLesson.maxStudents || '∞'}
                </Typography>
                <Chip 
                  label={getStatusText(groupLesson.status)} 
                  color={getStatusColor(groupLesson.status)}
                  sx={{ mt: 1 }}
                />
                {groupLesson.description && (
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    {groupLesson.description}
                  </Typography>
                )}
                {groupLesson.meetingLink && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Ссылка: <a href={groupLesson.meetingLink} target="_blank" rel="noopener noreferrer">
                      Перейти к уроку
                    </a>
                  </Typography>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Создать групповой урок</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Тема урока"
            fullWidth
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Дата"
            type="date"
            fullWidth
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin="dense"
            label="Время"
            type="time"
            fullWidth
            value={time}
            onChange={(e) => setTime(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Длительность (минуты)</InputLabel>
            <Select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            >
              <MenuItem value={30}>30 минут</MenuItem>
              <MenuItem value={60}>60 минут</MenuItem>
              <MenuItem value={90}>90 минут</MenuItem>
              <MenuItem value={120}>120 минут</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Максимум студентов"
            type="number"
            fullWidth
            value={maxStudents}
            onChange={(e) => setMaxStudents(Number(e.target.value))}
          />
          <TextField
            margin="dense"
            label="Описание"
            fullWidth
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Ссылка на встречу"
            fullWidth
            value={meetingLink}
            onChange={(e) => setMeetingLink(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отмена</Button>
          <Button onClick={handleCreateGroupLesson} variant="contained">
            Создать
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TeacherGroupLessonsPage;