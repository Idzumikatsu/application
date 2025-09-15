
import React, { useState, useCallback } from 'react';
import {
  Calendar as BigCalendar,
  momentLocalizer,
  View,
  Event,
  SlotInfo,
} from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {
  Box,
  Paper,
  Typography,
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
  Chip,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  LinearProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Event as EventIcon,
  VideoCall as VideoCallIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { CalendarEvent, AvailabilitySlot } from '../../types';
import { checkScheduleConflicts } from '../../services/scheduleService';

const localizer = momentLocalizer(moment);

interface EnhancedCalendarProps {
  events?: CalendarEvent[];
  availabilitySlots?: AvailabilitySlot[];
  onEventCreate?: (event: Omit<CalendarEvent, 'id'>) => Promise<void>;
  onEventUpdate?: (event: CalendarEvent) => Promise<void>;
  onEventDelete?: (eventId: string) => Promise<void>;
  onSlotCreate?: (slot: Omit<AvailabilitySlot, 'id'>) => Promise<void>;
  onSlotUpdate?: (slot: AvailabilitySlot) => Promise<void>;
  onSlotDelete?: (slotId: number) => Promise<void>;
  view?: View;
  date?: Date;
  onViewChange?: (view: View) => void;
  onDateChange?: (date: Date) => void;
}

const EnhancedCalendar: React.FC<EnhancedCalendarProps> = ({
  events = [],
  availabilitySlots = [],
  onEventCreate,
  onEventUpdate,
  onEventDelete,
  onSlotCreate,
  onSlotUpdate,
  onSlotDelete,
  view = 'month',
  date = new Date(),
  onViewChange,
  onDateChange,
}) => {
  const [currentView, setCurrentView] = useState<View>(view);
  const [currentDate, setCurrentDate] = useState<Date>(date);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<SlotInfo | null>(null);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    type: 'lesson' as 'lesson' | 'group-lesson' | 'availability' | 'other',
    description: '',
    meetingLink: '',
  });
  const [activeTab, setActiveTab] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'warning' });
  const [loading, setLoading] = useState(false);

  const generateMeetingLink = (): string => {
    return `https://meet.crm-school.com/${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleSelectSlot = useCallback((slotInfo: SlotInfo) => {
    setSelectedSlot(slotInfo);
    setOpenDialog(true);
    setNewEvent({
      title: '',
      type: 'lesson',
      description: '',
      meetingLink: generateMeetingLink(),
    });
  }, []);


  const handleSelectEvent = useCallback((event: Event) => {
    const calendarEvent = event as CalendarEvent;
    setEditingEvent(calendarEvent);
    setNewEvent({
      title: calendarEvent.title,
      type: calendarEvent.type,
      description: calendarEvent.resource?.description || '',
      meetingLink: calendarEvent.resource?.meetingLink || generateMeetingLink(),
    });
    setOpenDialog(true);
  }, []);

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedSlot(null);
    setEditingEvent(null);
    setNewEvent({
      title: '',
      type: 'lesson',
      description: '',
      meetingLink: '',
    });
  };

  const handleSaveEvent = async () => {
    try {
      setLoading(true);
      if (!selectedSlot && !editingEvent) return;

      const eventData: Omit<CalendarEvent, 'id'> = {
        title: newEvent.title,
        start: selectedSlot?.start || editingEvent?.start || new Date(),
        end: selectedSlot?.end || editingEvent?.end || new Date(),
        type: newEvent.type,
        status: 'SCHEDULED',
        resource: {
          description: newEvent.description,
          meetingLink: newEvent.meetingLink,
        },
      };

      // Проверка конфликтов перед сохранением
      const teacherId = 1; // TODO: Заменить на реальный ID преподавателя из контекста
      const conflicts = await checkScheduleConflicts(
        teacherId,
        eventData.start,
        eventData.end,
        editingEvent?.id
      );

      if (conflicts.length > 0) {
        setSnackbar({
          open: true,
          message: `Обнаружены конфликты с ${conflicts.length} событиями`,
          severity: 'warning'
        });
        setLoading(false);
        return;
      }

      if (editingEvent) {
        await onEventUpdate?.({
          ...editingEvent,
          ...eventData,
        } as CalendarEvent);
        setSnackbar({ open: true, message: 'Событие обновлено', severity: 'success' });
      } else {
        await onEventCreate?.(eventData);
        setSnackbar({ open: true, message: 'Событие создано', severity: 'success' });
      }

      handleCloseDialog();
    } catch (error) {
      setSnackbar({ open: true, message: 'Ошибка сохранения события', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!editingEvent) return;

    try {
      await onEventDelete?.(editingEvent.id);
      setSnackbar({ open: true, message: 'Событие удалено', severity: 'success' });
      handleCloseDialog();
    } catch (error) {
      setSnackbar({ open: true, message: 'Ошибка удаления события', severity: 'error' });
    }
  };

  const handleExport = async (format: 'ics' | 'pdf') => {
    try {
      if (format === 'ics') {
        console.log('Export to ICS:', events, 'schedule');
        // Реализация будет добавлена позже
      } else {
        console.log('Export to PDF:', events, 'schedule');
        // Реализация будет добавлена позже
      }
      setSnackbar({ open: true, message: `Расписание экспортировано в ${format.toUpperCase()}`, severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Ошибка экспорта', severity: 'error' });
    }
  };

  const eventStyleGetter = (event: Event) => {
    const calendarEvent = event as CalendarEvent;
    let backgroundColor = '#3174ad';
    
    switch (calendarEvent.type) {
      case 'lesson':
        backgroundColor = '#1976d2';
        break;
      case 'group-lesson':
        backgroundColor = '#2e7d32';
        break;
      case 'availability':
        backgroundColor = '#ed6c02';
        break;
      case 'other':
        backgroundColor = '#9c27b0';
        break;
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
      },
    };
  };

  const formats = {
    dateFormat: 'DD',
    dayFormat: 'DD ddd',
    weekdayFormat: 'ddd',
    monthHeaderFormat: 'MMMM YYYY',
    dayHeaderFormat: 'dddd, MMMM DD',
    agendaHeaderFormat: ({ start }: { start: Date }) =>
      moment(start).format('dddd, MMMM DD'),
  };

  const messages = {
    date: 'Дата',
    time: 'Время',
    event: 'Событие',
    allDay: 'Весь день',
    week: 'Неделя',
    work_week: 'Рабочая неделя',
    day: 'День',
    month: 'Месяц',
    previous: 'Назад',
    next: 'Вперед',
    yesterday: 'Вчера',
    tomorrow: 'Завтра',
    today: 'Сегодня',
    agenda: 'Повестка дня',
    noEventsInRange: 'Нет событий в выбранном диапазоне',
    showMore: (total: number) => `+${total} еще`,
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EventIcon color="primary" />
            <Typography variant="h5">Календарь расписания</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Создать событие">
              <IconButton
                onClick={() => setOpenDialog(true)}
                color="primary"
                sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
              >
                <AddIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Экспорт в ICS">
              <IconButton onClick={() => handleExport('ics')} color="primary">
                <DownloadIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Экспорт в PDF">
              <IconButton onClick={() => handleExport('pdf')} color="primary">
                <DownloadIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Обновить">
              <IconButton color="primary">
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 2 }}>
          <Tab icon={<EventIcon />} label="Все события" />
          <Tab icon={<VideoCallIcon />} label="Уроки" />
          <Tab icon={<EventIcon />} label="Доступность" />
        </Tabs>
      </Paper>

      <Paper sx={{ flex: 1, p: 2, position: 'relative' }}>
        {loading && (
          <LinearProgress
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 10
            }}
          />
        )}
        
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={['month', 'week', 'day', 'agenda']}
          view={currentView}
          date={currentDate}
          onView={(newView: View) => {
            setCurrentView(newView);
            onViewChange?.(newView);
          }}
          onNavigate={(newDate: Date) => {
            setCurrentDate(newDate);
            onDateChange?.(newDate);
          }}
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventStyleGetter}
          formats={formats}
          messages={messages}
          showMultiDayTimes
          culture="ru"
          style={{ height: '100%', opacity: loading ? 0.7 : 1 }}
        />

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EventIcon />
              {editingEvent ? 'Редактирование события' : 'Создание события'}
            </Box>
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Название события"
              fullWidth
              value={newEvent.title}
              onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
              <InputLabel>Тип события</InputLabel>
              <Select
                value={newEvent.type}
                onChange={(e) => setNewEvent({...newEvent, type: e.target.value as any})}
                label="Тип события"
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
              <Button onClick={handleDeleteEvent} color="error" startIcon={<EventIcon />}>
                Удалить
              </Button>
            )}
            <Button onClick={handleCloseDialog}>Отмена</Button>
            <Button
              onClick={handleSaveEvent}
              variant="contained"
              disabled={loading}
              startIcon={editingEvent ? <EventIcon /> : <AddIcon />}
            >
              {loading ? 'Сохранение...' : (editingEvent ? 'Сохранить' : 'Создать')}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({...snackbar, open: false})}
        >
          <Alert severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
};

export default EnhancedCalendar;