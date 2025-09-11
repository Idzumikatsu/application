import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Paper } from '@mui/material';
import { RootState } from '../store';
import EnhancedCalendar from '../components/EnhancedCalendar';
import { CalendarEvent, AvailabilitySlot } from '../types';
import { getCalendarEvents, createCalendarEvent, updateCalendarEvent, deleteCalendarEvent } from '../services/scheduleService';

const TeacherSchedulePage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);
      
      const calendarEvents = await getCalendarEvents(
        user!.id,
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0]
      );
      setEvents(calendarEvents);
    } catch (error) {
      console.error('Ошибка загрузки событий:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      loadEvents();
    }
  }, [user?.id, loadEvents]);
  const handleEventCreate = async (eventData: Omit<CalendarEvent, 'id'>) => {
    try {
      const newEvent = await createCalendarEvent({
        ...eventData,
        resource: {
          ...eventData.resource,
          teacherId: user!.id
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
        <Typography variant="h4">Расписание уроков</Typography>
        <Typography variant="body1" color="textSecondary">
          Просмотр и управление вашим расписанием
        </Typography>
      </Box>

      <Paper sx={{ height: 'calc(100% - 100px)' }}>
        <EnhancedCalendar
          events={events}
          onEventCreate={handleEventCreate}
          onEventUpdate={handleEventUpdate}
          onEventDelete={handleEventDelete}
        />
      </Paper>
    </Box>
  );
};

export default TeacherSchedulePage;