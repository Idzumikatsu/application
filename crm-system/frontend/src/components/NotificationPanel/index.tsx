import React, { useEffect, useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Typography,
  Box,
  IconButton,
  Badge,
  CircularProgress,
} from '@mui/material';
import {
  Close as CloseIcon,
  Check as CheckIcon,
  Event as EventIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  School as SchoolIcon,
  Group as GroupIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { 
  setNotifications, 
  markAsRead, 
  markAllAsRead, 
  setLoading, 
  setError 
} from '../../store/notificationSlice';
import NotificationService from '../../services/notificationService';
import { Notification, NotificationType, NotificationStatus } from '../../types';

interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;
  onNotificationClick?: (notification: Notification) => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ 
  open, 
  onClose,
  onNotificationClick 
}) => {
  const dispatch: AppDispatch = useDispatch();
  const { notifications, loading, error } = useSelector((state: RootState) => state.notifications);
  const { user } = useSelector((state: RootState) => state.auth);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (open && user?.id) {
      loadNotifications();
    }
  }, [open, user?.id]);

  useEffect(() => {
    const unread = notifications.filter(n => n.status === NotificationStatus.PENDING).length;
    setUnreadCount(unread);
  }, [notifications]);

  const loadNotifications = async () => {
    if (!user?.id) return;
    
    dispatch(setLoading(true));
    try {
      const data = await NotificationService.getNotifications(user.id, user.role);
      dispatch(setNotifications(data));
    } catch (err: any) {
      dispatch(setError(err.message || 'Ошибка загрузки уведомлений'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      const updatedNotification = await NotificationService.markAsRead(id);
      dispatch(markAsRead(id));
      
      // Find the notification and trigger the click handler if provided
      const notification = notifications.find(n => n.id === id);
      if (notification && onNotificationClick) {
        onNotificationClick(notification);
      }
    } catch (err: any) {
      dispatch(setError(err.message || 'Ошибка при отметке уведомления'));
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await NotificationService.markAllAsRead(user!.id, user!.role);
      dispatch(markAllAsRead());
    } catch (err: any) {
      dispatch(setError(err.message || 'Ошибка при отметке всех уведомлений'));
    }
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.LESSON_SCHEDULED:
        return <EventIcon color="primary" />;
      case NotificationType.LESSON_CANCELLED:
        return <CancelIcon color="error" />;
      case NotificationType.LESSON_REMINDER:
        return <WarningIcon color="warning" />;
      case NotificationType.LESSON_COMPLETED:
        return <CheckIcon color="success" />;
      case NotificationType.GROUP_LESSON_SCHEDULED:
        return <GroupIcon color="primary" />;
      case NotificationType.GROUP_LESSON_CANCELLED:
        return <CancelIcon color="error" />;
      case NotificationType.GROUP_LESSON_REMINDER:
        return <WarningIcon color="warning" />;
      case NotificationType.PACKAGE_ENDING_SOON:
        return <InfoIcon color="info" />;
      case NotificationType.PAYMENT_DUE:
        return <InfoIcon color="info" />;
      case NotificationType.SYSTEM_MESSAGE:
        return <InfoIcon color="action" />;
      case NotificationType.FEEDBACK_REQUEST:
        return <SchoolIcon color="secondary" />;
      default:
        return <InfoIcon color="action" />;
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
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box
        sx={{
          width: 400,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ p: 2, bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              Уведомления
            </Typography>
            <Box>
              {unreadCount > 0 && (
                <IconButton onClick={handleMarkAllAsRead} size="small">
                  <CheckIcon />
                </IconButton>
              )}
              <IconButton onClick={onClose} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
          {unreadCount > 0 && (
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Непрочитанных: {unreadCount}
            </Typography>
          )}
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, p: 2 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ p: 2 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        ) : (
          <List sx={{ flex: 1, overflow: 'auto' }}>
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
                      opacity: notification.status === NotificationStatus.READ ? 0.7 : 1,
                    }}
                  >
                    <ListItemIcon>
                      {getNotificationIcon(notification.notificationType)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" component="div">
                          {notification.title}
                        </Typography>
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
                    <ListItemSecondaryAction>
                      {notification.status !== NotificationStatus.READ && (
                        <IconButton 
                          edge="end" 
                          aria-label="mark as read"
                          onClick={() => handleMarkAsRead(notification.id)}
                          size="small"
                        >
                          <CheckIcon fontSize="small" />
                        </IconButton>
                      )}
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))
            )}
          </List>
        )}
      </Box>
    </Drawer>
  );
};

export default NotificationPanel;