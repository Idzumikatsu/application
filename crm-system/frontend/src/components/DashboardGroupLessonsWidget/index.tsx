import React, { useEffect } from 'react';
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
} from '@mui/material';
import {
  Group as GroupIcon,
  Event as EventIcon,
  People as PeopleIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { setGroupLessons, setLoading, setError } from '../../store/lessonSlice';
import LessonService from '../../services/lessonService';
import { GroupLesson, GroupLessonStatus } from '../../types';

const DashboardGroupLessonsWidget: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { groupLessons, loading, error } = useSelector((state: RootState) => state.lessons);

  useEffect(() => {
    loadGroupLessons();
  }, [user?.id]);

  const loadGroupLessons = async () => {
    if (!user?.id) return;
    
    dispatch(setLoading(true));
    try {
      let data: GroupLesson[] = [];
      
      if (user.role === 'TEACHER') {
        // Load teacher's group lessons
        const response = await LessonService.getTeacherGroupLessons(user.id, 0, 100);
        data = response.content;
      } else if (user.role === 'STUDENT') {
        // Load student's registered group lessons
        const response = await LessonService.getStudentGroupLessons(user.id, 0, 100);
        data = response.content;
      } else {
        // For managers and admins, load all group lessons
        // This would need a new endpoint in a real implementation
        const response = await LessonService.getTeacherGroupLessons(1, 0, 100); // Dummy call
        data = response.content;
      }
      
      // Filter scheduled lessons and take first 5
      const scheduledLessons = data
        .filter(lesson => lesson.status === GroupLessonStatus.SCHEDULED)
        .sort((a, b) => 
          new Date(`${a.scheduledDate}T${a.scheduledTime}`).getTime() - 
          new Date(`${b.scheduledDate}T${b.scheduledTime}`).getTime()
        )
        .slice(0, 5);
      
      dispatch(setGroupLessons(scheduledLessons));
    } catch (err: any) {
      dispatch(setError(err.message || 'Ошибка загрузки групповых уроков'));
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

  const getStudentCountText = (current: number, max?: number) => {
    if (max) {
      return `${current}/${max}`;
    }
    return `${current}`;
  };

  return (
    <Card elevation={3}>
      <CardHeader
        avatar={<GroupIcon />}
        title="Ближайшие групповые уроки"
        subheader={`Всего запланировано: ${groupLessons.length}`}
      />
      
      <CardContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : groupLessons.length === 0 ? (
          <Typography variant="body2" color="textSecondary" align="center" sx={{ py: 2 }}>
            Нет запланированных групповых уроков
          </Typography>
        ) : (
          <>
            <List disablePadding>
              {groupLessons.map((lesson, index) => (
                <React.Fragment key={lesson.id}>
                  <ListItem alignItems="flex-start" sx={{ py: 1, px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36, mr: 1 }}>
                      <Chip 
                        label={formatDate(lesson.scheduledDate)} 
                        color="secondary" 
                        size="small" 
                        variant="outlined"
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" noWrap>
                          {lesson.lessonTopic}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ mt: 0.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                            <EventIcon sx={{ fontSize: '0.875rem', mr: 0.5, color: 'text.secondary' }} />
                            <Typography variant="caption" color="textSecondary">
                              {formatTime(lesson.scheduledTime)} • {lesson.durationMinutes} мин
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <PeopleIcon sx={{ fontSize: '0.875rem', mr: 0.5, color: 'text.secondary' }} />
                            <Typography variant="caption" color="textSecondary">
                              {getStudentCountText(lesson.currentStudents, lesson.maxStudents)} участников
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                    <ListItemIcon sx={{ minWidth: 'auto' }}>
                      <AccessTimeIcon fontSize="small" color="action" />
                    </ListItemIcon>
                  </ListItem>
                  {index < groupLessons.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button variant="outlined" size="small" startIcon={<GroupIcon />}>
                Все групповые уроки
              </Button>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardGroupLessonsWidget;