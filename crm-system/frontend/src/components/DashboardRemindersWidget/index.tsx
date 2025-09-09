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
  Alarm as AlarmIcon,
  Event as EventIcon,
  Group as GroupIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { setNotifications, setLoading, setError } from '../../store/notificationSlice';
import NotificationService from '../../services/notificationService';
import { Notification, NotificationType, NotificationStatus } from '../../types';

const DashboardRemindersWidget: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { notifications, loading, error } = useSelector((state: RootState) => state.notifications);

  useEffect(() => {
    loadReminders();
  }, [user?.id]);

  const loadReminders = async () => {
    if (!user?.id) return;
    
    dispatch(setLoading(true));
    try {
      // Load reminder notifications
      let data: Notification[] = [];
      
      if (user.role === 'TEACHER') {
        // Load lesson and group lesson reminders for teachers
        const lessonReminders = await NotificationService.getNotificationsByType(
          user.id, 
          user.role, 
          NotificationType.LESSON_REMINDER
        );
        
        const groupLessonReminders = await NotificationService.getNotificationsByType(
          user.id, 
          user.role, 
          NotificationType.GROUP_LESSON_REMINDER
        );
        
        data = [...lessonReminders, ...groupLessonReminders];
      } else if (user.role === 'STUDENT') {
        // Load lesson and group lesson reminders for students
        const lessonReminders = await NotificationService.getNotificationsByType(
          user.id, 
          user.role, 
          NotificationType.LESSON_REMINDER
        );
        
        const groupLessonReminders = await NotificationService.getNotificationsByType(
          user.id, 
          user.role, 
          NotificationType.GROUP_LESSON_REMINDER
        );
        
        data = [...lessonReminders, ...groupLessonReminders];
      } else {
        // For managers and admins, load all pending reminders
        data = await NotificationService.getPendingNotifications(user.id, user.role);
      }
      
      // Filter only reminder notifications and sort by date
      const reminderNotifications = data
        .filter(notification => 
          notification.notificationType === NotificationType.LESSON_REMINDER ||
          notification.notificationType === NotificationType.GROUP_LESSON_REMINDER
        )
        .filter(notification => notification.status === NotificationStatus.PENDING)
        .sort((a, b) => 
          new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
        )
        .slice(0, 5);
      
      dispatch(setNotifications(reminderNotifications));
    } catch (err: any) {
      dispatch(setError(err.message || 'Ошибка загрузки напоминаний'));
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

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.LESSON_REMINDER:
        return <EventIcon fontSize="small" />;
      case NotificationType.GROUP_LESSON_REMINDER:
        return <GroupIcon fontSize="small" />;
      default:
        return <AlarmIcon fontSize="small" />;
    }
  };

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case NotificationType.LESSON_REMINDER:
        return 'primary';
      case NotificationType.GROUP_LESSON_REMINDER:
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getNotificationText = (type: NotificationType) => {
    switch (type) {
      case NotificationType.LESSON_REMINDER:
        return 'Напоминание об уроке';
      case NotificationType.GROUP_LESSON_REMINDER:
        return 'Напоминание о групповом уроке';
      default:
        return 'Напоминание';
    }
  };

  return (
    <Card elevation={3}>
      <CardHeader
        avatar={<AlarmIcon color="warning" />}
        title="Напоминания"
        subheader={`Активных напоминаний: ${notifications.length}`}
      />
      
      <CardContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : notifications.length === 0 ? (
          <Typography variant="body2" color="textSecondary" align="center" sx={{ py: 2 }}>
            Нет активных напоминаний
          </Typography>
        ) : (
          <>
            <List disablePadding>
              {notifications.map((notification, index) => (
                <React.Fragment key={notification.id}>
                  <ListItem alignItems="flex-start" sx={{ py: 1, px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36, mr: 1 }}>
                      <Chip 
                        icon={getNotificationIcon(notification.notificationType)} 
                        label={formatDate(notification.createdAt || '')} 
                        color={getNotificationColor(notification.notificationType) as any}
                        size="small" 
                        variant="outlined"
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" noWrap>
                          {notification.title}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ mt: 0.5 }}>
                          <Typography
                            component="span"
                            variant="body2"
                            color="textPrimary"
                          >
                            {notification.message}
                          </Typography>
                          <br />
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <TimeIcon sx={{ fontSize: '0.875rem', mr: 0.5, color: 'text.secondary' }} />
                            <Typography
                              component="span"
                              variant="caption"
                              color="textSecondary"
                            >
                              {getNotificationText(notification.notificationType)}
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                    <ListItemIcon sx={{ minWidth: 'auto' }}>
                      <AlarmIcon fontSize="small" color="warning" />
                    </ListItemIcon>
                  </ListItem>
                  {index < notifications.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button variant="outlined" size="small" startIcon={<AlarmIcon />}>
                Все напоминания
              </Button>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardRemindersWidget;