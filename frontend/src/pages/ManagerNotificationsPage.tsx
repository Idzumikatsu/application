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
  IconButton,
  Chip,
  Divider,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import {
  Check as CheckIcon,
  DoneAll as DoneAllIcon,
  Notifications as NotificationsIcon,
  Assignment as AssignmentIcon,
  Payment as PaymentIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { RootState, AppDispatch } from '../store';
import { Notification, NotificationStatus, NotificationType } from '../types';
import { markAsRead, markAllAsRead, setLoading, setError } from '../store/notificationSlice';
import NotificationService from '../services/notificationService';

const ManagerNotificationsPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { notifications, loading, error } = useSelector((state: RootState) => state.notifications);
  const [managerNotifications, setManagerNotifications] = useState<Notification[]>([]);

  const loadNotifications = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      await NotificationService.getAllNotifications();
    } catch (err) {
      dispatch(setError('Не удалось загрузить уведомления'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  useEffect(() => {
    // Filter notifications for managers - system messages, package alerts, payment reminders
    const filtered = notifications.filter(notification => 
      notification.recipientType === 'MANAGER' || 
      notification.notificationType === NotificationType.SYSTEM_MESSAGE ||
      notification.notificationType === NotificationType.PACKAGE_ENDING_SOON ||
      notification.notificationType === NotificationType.PAYMENT_DUE
    );
    setManagerNotifications(filtered);
  }, [notifications]);


  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await NotificationService.markAsRead(notificationId);
      dispatch(markAsRead(notificationId));
    } catch (err) {
      dispatch(setError('Не удалось отметить уведомление как прочитанное'));
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await NotificationService.markAllNotificationsAsRead();
      dispatch(markAllAsRead());
    } catch (err) {
      dispatch(setError('Не удалось отметить все уведомления как прочитанные'));
    }
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.SYSTEM_MESSAGE:
        return <InfoIcon color="primary" />;
      case NotificationType.PACKAGE_ENDING_SOON:
        return <WarningIcon color="warning" />;
      case NotificationType.PAYMENT_DUE:
        return <PaymentIcon color="error" />;
      case NotificationType.LESSON_CANCELLED:
      case NotificationType.GROUP_LESSON_CANCELLED:
        return <AssignmentIcon color="error" />;
      default:
        return <NotificationsIcon color="action" />;
    }
  };

  const getNotificationTypeText = (type: NotificationType) => {
    switch (type) {
      case NotificationType.SYSTEM_MESSAGE: return 'Системное сообщение';
      case NotificationType.PACKAGE_ENDING_SOON: return 'Заканчивается пакет';
      case NotificationType.PAYMENT_DUE: return 'Оплата';
      case NotificationType.LESSON_CANCELLED: return 'Отменён урок';
      case NotificationType.GROUP_LESSON_CANCELLED: return 'Отменён групповой урок';
      default: return 'Уведомление';
    }
  };

  const getStatusColor = (status: NotificationStatus) => {
    switch (status) {
      case NotificationStatus.PENDING: return 'primary';
      case NotificationStatus.SENT: return 'info';
      case NotificationStatus.DELIVERED: return 'success';
      case NotificationStatus.READ: return 'default';
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

  const managerUnreadCount = managerNotifications.filter(n => n.status !== NotificationStatus.READ).length;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">
          Уведомления менеджера
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body1">
            Непрочитанные: {managerUnreadCount}
          </Typography>
          <Tooltip title="Отметить все как прочитанные">
            <IconButton onClick={handleMarkAllAsRead} disabled={managerUnreadCount === 0}>
              <DoneAllIcon />
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
            {managerNotifications.length === 0 ? (
              <ListItem>
                <ListItemText 
                  primary="Уведомлений нет" 
                  secondary="Здесь будут отображаться ваши уведомления менеджера" 
                />
              </ListItem>
            ) : (
              managerNotifications.map((notification) => (
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
                        <CheckIcon />
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

export default ManagerNotificationsPage;