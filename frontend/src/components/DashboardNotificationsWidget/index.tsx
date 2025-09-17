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
  Badge,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Check as CheckIcon,
  Event as EventIcon,
  Group as GroupIcon,
  Assignment as AssignmentIcon,
  Payment as PaymentIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Close as CloseIcon,
  MarkEmailRead as MarkEmailReadIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { setNotifications, markAsRead, markAllAsRead, setLoading, setError } from '../../store/notificationSlice';
import NotificationService from '../../services/notificationService';
import { Notification, NotificationType, NotificationStatus } from '../../types';

const DashboardNotificationsWidget: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { notifications, loading, error } = useSelector((state: RootState) => state.notifications);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user?.id) {
      loadNotifications();
    }
  }, [user?.id]);

  useEffect(() => {
    const count = notifications.filter(n => n.status === NotificationStatus.PENDING).length;
    setUnreadCount(count);
  }, [notifications]);

  const loadNotifications = async () => {
    if (!user?.id) return;
    
    dispatch(setLoading(true));
    try {
      const response = await NotificationService.getNotifications(user.id, user.role, { size: 5, page: 0 });
      const content = response.content ?? [];
      const sortedData = content
        .sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime())
        .slice(0, 5);
      dispatch(setNotifications(sortedData));
    } catch (err: any) {
      dispatch(setError(err.message || 'Ошибка загрузки уведомлений'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await NotificationService.markNotificationAsRead(id);
      dispatch(markAsRead(id));
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
        return <EventIcon fontSize="small" />;
      case NotificationType.LESSON_CANCELLED:
        return <CloseIcon fontSize="small" />;
      case NotificationType.LESSON_REMINDER:
        return <WarningIcon fontSize="small" />;
      case NotificationType.GROUP_LESSON_SCHEDULED:
        return <GroupIcon fontSize="small" />;
      case NotificationType.GROUP_LESSON_CANCELLED:
        return <CloseIcon fontSize="small" />;
      case NotificationType.GROUP_LESSON_REMINDER:
        return <WarningIcon fontSize="small" />;
      case NotificationType.PACKAGE_ENDING_SOON:
        return <AssignmentIcon fontSize="small" />;
      case NotificationType.PAYMENT_DUE:
        return <PaymentIcon fontSize="small" />;
      case NotificationType.SYSTEM_MESSAGE:
        return <InfoIcon fontSize="small" />;
      case NotificationType.FEEDBACK_REQUEST:
        return <MarkEmailReadIcon fontSize="small" />;
      default:
        return <NotificationsIcon fontSize="small" />;
    }
  };

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case NotificationType.LESSON_SCHEDULED:
      case NotificationType.GROUP_LESSON_SCHEDULED:
        return 'primary';
      case NotificationType.LESSON_CANCELLED:
      case NotificationType.GROUP_LESSON_CANCELLED:
        return 'error';
      case NotificationType.LESSON_REMINDER:
      case NotificationType.GROUP_LESSON_REMINDER:
        return 'warning';
      case NotificationType.PACKAGE_ENDING_SOON:
        return 'secondary';
      case NotificationType.PAYMENT_DUE:
        return 'info';
      case NotificationType.SYSTEM_MESSAGE:
        return 'default';
      case NotificationType.FEEDBACK_REQUEST:
        return 'success';
      default:
        return 'default';
    }
  };

  const getNotificationText = (type: NotificationType) => {
    switch (type) {
      case NotificationType.LESSON_SCHEDULED:
        return 'Запланирован урок';
      case NotificationType.LESSON_CANCELLED:
        return 'Урок отменен';
      case NotificationType.LESSON_REMINDER:
        return 'Напоминание об уроке';
      case NotificationType.GROUP_LESSON_SCHEDULED:
        return 'Запланирован групповой урок';
      case NotificationType.GROUP_LESSON_CANCELLED:
        return 'Групповой урок отменен';
      case NotificationType.GROUP_LESSON_REMINDER:
        return 'Напоминание о групповом уроке';
      case NotificationType.PACKAGE_ENDING_SOON:
        return 'Пакет уроков заканчивается';
      case NotificationType.PAYMENT_DUE:
        return 'Оплата по расписанию';
      case NotificationType.SYSTEM_MESSAGE:
        return 'Системное сообщение';
      case NotificationType.FEEDBACK_REQUEST:
        return 'Запрос на обратную связь';
      default:
        return 'Уведомление';
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
    <Card elevation={3}>
      <CardHeader
        avatar={
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon color="secondary" />
          </Badge>
        }
        title="Последние уведомления"
        subheader={`Непрочитанных: ${unreadCount}`}
        action={
          <Button 
            size="small" 
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
          >
            Отметить все как прочитанные
          </Button>
        }
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
            Уведомлений нет
          </Typography>
        ) : (
          <>
            <List disablePadding>
              {notifications.map((notification, index) => (
                <React.Fragment key={notification.id}>
                  <ListItem 
                    alignItems="flex-start"
                    sx={{ 
                      py: 1, 
                      px: 0,
                      bgcolor: notification.status === NotificationStatus.PENDING ? 'action.hover' : 'inherit',
                      opacity: notification.status === NotificationStatus.READ ? 0.7 : 1,
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36, mr: 1 }}>
                      <Chip 
                        icon={getNotificationIcon(notification.notificationType)} 
                        label={getNotificationText(notification.notificationType)} 
                        color={getNotificationColor(notification.notificationType) as any}
                        size="small" 
                        variant="outlined"
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle2" noWrap>
                            {notification.title}
                          </Typography>
                          <Chip 
                            label={formatDate(notification.createdAt || '')} 
                            size="small" 
                            variant="outlined"
                          />
                        </Box>
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
                            <Chip 
                              label={notification.status === NotificationStatus.PENDING ? 'Новое' : 'Прочитано'} 
                              color={notification.status === NotificationStatus.PENDING ? 'error' : 'success'}
                              size="small"
                              variant="outlined"
                              sx={{ mr: 1 }}
                            />
                            {notification.priority && (
                              <Chip 
                                label={`Приоритет: ${notification.priority}`} 
                                color={notification.priority >= 5 ? "error" : notification.priority >= 3 ? "warning" : "info"}
                                size="small"
                                variant="outlined"
                              />
                            )}
                          </Box>
                        </Box>
                      }
                    />
                    {notification.status === NotificationStatus.PENDING && (
                      <ListItemIcon sx={{ minWidth: 'auto' }}>
                        <IconButton 
                          edge="end" 
                          aria-label="mark as read"
                          onClick={() => handleMarkAsRead(notification.id)}
                          size="small"
                        >
                          <CheckIcon fontSize="small" />
                        </IconButton>
                      </ListItemIcon>
                    )}
                  </ListItem>
                  {index < notifications.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button variant="outlined" size="small" startIcon={<NotificationsIcon />}>
                Все уведомления
              </Button>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardNotificationsWidget;