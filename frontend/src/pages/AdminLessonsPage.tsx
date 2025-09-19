import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Event as EventIcon,
  VideoCall as VideoCallIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { RootState } from '../store';
import EnhancedCalendar from '../components/EnhancedCalendar';
import { CalendarEvent, Lesson } from '../types';
import { adminService } from '../services';

const AdminLessonsPage: React.FC = () => {
  const dispatch = useDispatch();
  const { teachers, students } = useSelector((state: RootState) => state.users);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | ''>('');
  const [selectedStudentId, setSelectedStudentId] = useState<number | ''>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    start: new Date(),
    end: new Date(new Date().getTime() + 60 * 60 * 1000), // 1 hour later
    type: 'lesson' as 'lesson' | 'group-lesson' | 'availability' | 'other',
    description: '',
    meetingLink: '',
    status: 'PENDING',
  });
  const [dateRange, setDateRange] = useState({
    start: new Date(),
    end: new Date(),
  });

  // Set date range to current month
  useEffect(() => {
    const start = new Date();
    start.setDate(1);
    const end = new Date();
    end.setMonth(end.getMonth() + 1);
    end.setDate(0);
    setDateRange({ start, end });
  }, []);

  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let allEvents: CalendarEvent[] = [];
      
      // If teacher is selected, load their events
      if (selectedTeacherId) {
        // This would be implemented in adminService
        // const teacherEvents = await adminService.getTeacherEvents(selectedTeacherId, dateRange.start, dateRange.end);
        // allEvents = [...allEvents, ...teacherEvents];
      }
      
      // If student is selected, load their events
      if (selectedStudentId) {
        // This would be implemented in adminService
        // const studentEvents = await adminService.getStudentEvents(selectedStudentId, dateRange.start, dateRange.end);
        // allEvents = [...allEvents, ...studentEvents];
      }
      
      // If no specific user selected, load all events
      if (!selectedTeacherId && !selectedStudentId) {
        // This would be implemented in adminService
        // allEvents = await adminService.getAllEvents(dateRange.start, dateRange.end);
      }
      
      setEvents(allEvents);
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки событий');
    } finally {
      setLoading(false);
    }
  }, [selectedTeacherId, selectedStudentId, dateRange]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const handleEventCreate = async (eventData: Omit<CalendarEvent, 'id'>) => {
    try {
      // This would be implemented in adminService
      // const newEvent = await adminService.createEvent(eventData);
      // setEvents(prev => [...prev, newEvent]);
      setOpenDialog(false);
    } catch (err: any) {
      setError(err.message || 'Ошибка создания события');
    }
  };

  const handleEventUpdate = async (event: CalendarEvent) => {
    try {
      // This would be implemented in adminService
      // const updatedEvent = await adminService.updateEvent(event.id, event);
      // setEvents(prev => prev.map(e => e.id === event.id ? updatedEvent : e));
      setOpenDialog(false);
    } catch (err: any) {
      setError(err.message || 'Ошибка обновления события');
    }
  };

  const handleEventDelete = async (eventId: string) => {
    try {
      // This would be implemented in adminService
      // await adminService.deleteEvent(eventId);
      // setEvents(prev => prev.filter(e => e.id !== eventId));
    } catch (err: any) {
      setError(err.message || 'Ошибка удаления события');
    }
  };

  const handleRefresh = () => {
    loadEvents();
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (event.resource?.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3, height: '100%' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4">Управление уроками</Typography>
        <Typography variant="body1" color="textSecondary">
          Планирование и управление индивидуальными и групповыми уроками
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Преподаватель</InputLabel>
                <Select
                  value={selectedTeacherId}
                  onChange={(e) => setSelectedTeacherId(e.target.value as number)}
                  label="Преподаватель"
                >
                  <MenuItem value="">Все преподаватели</MenuItem>
                  {teachers.map(teacher => (
                    <MenuItem key={teacher.id} value={teacher.id}>
                      {teacher.firstName} {teacher.lastName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Студент</InputLabel>
                <Select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value as number)}
                  label="Студент"
                >
                  <MenuItem value="">Все студенты</MenuItem>
                  {students.map(student => (
                    <MenuItem key={student.id} value={student.id}>
                      {student.firstName} {student.lastName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Поиск событий"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  endAdornment: <SearchIcon />,
                }}
                sx={{ minWidth: 200 }}
              />

              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
                disabled={loading}
              >
                Обновить
              </Button>

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenDialog(true)}
              >
                Создать урок
              </Button>
            </Box>
          </Paper>
        </Grid>

        {error && (
          <Grid item xs={12}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}

        <Grid item xs={12}>
          <Paper sx={{ height: 'calc(100vh - 250px)' }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress />
              </Box>
            ) : (
              <EnhancedCalendar
                events={filteredEvents}
                onEventCreate={handleEventCreate}
                onEventUpdate={handleEventUpdate}
                onEventDelete={handleEventDelete}
              />
            )}
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EventIcon />
            {editingEvent ? 'Редактирование урока' : 'Создание урока'}
          </Box>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Название урока"
            fullWidth
            value={newEvent.title}
            onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
            <InputLabel>Тип урока</InputLabel>
            <Select
              value={newEvent.type}
              onChange={(e) => setNewEvent({...newEvent, type: e.target.value as any})}
              label="Тип урока"
            >
              <MenuItem value="lesson">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <VideoCallIcon fontSize="small" />
                  Индивидуальный урок
                </Box>
              </MenuItem>
              <MenuItem value="group-lesson">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <VideoCallIcon fontSize="small" />
                  Групповой урок
                </Box>
              </MenuItem>
              <MenuItem value="availability">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EventIcon fontSize="small" />
                  Доступность
                </Box>
              </MenuItem>
              <MenuItem value="other">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EventIcon fontSize="small" />
                  Другое
                </Box>
              </MenuItem>
            </Select>
          </FormControl>

          <TextField
            margin="dense"
            label="Описание"
            fullWidth
            multiline
            rows={3}
            value={newEvent.description}
            onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
            sx={{ mb: 2 }}
          />

          <TextField
            margin="dense"
            label="Ссылка для видеоконференции"
            fullWidth
            value={newEvent.meetingLink}
            onChange={(e) => setNewEvent({...newEvent, meetingLink: e.target.value})}
            placeholder="https://meet.example.com/..."
            InputProps={{
              endAdornment: newEvent.meetingLink && (
                <Chip
                  label="Видеозвонок"
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              ),
            }}
          />
        </DialogContent>
        <DialogActions>
          {editingEvent && (
            <Button onClick={() => {
              if (editingEvent) handleEventDelete(editingEvent.id);
              setOpenDialog(false);
            }} color="error">
              Удалить
            </Button>
          )}
          <Button onClick={() => setOpenDialog(false)}>Отмена</Button>
          <Button
            onClick={() => {
              if (editingEvent) {
                handleEventUpdate(editingEvent);
              } else {
                handleEventCreate(newEvent as Omit<CalendarEvent, 'id'>);
              }
            }}
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Сохранение...' : (editingEvent ? 'Сохранить' : 'Создать')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminLessonsPage;