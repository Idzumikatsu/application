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
  ListItemSecondaryAction,
  Chip,
  IconButton,
  Button,
  CircularProgress,
  Divider,
  Badge,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  MarkEmailRead as MarkReadIcon,
  Delete as DeleteIcon,
  Event as EventIcon,
  School as SchoolIcon,
  Payment as PaymentIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { RootState } from '../store';
import { markAsRead, removeNotification, setNotifications } from '../store/notificationSlice';
import { NotificationType } from '../types';

const TeacherNotificationsPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { notifications, loading } = useSelector((state: RootState) => state.notifications);
  const dispatch = useDispatch();
  
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const loadNotifications = useCallback(async () => {
    if (user?.id) {
      // TODO: Implement fetch notifications logic
      // For now, we'll use empty notifications
      dispatch(setNotifications([]));
    }
  }, [user, dispatch]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const handleMarkAsRead = (notificationId: number) => {
    dispatch(markAsRead(notificationId));
  };

  const handleDeleteNotification = (notificationId: number) => {
    dispatch(removeNotification(notificationId));
  };

  const handleMarkAllAsRead = () => {
    notifications
      .filter(n => !n.readAt)
      .forEach(n => dispatch(markAsRead(n.id)));
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') {
      return !notification.readAt;
    }
    return true;
  });

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.LESSON_SCHEDULED:
      case NotificationType.LESSON_REMINDER:
      case NotificationType.LESSON_COMPLETED:
        return <EventIcon color="primary" />;
      case NotificationType.LESSON_CANCELLED:
        return <WarningIcon color="warning" />;
      case NotificationType.GROUP_LESSON_SCHEDULED:
      case NotificationType.GROUP_LESSON_REMINDER:
        return <SchoolIcon color="secondary" />;
      case NotificationType.PAYMENT_DUE:
      case NotificationType.PACKAGE_ENDING_SOON:
        return <PaymentIcon color="info" />;
      default:
        return <InfoIcon />;
    }
  };

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case NotificationType.LESSON_SCHEDULED:
      case NotificationType.LESSON_COMPLETED:
      case NotificationType.GROUP_LESSON_SCHEDULED:
        return 'success';
      case NotificationType.LESSON_CANCELLED:
      case NotificationType.GROUP_LESSON_CANCELLED:
        return 'error';
      case NotificationType.LESSON_REMINDER:
      case NotificationType.GROUP_LESSON_REMINDER:
        return 'warning';
      case NotificationType.PAYMENT_DUE:
      case NotificationType.PACKAGE_ENDING_SOON:
        return 'info';
      default:
        return 'default';
    }
  };

  const formatNotificationTime = (timestamp?: string) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const unreadCount = notifications.filter(n => !n.readAt).length;

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4">Уведомления</Typography>
          <Typography variant="body1" color="textSecondary">
            Все ваши системные уведомления
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
          
          <Button
            variant="outlined"
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
            startIcon={<MarkReadIcon />}
          >
            Отметить все как прочитанные
          </Button>
          
          <Chip
            label="Все"
            variant={filter === 'all' ? 'filled' : 'outlined'}
            onClick={() => setFilter('all')}
            color="primary"
          />
          
          <Chip
            label="Непрочитанные"
            variant={filter === 'unread' ? 'filled' : 'outlined'}
            onClick={() => setFilter('unread')}
            color="secondary"
          />
        </Box>
      </Box>

      {filteredNotifications.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <NotificationsIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Нет уведомлений
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Здесь будут отображаться все ваши системные уведомления
          </Typography>
        </Paper>
      ) : (
        <Paper elevation={2}>
          <List disablePadding>
            {filteredNotifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  sx={{
                    bgcolor: notification.readAt ? 'transparent' : 'action.hover',
                    '&:hover': { bgcolor: 'action.selected' }
                  }}
                >
                  <ListItemIcon>
                    {getNotificationIcon(notification.notificationType)}
                  </ListItemIcon>
                  
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: notification.readAt ? 'normal' : 'bold' }}>
                          {notification.title}
                        </Typography>
                        <Chip
                          label={notification.notificationType.replace(/_/g, ' ').toLowerCase()}
                          color={getNotificationColor(notification.notificationType) as any}
                          size="small"
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {formatNotificationTime(notification.createdAt)}
                          {notification.readAt && ` · Прочитано: ${formatNotificationTime(notification.readAt)}`}
                        </Typography>
                      </Box>
                    }
                  />
                  
                  <ListItemSecondaryAction>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {!notification.readAt && (
                        <IconButton
                          size="small"
                          onClick={() => handleMarkAsRead(notification.id)}
                          title="Отметить как прочитанное"
                        >
                          <MarkReadIcon />
                        </IconButton>
                      )}
                      
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteNotification(notification.id)}
                        color="error"
                        title="Удалить уведомление"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
                
                {index < filteredNotifications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}
      
      {filteredNotifications.length > 0 && (
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="textSecondary">
            Всего уведомлений: {filteredNotifications.length}
            {unreadCount > 0 && ` (${unreadCount} непрочитанных)`}
          </Typography>
          
          <Button
            variant="outlined"
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
            size="small"
          >
            Отметить все как прочитанные
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default TeacherNotificationsPage;