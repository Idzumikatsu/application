import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { Search, Add, CalendarToday } from '@mui/icons-material';
import { RootState } from '../store';
import { setLessons, addLesson, setLoading, setError } from '../store/lessonSlice';
import LessonService from '../services/lessonService';
import UserService from '../services/userService';
import { Lesson, User, Student, LessonStatus } from '../types';

const ManagerSchedulingPage: React.FC = () => {
  const { lessons, loading, error } = useSelector((state: RootState) => state.lessons);
  const { teachers } = useSelector((state: RootState) => state.users);
  const { students } = useSelector((state: RootState) => state.users);
  const dispatch = useDispatch();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [newLesson, setNewLesson] = useState({
    studentId: 0,
    teacherId: 0,
    scheduledDate: '',
    scheduledTime: '',
    durationMinutes: 60,
    notes: '',
  });
  const [useAvailabilitySlot, setUseAvailabilitySlot] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState('');

  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);

  useEffect(() => {
    loadLessons();
    loadTeachers();
    loadStudents();
  }, []);

  const loadLessons = async () => {
    dispatch(setLoading(true));
    try {
      const startDate = today.toISOString().split('T')[0];
      const endDate = nextWeek.toISOString().split('T')[0];
      // Загрузим уроки для всех преподавателей
      const allLessons: Lesson[] = [];
      for (const teacher of teachers) {
        try {
          const teacherLessons = await LessonService.getTeacherLessons(teacher.id, startDate, endDate);
          allLessons.push(...teacherLessons);
        } catch (err) {
          // Пропускаем ошибки для отдельных преподавателей
        }
      }
      dispatch(setLessons(allLessons));
    } catch (err: any) {
      dispatch(setError(err.message || 'Ошибка загрузки расписания'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const loadTeachers = async () => {
    try {
      const data = await UserService.getAllTeachers();
      // dispatch(setTeachers(data)); // Уже загружено в ManagerTeachersPage
    } catch (err: any) {
      dispatch(setError(err.message || 'Ошибка загрузки преподавателей'));
    }
  };

  const loadStudents = async () => {
    try {
      const data = await UserService.getAllStudents();
      // dispatch(setStudents(data)); // Уже загружено в ManagerStudentsPage
    } catch (err: any) {
      dispatch(setError(err.message || 'Ошибка загрузки студентов'));
    }
  };

  const loadAvailableSlots = async (teacherId: number) => {
    if (!teacherId) return;
    
    try {
      // Здесь должна быть реализация загрузки доступных слотов
      // Пока используем заглушку
      setAvailableSlots([
        { id: 1, date: '2023-06-15', time: '10:00', duration: 60 },
        { id: 2, date: '2023-06-15', time: '11:00', duration: 60 },
        { id: 3, date: '2023-06-16', time: '14:00', duration: 60 },
      ]);
    } catch (err: any) {
      dispatch(setError(err.message || 'Ошибка загрузки доступных слотов'));
    }
  };

  const handleCreateLesson = async () => {
    try {
      const lessonData = {
        ...newLesson,
        status: LessonStatus.SCHEDULED,
        confirmedByTeacher: false,
      };
      
      const createdLesson = await LessonService.createLesson(lessonData);
      dispatch(addLesson(createdLesson));
      handleCloseDialog();
    } catch (err: any) {
      dispatch(setError(err.message || 'Ошибка создания урока'));
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewLesson({
      studentId: 0,
      teacherId: 0,
      scheduledDate: '',
      scheduledTime: '',
      durationMinutes: 60,
      notes: '',
    });
    setUseAvailabilitySlot(false);
    setAvailableSlots([]);
    setSelectedSlot('');
  };

  const filteredLessons = lessons.filter(lesson =>
    students.find(s => s.id === lesson.studentId)?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    students.find(s => s.id === lesson.studentId)?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teachers.find(t => t.id === lesson.teacherId)?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teachers.find(t => t.id === lesson.teacherId)?.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Планирование уроков</Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
        >
          Назначить урок
        </Button>
      </Box>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Поиск уроков..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconButton>
                <Search />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

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
          {filteredLessons.map((lesson) => {
            const student = students.find(s => s.id === lesson.studentId);
            const teacher = teachers.find(t => t.id === lesson.teacherId);
            
            return (
              <Grid item xs={12} sm={6} md={4} key={lesson.id}>
                <Paper sx={{ p: 2, height: '100%' }}>
                  <Typography variant="h6">
                    {student?.firstName} {student?.lastName}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    Преподаватель: {teacher?.firstName} {teacher?.lastName}
                  </Typography>
                  <Typography variant="body1">
                    {new Date(lesson.scheduledDate).toLocaleDateString('ru-RU')}
                  </Typography>
                  <Typography variant="body1">
                    Время: {lesson.scheduledTime}
                  </Typography>
                  <Typography variant="body1">
                    Длительность: {lesson.durationMinutes} минут
                  </Typography>
                  {lesson.notes && (
                    <Typography variant="body2" color="textSecondary">
                      Заметки: {lesson.notes}
                    </Typography>
                  )}
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Назначить урок</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Студент</InputLabel>
            <Select
              value={newLesson.studentId}
              onChange={(e) => setNewLesson({...newLesson, studentId: Number(e.target.value)})}
            >
              {students.map(student => (
                <MenuItem key={student.id} value={student.id}>
                  {student.firstName} {student.lastName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl fullWidth margin="dense">
            <InputLabel>Преподаватель</InputLabel>
            <Select
              value={newLesson.teacherId}
              onChange={(e) => {
                const teacherId = Number(e.target.value);
                setNewLesson({...newLesson, teacherId});
                if (useAvailabilitySlot) {
                  loadAvailableSlots(teacherId);
                }
              }}
            >
              {teachers.map(teacher => (
                <MenuItem key={teacher.id} value={teacher.id}>
                  {teacher.firstName} {teacher.lastName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControlLabel
            control={
              <Checkbox
                checked={useAvailabilitySlot}
                onChange={(e) => {
                  setUseAvailabilitySlot(e.target.checked);
                  if (e.target.checked && newLesson.teacherId) {
                    loadAvailableSlots(newLesson.teacherId);
                  }
                }}
              />
            }
            label="Использовать доступный слот"
          />
          
          {useAvailabilitySlot ? (
            <FormControl fullWidth margin="dense">
              <InputLabel>Доступный слот</InputLabel>
              <Select
                value={selectedSlot}
                onChange={(e) => setSelectedSlot(e.target.value as string)}
              >
                {availableSlots.map(slot => (
                  <MenuItem key={slot.id} value={`${slot.date} ${slot.time}`}>
                    {new Date(slot.date).toLocaleDateString('ru-RU')} {slot.time} ({slot.duration} мин)
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <>
              <TextField
                margin="dense"
                label="Дата"
                type="date"
                fullWidth
                value={newLesson.scheduledDate}
                onChange={(e) => setNewLesson({...newLesson, scheduledDate: e.target.value})}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                margin="dense"
                label="Время"
                type="time"
                fullWidth
                value={newLesson.scheduledTime}
                onChange={(e) => setNewLesson({...newLesson, scheduledTime: e.target.value})}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </>
          )}
          
          <FormControl fullWidth margin="dense">
            <InputLabel>Длительность (минуты)</InputLabel>
            <Select
              value={newLesson.durationMinutes}
              onChange={(e) => setNewLesson({...newLesson, durationMinutes: Number(e.target.value)})}
            >
              <MenuItem value={30}>30 минут</MenuItem>
              <MenuItem value={60}>60 минут</MenuItem>
              <MenuItem value={90}>90 минут</MenuItem>
              <MenuItem value={120}>120 минут</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            margin="dense"
            label="Заметки"
            fullWidth
            multiline
            rows={3}
            value={newLesson.notes}
            onChange={(e) => setNewLesson({...newLesson, notes: e.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отмена</Button>
          <Button onClick={handleCreateLesson} variant="contained">
            Назначить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManagerSchedulingPage;