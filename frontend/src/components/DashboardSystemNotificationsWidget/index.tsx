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
  Alert,
} from '@mui/material';
import {
  SystemUpdate as SystemUpdateIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { setNotifications, setLoading, setError } from '../../store/notificationSlice';
import NotificationService from '../../services/notificationService';
import { Notification, NotificationType, NotificationStatus } from '../../types';

const DashboardSystemNotificationsWidget: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { notifications, loading, error } = useSelector((state: RootState) => state.notifications);
  const [systemNotifications, setSystemNotifications] = useState<Notification[]>([]);
  const [maintenanceInfo, setMaintenanceInfo] = useState<{
    scheduled: boolean;
    startTime?: string;
    endTime?: string;
    reason?: string;
  }>({
    scheduled: false,
  });

  useEffect(() => {
    if (user?.role === 'ADMIN' || user?.role === 'MANAGER') {
      loadSystemNotifications();
    }
  }, [user?.id]);

  const loadSystemNotifications = async () => {
    if (!user?.id || (user.role !== 'ADMIN' && user.role !== 'MANAGER')) return;
    
    dispatch(setLoading(true));
    try {
      const response = await NotificationService.getNotifications(user.id, user.role, {
        types: [NotificationType.SYSTEM_MESSAGE],
        size: 5,
        page: 0,
      });
      const data = response.content ?? [];

      const sysNotifications = data
        .filter(notification => notification.notificationType === NotificationType.SYSTEM_MESSAGE)
        .sort((a, b) =>
          new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
        )
        .slice(0, 5);

      dispatch(setNotifications(sysNotifications));
      setSystemNotifications(sysNotifications);
      
      // Check for maintenance notifications
      const maintenanceNotification = sysNotifications.find(n => 
        n.title?.toLowerCase().includes('техническое обслуживание') ||
        n.title?.toLowerCase().includes('maintenance')
      );
      
      if (maintenanceNotification) {
        setMaintenanceInfo({
          scheduled: true,
          startTime: maintenanceNotification.message?.match(/начало: ([\d\-: ]+)/)?.[1],
          endTime: maintenanceNotification.message?.match(/окончание: ([\d\-: ]+)/)?.[1],
          reason: maintenanceNotification.message?.match(/причина: (.+)/)?.[1],
        });
      }
    } catch (err: any) {
      dispatch(setError(err.message || 'Ошибка загрузки системных уведомлений'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.SYSTEM_MESSAGE:
        return <InfoIcon fontSize="small" />;
      case NotificationType.PAYMENT_DUE:
        return <WarningIcon fontSize="small" />;
      default:
        return <InfoIcon fontSize="small" />;
    }
  };

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case NotificationType.SYSTEM_MESSAGE:
        return 'info';
      case NotificationType.PAYMENT_DUE:
        return 'warning';
      default:
        return 'default';
    }
  };

  const getNotificationSeverity = (type: NotificationType) => {
    switch (type) {
      case NotificationType.SYSTEM_MESSAGE:
        return 'info';
      case NotificationType.PAYMENT_DUE:
        return 'warning';
      default:
        return 'info';
    }
  };

  if (user?.role !== 'ADMIN' && user?.role !== 'MANAGER') {
    return null;
  }

  return (
    <Card elevation={3}>
      <CardHeader
        avatar={<SystemUpdateIcon color="info" />}
        title="Системные уведомления"
        subheader={`Активных уведомлений: ${systemNotifications.length}`}
      />
      
      <CardContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : systemNotifications.length === 0 ? (
          <Typography variant="body2" color="textSecondary" align="center" sx={{ py: 2 }}>
            Нет системных уведомлений
          </Typography>
        ) : (
          <>
            {maintenanceInfo.scheduled && (
              <Alert 
                severity="warning" 
                icon={<ScheduleIcon fontSize="inherit" />}
                sx={{ mb: 2 }}
              >
                <Typography variant="subtitle2">
                  Запланированное техническое обслуживание
                </Typography>
                <Typography variant="body2">
                  Начало: {maintenanceInfo.startTime || 'Не указано'} • 
                  Окончание: {maintenanceInfo.endTime || 'Не указано'}
                </Typography>
                {maintenanceInfo.reason && (
                  <Typography variant="body2">
                    Причина: {maintenanceInfo.reason}
                  </Typography>
                )}
              </Alert>
            )}
            
            <List disablePadding>
              {systemNotifications.map((notification, index) => (
                <React.Fragment key={notification.id}>
                  <ListItem alignItems="flex-start" sx={{ py: 1, px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36, mr: 1 }}>
                      {getNotificationIcon(notification.notificationType)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle2" noWrap>
                            {notification.title}
                          </Typography>
                          <Chip 
                            label={formatDate(notification.createdAt || '')} 
                            color={getNotificationColor(notification.notificationType) as any}
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
                              label={getNotificationSeverity(notification.notificationType)} 
                              color={getNotificationColor(notification.notificationType) as any}
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
                  </ListItem>
                  {index < systemNotifications.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            
            {systemNotifications.length > 0 && (
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  Показаны последние {systemNotifications.length} системных уведомлений
                </Typography>
              </Alert>
            )}
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button variant="outlined" size="small" startIcon={<SystemUpdateIcon />}>
                Все системные уведомления
              </Button>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardSystemNotificationsWidget;