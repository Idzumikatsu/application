import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { RootState } from '../store';
import EnhancedCalendar from '../components/EnhancedCalendar';
import { CalendarEvent } from '../types';
import { getCalendarEvents, createCalendarEvent, updateCalendarEvent, deleteCalendarEvent } from '../services/scheduleService';

const ManagerSchedulingPage: React.FC = () => {
  const { teachers } = useSelector((state: RootState) => state.users);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedTeacherId) {
      loadEvents();
    } else {
      setEvents([]);
    }
  }, [selectedTeacherId]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);
      
      const calendarEvents = await getCalendarEvents(
        selectedTeacherId as number,
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0]
      );
      setEvents(calendarEvents);
    } catch (error) {
      console.error('Ошибка загрузки событий:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEventCreate = async (eventData: Omit<CalendarEvent, 'id'>) => {
    try {
      const newEvent = await createCalendarEvent({
        ...eventData,
        resource: {
          ...eventData.resource,
          teacherId: selectedTeacherId as number
        }
      });
      setEvents(prev => [...prev, newEvent]);
    } catch (error) {
      console.error('Ошибка создания события:', error);
      throw error;
    }
  };

  const handleEventUpdate = async (event: CalendarEvent) => {
    try {
      const updatedEvent = await updateCalendarEvent(event.id, event);
      setEvents(prev => prev.map(e => e.id === event.id ? updatedEvent : e));
    } catch (error) {
      console.error('Ошибка обновления события:', error);
      throw error;
    }
  };

  const handleEventDelete = async (eventId: string) => {
    try {
      await deleteCalendarEvent(eventId);
      setEvents(prev => prev.filter(e => e.id !== eventId));
    } catch (error) {
      console.error('Ошибка удаления события:', error);
      throw error;
    }
  };

  return (
    <Box sx={{ p: 3, height: '100vh' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4">Планирование уроков</Typography>
        <Typography variant="body1" color="textSecondary">
          Управление расписанием преподавателей
        </Typography>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <FormControl fullWidth>
          <InputLabel>Выберите преподавателя</InputLabel>
          <Select
            value={selectedTeacherId}
            onChange={(e) => setSelectedTeacherId(e.target.value as number)}
            label="Выберите преподавателя"
          >
            {teachers.map(teacher => (
              <MenuItem key={teacher.id} value={teacher.id}>
                {teacher.firstName} {teacher.lastName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      {selectedTeacherId ? (
        <Paper sx={{ height: 'calc(100% - 200px)' }}>
          <EnhancedCalendar
            events={events}
            onEventCreate={handleEventCreate}
            onEventUpdate={handleEventUpdate}
            onEventDelete={handleEventDelete}
          />
        </Paper>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">
            Выберите преподавателя для просмотра и редактирования расписания
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default ManagerSchedulingPage;