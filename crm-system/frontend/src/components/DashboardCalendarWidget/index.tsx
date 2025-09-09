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
  Person as PersonIcon,
  AccessTime as TimeIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { setLessons, setGroupLessons, setLoading, setError } from '../../store/lessonSlice';
import LessonService from '../../services/lessonService';
import { Lesson, GroupLesson, LessonStatus, GroupLessonStatus } from '../../types';

interface CalendarEvent {
  id: number;
  title: string;
  date: Date;
  time: string;
  duration: number;
  type: 'lesson' | 'group-lesson';
  status: LessonStatus | GroupLessonStatus;
  teacherName?: string;
  studentName?: string;
  groupName?: string;
}

const DashboardCalendarWidget: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { lessons, groupLessons, loading, error } = useSelector((state: RootState) => state.lessons);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');

  useEffect(() => {
    if (user?.id) {
      loadCalendarEvents();
    }
  }, [user?.id, currentDate, view]);

  const loadCalendarEvents = async () => {
    if (!user?.id) return;
    
    dispatch(setLoading(true));
    try {
      let startDate: string;
      let endDate: string;
      
      // Calculate date range based on view
      if (view === 'day') {
        startDate = currentDate.toISOString().split('T')[0];
        endDate = startDate;
      } else if (view === 'week') {
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1); // Monday
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday
        
        startDate = startOfWeek.toISOString().split('T')[0];
        endDate = endOfWeek.toISOString().split('T')[0];
      } else {
        // Month view
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        
        startDate = startOfMonth.toISOString().split('T')[0];
        endDate = endOfMonth.toISOString().split('T')[0];
      }
      
      let allEvents: CalendarEvent[] = [];
      
      if (user.role === 'TEACHER') {
        // Load teacher's lessons and group lessons
        const teacherLessons = await LessonService.getTeacherLessons(user.id, startDate, endDate);
        const teacherGroupLessons = (await LessonService.getTeacherGroupLessons(user.id, 0, 100, startDate, endDate)).content;
        
        // Transform lessons to calendar events
        const lessonEvents: CalendarEvent[] = teacherLessons.map(lesson => ({
          id: lesson.id,
          title: `Урок с ${lesson.student?.firstName} ${lesson.student?.lastName}`,
          date: new Date(`${lesson.scheduledDate}T${lesson.scheduledTime}`),
          time: lesson.scheduledTime,
          duration: lesson.durationMinutes,
          type: 'lesson',
          status: lesson.status,
          teacherName: `${lesson.teacher?.firstName} ${lesson.teacher?.lastName}`,
          studentName: `${lesson.student?.firstName} ${lesson.student?.lastName}`,
        }));
        
        // Transform group lessons to calendar events
        const groupLessonEvents: CalendarEvent[] = teacherGroupLessons.map(groupLesson => ({
          id: groupLesson.id,
          title: groupLesson.lessonTopic,
          date: new Date(`${groupLesson.scheduledDate}T${groupLesson.scheduledTime}`),
          time: groupLesson.scheduledTime,
          duration: groupLesson.durationMinutes,
          type: 'group-lesson',
          status: groupLesson.status,
          teacherName: `${groupLesson.teacher?.firstName} ${groupLesson.teacher?.lastName}`,
          groupName: groupLesson.lessonTopic,
        }));
        
        allEvents = [...lessonEvents, ...groupLessonEvents];
      } else if (user.role === 'STUDENT') {
        // Load student's lessons and group lessons
        const studentLessons = await LessonService.getStudentLessons(user.id, startDate, endDate);
        const studentGroupLessons = (await LessonService.getStudentGroupLessons(user.id, 0, 100, startDate, endDate)).content;
        
        // Transform lessons to calendar events
        const lessonEvents: CalendarEvent[] = studentLessons.map(lesson => ({
          id: lesson.id,
          title: `Урок с ${lesson.teacher?.firstName} ${lesson.teacher?.lastName}`,
          date: new Date(`${lesson.scheduledDate}T${lesson.scheduledTime}`),
          time: lesson.scheduledTime,
          duration: lesson.durationMinutes,
          type: 'lesson',
          status: lesson.status,
          teacherName: `${lesson.teacher?.firstName} ${lesson.teacher?.lastName}`,
          studentName: `${lesson.student?.firstName} ${lesson.student?.lastName}`,
        }));
        
        // Transform group lessons to calendar events
        const groupLessonEvents: CalendarEvent[] = studentGroupLessons.map(groupLesson => ({
          id: groupLesson.id,
          title: groupLesson.lessonTopic,
          date: new Date(`${groupLesson.scheduledDate}T${groupLesson.scheduledTime}`),
          time: groupLesson.scheduledTime,
          duration: groupLesson.durationMinutes,
          type: 'group-lesson',
          status: groupLesson.status,
          teacherName: `${groupLesson.teacher?.firstName} ${groupLesson.teacher?.lastName}`,
          groupName: groupLesson.lessonTopic,
        }));
        
        allEvents = [...lessonEvents, ...groupLessonEvents];
      } else {
        // For managers and admins, load sample data
        allEvents = [
          {
            id: 1,
            title: 'Групповой урок: Основы грамматики',
            date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
            time: '10:00',
            duration: 60,
            type: 'group-lesson',
            status: GroupLessonStatus.SCHEDULED,
            groupName: 'Основы грамматики',
          },
          {
            id: 2,
            title: 'Индивидуальный урок с Петровым И.',
            date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
            time: '14:00',
            duration: 45,
            type: 'lesson',
            status: LessonStatus.SCHEDULED,
            studentName: 'Петров Иван',
          },
        ];
      }
      
      // Sort events by date and time
      const sortedEvents = allEvents.sort((a, b) => a.date.getTime() - b.date.getTime());
      
      // Take only first 10 events for dashboard view
      setEvents(sortedEvents.slice(0, 10));
      dispatch(setLessons([]));
      dispatch(setGroupLessons([]));
    } catch (err: any) {
      dispatch(setError(err.message || 'Ошибка загрузки календарных событий'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    
    if (view === 'day') {
      if (direction === 'prev') {
        newDate.setDate(newDate.getDate() - 1);
      } else {
        newDate.setDate(newDate.getDate() + 1);
      }
    } else if (view === 'week') {
      if (direction === 'prev') {
        newDate.setDate(newDate.getDate() - 7);
      } else {
        newDate.setDate(newDate.getDate() + 7);
      }
    } else {
      // Month view
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
    }
    
    setCurrentDate(newDate);
  };

  const formatDate = (date: Date) => {
    if (view === 'day') {
      return date.toLocaleDateString('ru-RU', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
    } else if (view === 'week') {
      const startOfWeek = new Date(date);
      startOfWeek.setDate(date.getDate() - date.getDay() + 1); // Monday
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday
      
      return `${startOfWeek.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })} - ${endOfWeek.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })}`;
    } else {
      return date.toLocaleDateString('ru-RU', { 
        month: 'long', 
        year: 'numeric' 
      });
    }
  };

  const getEventIcon = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'lesson':
        return <PersonIcon fontSize="small" />;
      case 'group-lesson':
        return <GroupIcon fontSize="small" />;
      default:
        return <EventIcon fontSize="small" />;
    }
  };

  const getEventColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'lesson':
        return 'primary';
      case 'group-lesson':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getEventText = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'lesson':
        return 'Индивидуальный урок';
      case 'group-lesson':
        return 'Групповой урок';
      default:
        return 'Событие';
    }
  };

  const getStatusColor = (status: LessonStatus | GroupLessonStatus) => {
    switch (status) {
      case LessonStatus.SCHEDULED:
      case GroupLessonStatus.SCHEDULED:
        return 'primary';
      case LessonStatus.COMPLETED:
      case GroupLessonStatus.COMPLETED:
        return 'success';
      case LessonStatus.CANCELLED:
      case GroupLessonStatus.CANCELLED:
        return 'error';
      case LessonStatus.MISSED:
      case GroupLessonStatus.MISSED:
        return 'warning';
      case GroupLessonStatus.CONFIRMED:
        return 'info';
      case GroupLessonStatus.IN_PROGRESS:
        return 'secondary';
      case GroupLessonStatus.POSTPONED:
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: LessonStatus | GroupLessonStatus) => {
    switch (status) {
      case LessonStatus.SCHEDULED:
      case GroupLessonStatus.SCHEDULED:
        return 'Запланирован';
      case LessonStatus.COMPLETED:
      case GroupLessonStatus.COMPLETED:
        return 'Завершен';
      case LessonStatus.CANCELLED:
      case GroupLessonStatus.CANCELLED:
        return 'Отменен';
      case LessonStatus.MISSED:
      case GroupLessonStatus.MISSED:
        return 'Пропущен';
      case GroupLessonStatus.CONFIRMED:
        return 'Подтвержден';
      case GroupLessonStatus.IN_PROGRESS:
        return 'В процессе';
      case GroupLessonStatus.POSTPONED:
        return 'Перенесен';
      default:
        return 'Неизвестно';
    }
  };

  const getTimeRemaining = (eventDate: Date) => {
    const now = new Date();
    const diffMs = eventDate.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHrs = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffDays > 0) {
      return `${diffDays} дн. ${diffHrs} ч.`;
    } else if (diffHrs > 0) {
      return `${diffHrs} ч. ${diffMins} мин.`;
    } else if (diffMins > 0) {
      return `${diffMins} мин.`;
    } else {
      return 'Сейчас';
    }
  };

  return (
    <Card elevation={3}>
      <CardHeader
        avatar={<CalendarTodayIcon color="primary" />}
        title="Календарь"
        subheader={formatDate(currentDate)}
        action={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={() => navigateDate('prev')} size="small">
              <ChevronLeftIcon />
            </IconButton>
            <Chip 
              label={view === 'day' ? 'День' : view === 'week' ? 'Неделя' : 'Месяц'} 
              color="primary" 
              size="small" 
              variant="outlined"
              sx={{ mx: 1 }}
            />
            <IconButton onClick={() => navigateDate('next')} size="small">
              <ChevronRightIcon />
            </IconButton>
          </Box>
        }
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
                        icon={getEventIcon(event.type)} 
                        label={getEventText(event.type)} 
                        color={getEventColor(event.type) as any}
                        size="small" 
                        variant="outlined"
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle2" noWrap>
                            {event.title}
                          </Typography>
                          <Chip 
                            label={getTimeRemaining(event.date)} 
                            color="info" 
                            size="small" 
                            variant="outlined"
                          />
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 0.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                            <AccessTimeIcon sx={{ fontSize: '0.875rem', mr: 0.5, color: 'text.secondary' }} />
                            <Typography variant="caption" color="textSecondary">
                              {event.date.toLocaleDateString('ru-RU')} в {event.time} ({event.duration} мин)
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Chip 
                              label={getStatusText(event.status)} 
                              color={getStatusColor(event.status) as any}
                              size="small"
                              variant="outlined"
                              sx={{ mr: 1 }}
                            />
                            {event.teacherName && (
                              <Typography variant="caption" color="textSecondary">
                                Преподаватель: {event.teacherName}
                              </Typography>
                            )}
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

export default DashboardCalendarWidget;