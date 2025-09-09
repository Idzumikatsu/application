import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider,
  CircularProgress,
  Button,
  IconButton,
} from '@mui/material';
import {
  CalendarToday as CalendarTodayIcon,
  Event as EventIcon,
  Group as GroupIcon,
  AccessTime as TimeIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { setLessons, setGroupLessons, setLoading, setError } from '../../store/lessonSlice';
import LessonService from '../../services/lessonService';
import { Lesson, GroupLesson, LessonStatus, GroupLessonStatus } from '../../types';

interface CalendarEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  duration: number;
  type: 'lesson' | 'group-lesson';
  status: LessonStatus | GroupLessonStatus;
  teacherName?: string;
  studentName?: string;
  groupName?: string;
}

const DashboardCalendarEventsWidget: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { lessons, groupLessons, loading, error } = useSelector((state: RootState) => state.lessons);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    loadCalendarEvents();
  }, [user?.id, currentDate]);

  const loadCalendarEvents = async () => {
    if (!user?.id) return;
    
    dispatch(setLoading(true));
    try {
      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);
      
      const startDate = today.toISOString().split('T')[0];
      const endDate = nextWeek.toISOString().split('T')[0];
      
      let allEvents: CalendarEvent[] = [];
      
      if (user.role === 'TEACHER') {
        // Load teacher's lessons and group lessons
        const teacherLessons = await LessonService.getTeacherLessons(user.id, startDate, endDate);
        const teacherGroupLessons = (await LessonService.getTeacherGroupLessons(user.id, 0, 100, startDate, endDate)).content;
        
        // Transform lessons to calendar events
        const lessonEvents: CalendarEvent[] = teacherLessons
          .filter(lesson => lesson.status === LessonStatus.SCHEDULED)
          .map(lesson => ({
            id: lesson.id,
            title: `Урок с ${lesson.student?.firstName} ${lesson.student?.lastName}`,
            date: lesson.scheduledDate,
            time: lesson.scheduledTime,
            duration: lesson.durationMinutes,
            type: 'lesson',
            status: lesson.status,
            studentName: `${lesson.student?.firstName} ${lesson.student?.lastName}`,
          }));
        
        // Transform group lessons to calendar events
        const groupLessonEvents: CalendarEvent[] = teacherGroupLessons
          .filter(groupLesson => groupLesson.status === GroupLessonStatus.SCHEDULED)
          .map(groupLesson => ({
            id: groupLesson.id,
            title: groupLesson.lessonTopic,
            date: groupLesson.scheduledDate,
            time: groupLesson.scheduledTime,
            duration: groupLesson.durationMinutes,
            type: 'group-lesson',
            status: groupLesson.status,
            groupName: groupLesson.lessonTopic,
            teacherName: `${groupLesson.teacher?.firstName} ${groupLesson.teacher?.lastName}`,
          }));
        
        allEvents = [...lessonEvents, ...groupLessonEvents];
      } else if (user.role === 'STUDENT') {
        // Load student's lessons and group lessons
        const studentLessons = await LessonService.getStudentLessons(user.id, startDate, endDate);
        const studentGroupLessons = (await LessonService.getStudentGroupLessons(user.id, 0, 100, startDate, endDate)).content;
        
        // Transform lessons to calendar events
        const lessonEvents: CalendarEvent[] = studentLessons
          .filter(lesson => lesson.status === LessonStatus.SCHEDULED)
          .map(lesson => ({
            id: lesson.id,
            title: `Урок с ${lesson.teacher?.firstName} ${lesson.teacher?.lastName}`,
            date: lesson.scheduledDate,
            time: lesson.scheduledTime,
            duration: lesson.durationMinutes,
            type: 'lesson',
            status: lesson.status,
            teacherName: `${lesson.teacher?.firstName} ${lesson.teacher?.lastName}`,
          }));
        
        // Transform group lessons to calendar events
        const groupLessonEvents: CalendarEvent[] = studentGroupLessons
          .filter(groupLesson => groupLesson.status === GroupLessonStatus.SCHEDULED)
          .map(groupLesson => ({
            id: groupLesson.id,
            title: groupLesson.lessonTopic,
            date: groupLesson.scheduledDate,
            time: groupLesson.scheduledTime,
            duration: groupLesson.durationMinutes,
            type: 'group-lesson',
            status: groupLesson.status,
            groupName: groupLesson.lessonTopic,
            teacherName: `${groupLesson.teacher?.firstName} ${groupLesson.teacher?.lastName}`,
          }));
        
        allEvents = [...lessonEvents, ...groupLessonEvents];
      } else {
        // For managers and admins, load sample data
        allEvents = [
          {
            id: 1,
            title: 'Групповой урок: Основы грамматики',
            date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            time: '10:00',
            duration: 60,
            type: 'group-lesson',
            status: GroupLessonStatus.SCHEDULED,
            groupName: 'Основы грамматики',
          },
          {
            id: 2,
            title: 'Индивидуальный урок с Петровым И.',
            date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            time: '14:00',
            duration: 45,
            type: 'lesson',
            status: LessonStatus.SCHEDULED,
            studentName: 'Петров Иван',
          },
        ];
      }
      
      // Sort events by date and time
      const sortedEvents = allEvents.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA.getTime() - dateB.getTime();
      });
      
      // Take only first 5 events
      setEvents(sortedEvents.slice(0, 5));
      dispatch(setLessons([]));
      dispatch(setGroupLessons([]));
    } catch (err: any) {
      dispatch(setError(err.message || 'Ошибка загрузки календарных событий'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Сегодня';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Завтра';
    } else {
      return date.toLocaleDateString('ru-RU', { 
        weekday: 'short', 
        day: 'numeric', 
        month: 'short' 
      });
    }
  };

  const getEventTypeIcon = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'lesson':
        return <EventIcon fontSize="small" />;
      case 'group-lesson':
        return <GroupIcon fontSize="small" />;
      default:
        return <CalendarTodayIcon fontSize="small" />;
    }
  };

  const getEventTypeColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'lesson':
        return 'primary';
      case 'group-lesson':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getEventTypeText = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'lesson':
        return 'Индивидуальный урок';
      case 'group-lesson':
        return 'Групповой урок';
      default:
        return 'Событие';
    }
  };

  return (
    <Card elevation={3}>
      <CardHeader
        avatar={<CalendarTodayIcon color="primary" />}
        title="Ближайшие события"
        subheader={`Следующие 7 дней: ${events.length} событий`}
      />
      
      <CardContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : events.length === 0 ? (
          <Typography variant="body2" color="textSecondary" align="center" sx={{ py: 2 }}>
            Нет запланированных событий
          </Typography>
        ) : (
          <>
            <List disablePadding>
              {events.map((event, index) => (
                <React.Fragment key={event.id}>
                  <ListItem 
                    alignItems="flex-start" 
                    sx={{ py: 1, px: 0, cursor: 'pointer' }}
                    onClick={() => {
                      // Navigate to event details
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36, mr: 1 }}>
                      <Chip 
                        label={formatDate(event.date)} 
                        color={getEventTypeColor(event.type) as any}
                        size="small" 
                        variant="outlined"
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" noWrap>
                          {event.title}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ mt: 0.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                            <EventIcon sx={{ fontSize: '0.875rem', mr: 0.5, color: 'text.secondary' }} />
                            <Typography variant="caption" color="textSecondary">
                              {formatTime(event.time)} • {event.duration} мин
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Chip 
                              icon={getEventTypeIcon(event.type)} 
                              label={getEventTypeText(event.type)} 
                              color={getEventTypeColor(event.type) as any}
                              size="small"
                              variant="outlined"
                              sx={{ mr: 1 }}
                            />
                            {event.studentName && (
                              <Typography variant="caption" color="textSecondary">
                                Студент: {event.studentName}
                              </Typography>
                            )}
                            {event.groupName && (
                              <Typography variant="caption" color="textSecondary">
                                Группа: {event.groupName}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      }
                    />
                    <ListItemIcon sx={{ minWidth: 'auto' }}>
                      <ArrowForwardIcon fontSize="small" color="action" />
                    </ListItemIcon>
                  </ListItem>
                  {index < events.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button variant="outlined" size="small" startIcon={<CalendarTodayIcon />}>
                Полный календарь
              </Button>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardCalendarEventsWidget;