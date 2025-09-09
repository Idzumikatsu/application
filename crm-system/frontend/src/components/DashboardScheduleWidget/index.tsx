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
  CalendarToday as CalendarIcon,
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

const DashboardScheduleWidget: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { lessons, groupLessons, loading, error } = useSelector((state: RootState) => state.lessons);
  const [todayEvents, setTodayEvents] = useState<Array<Lesson | GroupLesson>>([]);
  
  useEffect(() => {
    loadTodayEvents();
  }, [user?.id]);

  const loadTodayEvents = async () => {
    if (!user?.id) return;
    
    dispatch(setLoading(true));
    try {
      const today = new Date().toISOString().split('T')[0];
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];
      
      let allLessons: Lesson[] = [];
      let allGroupLessons: GroupLesson[] = [];
      
      if (user.role === 'TEACHER') {
        // Load teacher's lessons for today and tomorrow
        allLessons = await LessonService.getTeacherLessons(user.id, today, tomorrowStr);
        allGroupLessons = (await LessonService.getTeacherGroupLessons(user.id, 0, 100, today, tomorrowStr)).content;
      } else if (user.role === 'STUDENT') {
        // Load student's lessons for today and tomorrow
        allLessons = await LessonService.getStudentLessons(user.id, today, tomorrowStr);
        allGroupLessons = (await LessonService.getStudentGroupLessons(user.id, 0, 100, today, tomorrowStr)).content;
      }
      
      // Filter only scheduled events
      const scheduledLessons = allLessons.filter(lesson => 
        lesson.status === LessonStatus.SCHEDULED
      );
      
      const scheduledGroupLessons = allGroupLessons.filter(groupLesson => 
        groupLesson.status === GroupLessonStatus.SCHEDULED
      );
      
      // Combine and sort events
      const combinedEvents: Array<Lesson | GroupLesson> = [
        ...scheduledLessons,
        ...scheduledGroupLessons
      ];
      
      // Sort by time
      combinedEvents.sort((a, b) => {
        const timeA = new Date(`${a.scheduledDate}T${a.scheduledTime}`).getTime();
        const timeB = new Date(`${b.scheduledDate}T${b.scheduledTime}`).getTime();
        return timeA - timeB;
      });
      
      // Take only today's events (first 5)
      const todayEvents = combinedEvents
        .filter(event => event.scheduledDate === today)
        .slice(0, 5);
      
      setTodayEvents(todayEvents);
      dispatch(setLessons(scheduledLessons));
      dispatch(setGroupLessons(scheduledGroupLessons));
    } catch (err: any) {
      dispatch(setError(err.message || 'Ошибка загрузки расписания'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5);
  };

  const getEventTitle = (event: Lesson | GroupLesson) => {
    if ('lessonTopic' in event) {
      return event.lessonTopic;
    } else {
      if (user?.role === 'TEACHER') {
        return `Урок с ${event.student?.firstName} ${event.student?.lastName}`;
      } else {
        return `Урок с ${event.teacher?.firstName} ${event.teacher?.lastName}`;
      }
    }
  };

  const getEventIcon = (event: Lesson | GroupLesson) => {
    if ('lessonTopic' in event) {
      return <GroupIcon fontSize="small" />;
    } else {
      return <EventIcon fontSize="small" />;
    }
  };

  const getEventColor = (event: Lesson | GroupLesson) => {
    if ('lessonTopic' in event) {
      return 'secondary';
    } else {
      return 'primary';
    }
  };

  return (
    <Card elevation={3}>
      <CardHeader
        avatar={<CalendarIcon />}
        title="Сегодняшнее расписание"
        subheader={`${todayEvents.length} запланированных занятий`}
      />
      
      <CardContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : todayEvents.length === 0 ? (
          <Typography variant="body2" color="textSecondary" align="center" sx={{ py: 2 }}>
            На сегодня занятий не запланировано
          </Typography>
        ) : (
          <>
            <List disablePadding>
              {todayEvents.map((event, index) => (
                <React.Fragment key={event.id}>
                  <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36, mr: 1 }}>
                      <Chip 
                        icon={getEventIcon(event)} 
                        label={formatTime(event.scheduledTime)} 
                        color={getEventColor(event)} 
                        size="small" 
                        variant="outlined"
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" noWrap>
                          {getEventTitle(event)}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                          <TimeIcon sx={{ fontSize: '0.875rem', mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="caption" color="textSecondary">
                            {event.durationMinutes} мин
                          </Typography>
                        </Box>
                      }
                    />
                    <IconButton edge="end" size="small">
                      <ArrowForwardIcon fontSize="small" />
                    </IconButton>
                  </ListItem>
                  {index < todayEvents.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button variant="outlined" size="small">
                Перейти к полному расписанию
              </Button>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardScheduleWidget;