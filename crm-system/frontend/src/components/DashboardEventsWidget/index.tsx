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
  Event as EventIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
  Videocam as VideocamIcon,
  CalendarToday as CalendarTodayIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';

interface EventItem {
  id: number;
  title: string;
  description?: string;
  date: Date;
  time: string;
  duration: number;
  type: 'lesson' | 'group-lesson' | 'meeting' | 'webinar' | 'other';
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  location?: string;
  meetingLink?: string;
  participants?: Array<{
    id: number;
    name: string;
    role: 'teacher' | 'student' | 'manager' | 'admin';
  }>;
  reminderSent: boolean;
}

const DashboardEventsWidget: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [events, setEvents] = useState<EventItem[]>([
    // Demo events
    {
      id: 1,
      title: 'Индивидуальный урок: Грамматика',
      description: 'Углубленное изучение времён глаголов',
      date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      time: '10:00',
      duration: 60,
      type: 'lesson',
      status: 'scheduled',
      location: 'Онлайн',
      meetingLink: 'https://zoom.us/j/1234567890',
      participants: [
        { id: 1, name: 'Иванов И.И.', role: 'teacher' },
        { id: 2, name: 'Петров П.П.', role: 'student' },
      ],
      reminderSent: true,
    },
    {
      id: 2,
      title: 'Групповой урок: Разговорная практика',
      description: 'Тема: Путешествия и отдых',
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      time: '14:00',
      duration: 90,
      type: 'group-lesson',
      status: 'scheduled',
      location: 'Онлайн',
      meetingLink: 'https://zoom.us/j/0987654321',
      participants: [
        { id: 1, name: 'Иванов И.И.', role: 'teacher' },
        { id: 3, name: 'Сидоров С.С.', role: 'student' },
        { id: 4, name: 'Козлов К.К.', role: 'student' },
        { id: 5, name: 'Васильев В.В.', role: 'student' },
      ],
      reminderSent: false,
    },
    {
      id: 3,
      title: 'Вебинар: Эффективное изучение английского',
      description: 'Советы и рекомендации от опытных преподавателей',
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      time: '18:00',
      duration: 120,
      type: 'webinar',
      status: 'scheduled',
      location: 'Онлайн',
      meetingLink: 'https://zoom.us/j/1122334455',
      participants: [
        { id: 6, name: 'Смирнова Е.А.', role: 'teacher' },
      ],
      reminderSent: false,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadEvents();
    }
  }, [user?.id]);

  const loadEvents = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real implementation, you would fetch actual events
      // For now, we'll use demo data
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки событий');
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (type: EventItem['type']) => {
    switch (type) {
      case 'lesson':
        return <PersonIcon fontSize="small" />;
      case 'group-lesson':
        return <GroupIcon fontSize="small" />;
      case 'meeting':
        return <PeopleIcon fontSize="small" />;
      case 'webinar':
        return <OndemandVideoIcon fontSize="small" />;
      case 'other':
        return <EventIcon fontSize="small" />;
      default:
        return <EventIcon fontSize="small" />;
    }
  };

  const getEventTypeColor = (type: EventItem['type']) => {
    switch (type) {
      case 'lesson':
        return 'primary';
      case 'group-lesson':
        return 'secondary';
      case 'meeting':
        return 'info';
      case 'webinar':
        return 'warning';
      case 'other':
        return 'default';
      default:
        return 'default';
    }
  };

  const getEventTypeText = (type: EventItem['type']) => {
    switch (type) {
      case 'lesson':
        return 'Индивидуальный урок';
      case 'group-lesson':
        return 'Групповой урок';
      case 'meeting':
        return 'Встреча';
      case 'webinar':
        return 'Вебинар';
      case 'other':
        return 'Событие';
      default:
        return 'Событие';
    }
  };

  const getStatusColor = (status: EventItem['status']) => {
    switch (status) {
      case 'scheduled':
        return 'primary';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      case 'rescheduled':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: EventItem['status']) => {
    switch (status) {
      case 'scheduled':
        return 'Запланировано';
      case 'completed':
        return 'Завершено';
      case 'cancelled':
        return 'Отменено';
      case 'rescheduled':
        return 'Перенесено';
      default:
        return 'Неизвестно';
    }
  };

  const formatDate = (date: Date) => {
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

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5);
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

  const getParticipantNames = (participants?: EventItem['participants']) => {
    if (!participants || participants.length === 0) return '';
    
    return participants
      .filter(p => p.role === 'student')
      .map(p => p.name)
      .join(', ');
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
                        color="primary" 
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
                            <EventIcon sx={{ fontSize: '0.875rem', mr: 0.5, color: 'text.secondary' }} />
                            <Typography variant="caption" color="textSecondary">
                              {formatTime(event.time)} • {event.duration} мин
                            </Typography>
                            {event.location && (
                              <>
                                <Typography variant="caption" color="textSecondary" sx={{ mx: 0.5 }}>
                                  •
                                </Typography>
                                <LocationOnIcon sx={{ fontSize: '0.875rem', mr: 0.5, color: 'text.secondary' }} />
                                <Typography variant="caption" color="textSecondary">
                                  {event.location}
                                </Typography>
                              </>
                            )}
                          </Box>
                          
                          {event.description && (
                            <Typography
                              component="span"
                              variant="body2"
                              color="textPrimary"
                              sx={{ display: 'block', mb: 0.5 }}
                            >
                              {event.description}
                            </Typography>
                          )}
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                            <Chip 
                              icon={getEventIcon(event.type)} 
                              label={getEventTypeText(event.type)} 
                              color={getEventTypeColor(event.type) as any}
                              size="small"
                              variant="outlined"
                              sx={{ mr: 1, mb: 0.5 }}
                            />
                            <Chip 
                              label={getStatusText(event.status)} 
                              color={getStatusColor(event.status) as any}
                              size="small"
                              variant="outlined"
                              sx={{ mr: 1, mb: 0.5 }}
                            />
                            {event.participants && event.participants.length > 0 && (
                              <Chip 
                                icon={<PeopleIcon fontSize="small" />} 
                                label={`${event.participants.filter(p => p.role === 'student').length} студентов`} 
                                color="secondary"
                                size="small"
                                variant="outlined"
                                sx={{ mr: 1, mb: 0.5 }}
                              />
                            )}
                            {event.meetingLink && (
                              <Chip 
                                icon={<VideocamIcon fontSize="small" />} 
                                label="Видео-звонок" 
                                color="primary"
                                size="small"
                                variant="outlined"
                                sx={{ mr: 1, mb: 0.5 }}
                              />
                            )}
                          </Box>
                          
                          {event.participants && event.participants.length > 0 && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                              <Typography variant="caption" color="textSecondary" sx={{ mr: 1 }}>
                                Участники:
                              </Typography>
                              <Typography variant="caption" color="textPrimary">
                                {getParticipantNames(event.participants)}
                              </Typography>
                            </Box>
                          )}
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
                Полный календарь событий
              </Button>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardEventsWidget;