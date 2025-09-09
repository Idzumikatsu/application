import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
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
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Add as AddIcon,
  Event as EventIcon,
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { CalendarPicker } from '@mui/x-date-pickers/CalendarPicker';
import { ru } from 'date-fns/locale';
import { CalendarEvent } from '../../types';

interface CalendarProps {
  events?: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onEventCreate?: (date: Date) => void;
  onViewChange?: (view: 'day' | 'week' | 'month') => void;
  currentDate?: Date;
  view?: 'day' | 'week' | 'month';
}

const Calendar: React.FC<CalendarProps> = ({
  events = [],
  onEventClick,
  onEventCreate,
  onViewChange,
  currentDate: initialDate = new Date(),
  view: initialView = 'month',
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(initialDate);
  const [view, setView] = useState<'day' | 'week' | 'month'>(initialView);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    startTime: '',
    endTime: '',
    description: '',
  });

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setCurrentDate(date);
    }
  };

  const handleCreateEvent = (date: Date) => {
    setSelectedDate(date);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedDate(null);
    setNewEvent({
      title: '',
      startTime: '',
      endTime: '',
      description: '',
    });
  };

  const handleSaveEvent = () => {
    if (selectedDate && onEventCreate) {
      // Здесь должна быть логика создания события
      handleCloseDialog();
    }
  };

  const getEventsForDate = (date: Date): CalendarEvent[] => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const getDayClassName = (date: Date): string => {
    const dayEvents = getEventsForDate(date);
    if (dayEvents.length > 0) {
      return 'has-events';
    }
    return '';
  };

  const renderEvent = (event: CalendarEvent) => {
    return (
      <Box
        key={event.id}
        sx={{
          p: 1,
          mb: 0.5,
          borderRadius: 1,
          bgcolor: `${event.type === 'lesson' ? 'primary.light' : event.type === 'group-lesson' ? 'secondary.light' : 'info.light'}`,
          color: 'white',
          cursor: 'pointer',
          fontSize: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          '&:hover': {
            opacity: 0.8,
          },
        }}
        onClick={() => onEventClick && onEventClick(event)}
      >
        <EventIcon sx={{ fontSize: '0.75rem', mr: 0.5 }} />
        <Typography variant="caption" noWrap>
          {event.title}
        </Typography>
      </Box>
    );
  };

  const renderDay = (day: Date) => {
    const dayEvents = getEventsForDate(day);
    const isToday = 
      day.getDate() === new Date().getDate() &&
      day.getMonth() === new Date().getMonth() &&
      day.getFullYear() === new Date().getFullYear();
    
    return (
      <Box
        sx={{
          height: '100%',
          minHeight: 80,
          p: 0.5,
          border: isToday ? '2px solid' : '1px solid',
          borderColor: isToday ? 'primary.main' : 'divider',
          borderRadius: 1,
          bgcolor: isToday ? 'action.selected' : 'background.paper',
        }}
      >
        <Typography 
          variant="body2" 
          align="right" 
          sx={{ fontWeight: isToday ? 'bold' : 'normal' }}
        >
          {day.getDate()}
        </Typography>
        <Box sx={{ mt: 0.5, maxHeight: 60, overflow: 'hidden' }}>
          {dayEvents.slice(0, 2).map(renderEvent)}
          {dayEvents.length > 2 && (
            <Typography variant="caption" color="textSecondary">
              + ещё {dayEvents.length - 2}
            </Typography>
          )}
        </Box>
      </Box>
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={ru}>
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={() => handleDateChange(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}>
              <ChevronLeftIcon />
            </IconButton>
            <Typography variant="h6" sx={{ mx: 2 }}>
              {currentDate.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}
            </Typography>
            <IconButton onClick={() => handleDateChange(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}>
              <ChevronRightIcon />
            </IconButton>
          </Box>
          
          <Box>
            <Button
              variant={view === 'day' ? 'contained' : 'outlined'}
              onClick={() => {
                setView('day');
                onViewChange && onViewChange('day');
              }}
              sx={{ mr: 1 }}
            >
              День
            </Button>
            <Button
              variant={view === 'week' ? 'contained' : 'outlined'}
              onClick={() => {
                setView('week');
                onViewChange && onViewChange('week');
              }}
              sx={{ mr: 1 }}
            >
              Неделя
            </Button>
            <Button
              variant={view === 'month' ? 'contained' : 'outlined'}
              onClick={() => {
                setView('month');
                onViewChange && onViewChange('month');
              }}
            >
              Месяц
            </Button>
            
            {onEventCreate && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleCreateEvent(currentDate)}
                sx={{ ml: 2 }}
              >
                Добавить событие
              </Button>
            )}
          </Box>
        </Box>
        
        <Box sx={{ height: view === 'month' ? 600 : 'auto' }}>
          <CalendarPicker
            date={currentDate}
            onChange={handleDateChange}
            renderDay={renderDay}
            views={['day', 'month', 'year']}
          />
        </Box>
      </Paper>
      
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Добавить событие</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Название события"
            fullWidth
            value={newEvent.title}
            onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
          />
          <TextField
            margin="dense"
            label="Дата"
            type="date"
            fullWidth
            value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            margin="dense"
            label="Время начала"
            type="time"
            fullWidth
            value={newEvent.startTime}
            onChange={(e) => setNewEvent({...newEvent, startTime: e.target.value})}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin="dense"
            label="Время окончания"
            type="time"
            fullWidth
            value={newEvent.endTime}
            onChange={(e) => setNewEvent({...newEvent, endTime: e.target.value})}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin="dense"
            label="Описание"
            fullWidth
            multiline
            rows={3}
            value={newEvent.description}
            onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
          />
          
          <FormControl fullWidth margin="dense">
            <InputLabel>Тип события</InputLabel>
            <Select defaultValue="lesson">
              <MenuItem value="lesson">Индивидуальный урок</MenuItem>
              <MenuItem value="group-lesson">Групповой урок</MenuItem>
              <MenuItem value="other">Другое</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отмена</Button>
          <Button onClick={handleSaveEvent} variant="contained">Сохранить</Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default Calendar;