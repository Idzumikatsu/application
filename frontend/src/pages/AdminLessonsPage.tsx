import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
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
  Tabs,
  Tab,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Event as EventIcon,
  VideoCall as VideoCallIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  CalendarToday,
  Today,
  DateRange,
} from '@mui/icons-material';
import { RootState } from '@/store';
import { useGetLessonsQuery, useChangeLessonStatusMutation } from '@/apiSlice';
import EnhancedCalendar from '@/components/EnhancedCalendar';
import { CalendarEvent, Lesson } from '@/types';

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
      console.log('🔄 Loading events...');
      
      // Имитируем загрузку событий
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Моковые данные для демонстрации
      const mockEvents: CalendarEvent[] = [
        {
          id: '1',
          title: 'Индивидуальный урок с Иваном Смирновым',
          start: new Date(new Date().setHours(10, 0, 0, 0)),
          end: new Date(new Date().setHours(11, 0, 0, 0)),
          type: 'lesson',
          status: 'SCHEDULED',
          resource: {
            description: 'Урок по грамматике Present Simple',
            meetingLink: 'https://meet.google.com/abc-defg-hij',
            studentId: 1,
            studentName: 'Иван Смирнов',
            teacherId: 1,
            teacherName: 'Елена Сидорова',
          }
        },
        {
          id: '2',
          title: 'Групповой урок по разговорной практике',
          start: (() => {
            const date = new Date();
            date.setDate(date.getDate() + 1);
            return date;
          })(),
          end: (() => {
            const date = new Date();
            date.setDate(date.getDate() + 1);
            date.setHours(15, 0, 0, 0);
            return date;
          })(),
          type: 'group-lesson',
          status: 'SCHEDULED',
          resource: {
            description: 'Групповой урок для начинающих',
            meetingLink: 'https://meet.google.com/klm-nopq-rst',
            groupId: 1,
            groupName: 'Группа начинающих',
          }
        },
        {
          id: '3',
          title: 'Доступность Елены Сидоровой',
          start: (() => {
            const date = new Date();
            date.setDate(date.getDate() + 2);
            date.setHours(9, 0, 0, 0);
            return date;
          })(),
          end: (() => {
            const date = new Date();
            date.setDate(date.getDate() + 2);
            date.setHours(17, 0, 0, 0);
            return date;
          })(),
          type: 'availability',
          status: 'CONFIRMED',
          resource: {
            description: 'Доступное время для записи уроков',
            teacherId: 1,
            teacherName: 'Елена Сидорова',
          }
        },
      ];
      
      setEvents(mockEvents);
      console.log('✅ Events loaded successfully:', mockEvents);
    } catch (err: any) {
      console.error('❌ Error loading events:', err);
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
      console.log('🔄 Creating event:', eventData);
      
      // Имитируем создание события
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setOpenDialog(false);
      loadEvents();
    } catch (err: any) {
      console.error('❌ Error creating event:', err);
      setError(err.message || 'Ошибка создания события');
    }
  };

  const handleEventUpdate = async (event: CalendarEvent) => {
    try {
      console.log('🔄 Updating event:', event);
      
      // Имитируем обновление события
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setOpenDialog(false);
      loadEvents();
    } catch (err: any) {
      console.error('❌ Error updating event:', err);
      setError(err.message || 'Ошибка обновления события');
    }
  };

  const handleEventDelete = async (eventId: string) => {
    try {
      console.log('🔄 Deleting event with id:', eventId);
      
      // Имитируем удаление события
      await new Promise(resolve => setTimeout(resolve, 500));
      
      loadEvents();
    } catch (err: any) {
      console.error('❌ Error deleting event:', err);
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