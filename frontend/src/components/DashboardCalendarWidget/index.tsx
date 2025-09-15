import React, { useEffect, useState, useCallback } from 'react';
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
  Button,
  CircularProgress,
  Avatar,
} from '@mui/material';
import {
  Event as EventIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useNavigate } from 'react-router-dom';

interface CalendarEvent {
  id: number;
  type: 'individual' | 'group';
  title: string;
  studentName?: string;
  teacherName: string;
  startTime: string;
  endTime: string;
  date: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  subject?: string;
  duration: number;
  location?: string;
  meetingLink?: string;
}

const DashboardCalendarWidget: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'today' | 'tomorrow' | 'week'>('today');

  const loadCalendarEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call to fetch calendar events
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Demo data - in real implementation, fetch from API based on viewMode
      const demoEvents: CalendarEvent[] = [
        {
          id: 1,
          type: 'individual',
          title: 'Урок английского',
          studentName: 'Иванов Петр',
          teacherName: 'Смирнова Анна',
          startTime: '10:00',
          endTime: '11:00',
          date: '2025-09-10',
          status: 'confirmed',
          subject: 'Английский язык',
          duration: 60,
          meetingLink: 'https://meet.example.com/abc123',
        },
        {
          id: 2,
          type: 'individual',
          title: 'Урок математики',
          studentName: 'Петрова Мария',
          teacherName: 'Кузнецов Дмитрий',
          startTime: '12:00',
          endTime: '13:00',
          date: '2025-09-10',
          status: 'scheduled',
          subject: 'Математика',
          duration: 60,
        },
        {
          id: 3,
          type: 'group',
          title: 'Групповой урок физики',
          teacherName: 'Петров Иван',
          startTime: '15:00',
          endTime: '16:30',
          date: '2025-09-10',
          status: 'confirmed',
          subject: 'Физика',
          duration: 90,
          meetingLink: 'https://meet.example.com/group-physics',
        },
        {
          id: 4,
          type: 'individual',
          title: 'Урок химии',
          studentName: 'Козлова Елена',
          teacherName: 'Сидорова Ольга',
          startTime: '17:00',
          endTime: '18:00',
          date: '2025-09-10',
          status: 'cancelled',
          subject: 'Химия',
          duration: 60,
        },
        {
          id: 5,
          type: 'individual',
          title: 'Урок английского',
          studentName: 'Сидоров Алексей',
          teacherName: 'Смирнова Анна',
          startTime: '09:00',
          endTime: '10:00',
          date: '2025-09-11',
          status: 'confirmed',
          subject: 'Английский язык',
          duration: 60,
        },
      ];

      // Filter events based on view mode
      const today = new Date().toISOString().split('T')[0];
      const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
      
      let filteredEvents: CalendarEvent[] = [];
      
      switch (viewMode) {
        case 'today':
          filteredEvents = demoEvents.filter(event => event.date === today);
          break;
        case 'tomorrow':
          filteredEvents = demoEvents.filter(event => event.date === tomorrow);
          break;
        case 'week':
          // Show events for next 7 days
          const weekStart = new Date();
          const weekEnd = new Date(Date.now() + 7 * 86400000);
          filteredEvents = demoEvents.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate >= weekStart && eventDate <= weekEnd;
          });
          break;
      }

      setEvents(filteredEvents);
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки расписания');
    } finally {
      setLoading(false);
    }
  }, [viewMode]);

  useEffect(() => {
    if (user?.id) {
      loadCalendarEvents();
    }
  }, [user?.id, loadCalendarEvents]);

  const getStatusColor = (status: CalendarEvent['status']) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'scheduled':
        return 'info';
      case 'completed':
        return 'secondary';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: CalendarEvent['status']) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircleIcon />;
      case 'scheduled':
        return <ScheduleIcon />;
      case 'completed':
        return <CheckCircleIcon />;
      case 'cancelled':
        return <CancelIcon />;
      default:
        return <EventIcon />;
    }
  };

  const getTypeIcon = (type: CalendarEvent['type']) => {
    return type === 'individual' ? <PersonIcon /> : <SchoolIcon />;
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const getViewModeLabel = () => {
    switch (viewMode) {
      case 'today':
        return 'Сегодня';
      case 'tomorrow':
        return 'Завтра';
      case 'week':
        return 'Неделя';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <Card elevation={3}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card elevation={3}>
        <CardContent>
          <Typography color="error">{error}</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card elevation={3}>
      <CardHeader
        avatar={<EventIcon color="primary" />}
        title="Расписание уроков"
        subheader={`${getViewModeLabel()} · ${events.length} уроков`}
        action={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              size="small" 
              variant={viewMode === 'today' ? 'contained' : 'outlined'}
              onClick={() => setViewMode('today')}
            >
              Сегодня
            </Button>
            <Button 
              size="small" 
              variant={viewMode === 'tomorrow' ? 'contained' : 'outlined'}
              onClick={() => setViewMode('tomorrow')}
            >
              Завтра
            </Button>
            <Button 
              size="small" 
              variant={viewMode === 'week' ? 'contained' : 'outlined'}
              onClick={() => setViewMode('week')}
            >
              Неделя
            </Button>
          </Box>
        }
      />
      
      <CardContent>
        {events.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <EventIcon color="disabled" sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="body2" color="textSecondary">
              Нет запланированных уроков на {getViewModeLabel().toLowerCase()}
            </Typography>
            <Button 
              size="small" 
              startIcon={<ScheduleIcon />}
              onClick={() => navigate('/manager/scheduling/create')}
              sx={{ mt: 1 }}
            >
              Запланировать урок
            </Button>
          </Box>
        ) : (
          <>
            <List disablePadding>
              {events.map((event, index) => (
                <ListItem 
                  key={event.id}
                  sx={{ 
                    py: 1.5, 
                    px: 0,
                    borderBottom: index < events.length - 1 ? '1px solid' : 'none',
                    borderColor: 'divider',
                    opacity: event.status === 'cancelled' ? 0.6 : 1,
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 48 }}>
                    <Avatar sx={{ 
                      bgcolor: event.type === 'individual' ? 'primary.main' : 'secondary.main',
                      opacity: event.status === 'cancelled' ? 0.5 : 1,
                    }}>
                      {getTypeIcon(event.type)}
                    </Avatar>
                  </ListItemIcon>
                  
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mr: 1 }}>
                          {event.title}
                        </Typography>
                        <Chip 
                          label={event.status === 'confirmed' ? 'Подтвержден' : 
                                 event.status === 'scheduled' ? 'Запланирован' : 
                                 event.status === 'completed' ? 'Завершен' : 'Отменен'}
                          color={getStatusColor(event.status) as any}
                          size="small"
                          icon={getStatusIcon(event.status)}
                        />
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <Typography variant="caption" color="textSecondary" sx={{ mr: 2 }}>
                            {formatTime(event.startTime)} - {formatTime(event.endTime)}
                          </Typography>
                          <Chip 
                            label={`${event.duration} мин`}
                            color="info"
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                          {event.studentName && (
                            <Chip 
                              label={event.studentName}
                              color="primary"
                              size="small"
                              variant="outlined"
                              icon={<PersonIcon />}
                            />
                          )}
                          
                          <Chip 
                            label={event.teacherName}
                            color="secondary"
                            size="small"
                            variant="outlined"
                            icon={<SchoolIcon />}
                          />
                          
                          {event.subject && (
                            <Chip 
                              label={event.subject}
                              color="default"
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Box>
                        
                        {event.meetingLink && event.status !== 'cancelled' && (
                          <Box sx={{ mt: 1 }}>
                            <Button 
                              size="small" 
                              variant="outlined"
                              onClick={() => window.open(event.meetingLink, '_blank')}
                            >
                              Присоединиться к встрече
                            </Button>
                          </Box>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
            
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" color="textSecondary">
                Всего уроков: {events.length}
              </Typography>
              
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => navigate('/manager/scheduling')}
              >
                Полное расписание
              </Button>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardCalendarWidget;