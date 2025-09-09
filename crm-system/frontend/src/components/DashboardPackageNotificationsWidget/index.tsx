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
  Alert,
} from '@mui/material';
import {
  Warning as WarningIcon,
  Assignment as AssignmentIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { setNotifications, setLoading, setError } from '../../store/notificationSlice';
import NotificationService from '../../services/notificationService';
import { Notification, NotificationType, NotificationStatus } from '../../types';

const DashboardPackageNotificationsWidget: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { notifications, loading, error } = useSelector((state: RootState) => state.notifications);

  useEffect(() => {
    if (user?.role === 'MANAGER' || user?.role === 'ADMIN') {
      loadPackageNotifications();
    }
  }, [user?.id]);

  const loadPackageNotifications = async () => {
    if (!user?.id) return;
    
    dispatch(setLoading(true));
    try {
      // Load package-related notifications
      const data = await NotificationService.getNotificationsByType(
        user.id, 
        user.role, 
        NotificationType.PACKAGE_ENDING_SOON
      );
      
      // Filter only unread notifications and sort by date
      const packageNotifications = data
        .filter(notification => notification.status === NotificationStatus.PENDING)
        .sort((a, b) => 
          new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
        )
        .slice(0, 5);
      
      dispatch(setNotifications(packageNotifications));
    } catch (err: any) {
      dispatch(setError(err.message || 'Ошибка загрузки уведомлений о пакетах'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  if (user?.role !== 'MANAGER' && user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <Card elevation={3}>
      <CardHeader
        avatar={<WarningIcon color="warning" />}
        title="Уведомления о пакетах"
        subheader={`Требуют внимания: ${notifications.length}`}
      />
      
      <CardContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : notifications.length === 0 ? (
          <Typography variant="body2" color="textSecondary" align="center" sx={{ py: 2 }}>
            Нет уведомлений о пакетах
          </Typography>
        ) : (
          <>
            <List disablePadding>
              {notifications.map((notification, index) => (
                <React.Fragment key={notification.id}>
                  <ListItem alignItems="flex-start" sx={{ py: 1, px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36, mr: 1 }}>
                      <WarningIcon color="warning" fontSize="small" />
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
                          <Typography
                            component="span"
                            variant="caption"
                            color="textSecondary"
                          >
                            {formatDate(notification.createdAt || '')}
                          </Typography>
                        </Box>
                      }
                    />
                    <Chip 
                      label="Внимание" 
                      color="warning" 
                      size="small" 
                      variant="outlined"
                    />
                  </ListItem>
                  {index < notifications.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            
            <Alert severity="warning" sx={{ mt: 2 }}>
              <Typography variant="body2">
                У {notifications.length} студентов заканчиваются пакеты уроков
              </Typography>
            </Alert>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button variant="outlined" size="small" startIcon={<PeopleIcon />}>
                Управление студентами
              </Button>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardPackageNotificationsWidget;