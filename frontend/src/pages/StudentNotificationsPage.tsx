import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  Check,
  Close,
  Info,
  Warning,
  Event,
  School,
  DoneAll
} from '@mui/icons-material';
import { RootState } from '../store';
import {
  setNotifications,
  markAsRead,
  markAllAsRead,
  setLoading,
  setError
} from '../store/notificationSlice';
import NotificationService from '../services/notificationService';
import { NotificationType, NotificationStatus } from '../types';

const StudentNotificationsPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { notifications, loading, error } = useSelector((state: RootState) => state.notifications);
  const dispatch = useDispatch();
  
  const [unreadCount, setUnreadCount] = useState(0);

  const loadNotifications = useCallback(async () => {
    if (!user?.id) return;
    
    dispatch(setLoading(true));
    try {
      const data = await NotificationService.getNotifications(user.id, 'STUDENT');
      dispatch(setNotifications(data));
      
      // Подсчитываем непрочитанные уведомления
      const unread = data.filter(n => n.status === NotificationStatus.PENDING).length;
      setUnreadCount(unread);
    } catch (err: any) {
      dispatch(setError(err.message || 'Ошибка загрузки уведомлений'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [user?.id, dispatch]);

  useEffect(() => {
    if (user?.id) {
      loadNotifications();
    }
  }, [user?.id, loadNotifications]);


  const handleMarkAsRead = async (id: number) => {
    try {
      await NotificationService.markAsRead(id);
      dispatch(markAsRead(id));
      setUnreadCount(prev => prev > 0 ? prev - 1 : 0);
    } catch (err: any) {
      dispatch(setError(err.message || 'Ошибка при отметке уведомления'));
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // В реальной реализации здесь будет массовая отметка всех уведомлений
      dispatch(markAllAsRead());
      setUnreadCount(0);
    } catch (err: any) {
      dispatch(setError(err.message || 'Ошибка при отметке всех уведомлений'));
    }
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.LESSON_SCHEDULED:
      case NotificationType.GROUP_LESSON_SCHEDULED:
        return <Event color="primary" />;
      case NotificationType.LESSON_CANCELLED:
      case NotificationType.GROUP_LESSON_CANCELLED:
        return <Close color="error" />;
      case NotificationType.LESSON_REMINDER:
      case NotificationType.GROUP_LESSON_REMINDER:
        return <Warning color="warning" />;
      case NotificationType.PACKAGE_ENDING_SOON:
        return <Info color="info" />;
      case NotificationType.FEEDBACK_REQUEST:
        return <School color="secondary" />;
      default:
        return <Info color="action" />;
    }
  };

  const getNotificationTypeText = (type: NotificationType) => {
    switch (type) {
      case NotificationType.LESSON_SCHEDULED: return 'Урок запланирован';
      case NotificationType.LESSON_CANCELLED: return 'Урок отменен';
      case NotificationType.LESSON_REMINDER: return 'Напоминание об уроке';
      case NotificationType.GROUP_LESSON_SCHEDULED: return 'Групповой урок запланирован';
      case NotificationType.GROUP_LESSON_CANCELLED: return 'Групповой урок отменен';
      case NotificationType.GROUP_LESSON_REMINDER: return 'Напоминание о групповом уроке';
      case NotificationType.PACKAGE_ENDING_SOON: return 'Пакет уроков заканчивается';
      case NotificationType.FEEDBACK_REQUEST: return 'Запрос на обратную связь';
      default: return 'Уведомление';
    }
  };

  const getStatusColor = (status: NotificationStatus) => {
    switch (status) {
      case NotificationStatus.PENDING: return 'default';
      case NotificationStatus.SENT: return 'primary';
      case NotificationStatus.DELIVERED: return 'secondary';
      case NotificationStatus.READ: return 'success';
      case NotificationStatus.FAILED: return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status: NotificationStatus) => {
    switch (status) {
      case NotificationStatus.PENDING: return 'Новое';
      case NotificationStatus.SENT: return 'Отправлено';
      case NotificationStatus.DELIVERED: return 'Доставлено';
      case NotificationStatus.READ: return 'Прочитано';
      case NotificationStatus.FAILED: return 'Ошибка';
      default: return 'Неизвестно';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('ru-RU');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">
          Уведомления
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body1">
            Непрочитанные: {unreadCount}
          </Typography>
          <Tooltip title="Отметить все как прочитанные">
            <IconButton onClick={handleMarkAllAsRead} disabled={unreadCount === 0}>
              <DoneAll />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper>
          <List>
            {notifications.length === 0 ? (
              <ListItem>
                <ListItemText 
                  primary="Уведомлений нет" 
                  secondary="Здесь будут отображаться ваши уведомления" 
                />
              </ListItem>
            ) : (
              notifications.map((notification) => (
                <React.Fragment key={notification.id}>
                  <ListItem 
                    alignItems="flex-start"
                    sx={{ 
                      bgcolor: notification.status === NotificationStatus.PENDING ? 'action.hover' : 'inherit',
                      opacity: notification.status === NotificationStatus.READ ? 0.7 : 1
                    }}
                  >
                    <ListItemIcon>
                      {getNotificationIcon(notification.notificationType)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="h6">
                            {notification.title || getNotificationTypeText(notification.notificationType)}
                          </Typography>
                          <Chip 
                            label={getStatusText(notification.status)} 
                            color={getStatusColor(notification.status)}
                            size="small"
                          />
                        </Box>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="body2"
                            color="textPrimary"
                          >
                            {notification.message}
                          </Typography>
                          <br />
                          <Typography
                            component="span"
                            variant="caption"
                            color="textSecondary"
                          >
                            {formatDate(notification.createdAt || '')}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                    {notification.status !== NotificationStatus.READ && (
                      <IconButton 
                        edge="end" 
                        aria-label="mark as read"
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        <Check />
                      </IconButton>
                    )}
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))
            )}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default StudentNotificationsPage;