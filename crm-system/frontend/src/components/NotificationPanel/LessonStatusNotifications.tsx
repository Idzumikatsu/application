import React from 'react';
import { Notification, NotificationType } from '../../types';
import { Box, Typography, Paper, Chip, List, ListItem, ListItemText, ListItemIcon, Divider } from '@mui/material';
import { Event, Cancel, CheckCircle, Schedule } from '@mui/icons-material';

interface LessonStatusNotificationsProps {
  notifications?: Notification[];
  maxItems?: number;
}

const LessonStatusNotifications: React.FC<LessonStatusNotificationsProps> = ({
  notifications,
  maxItems = 5
}) => {
  // const { user } = useSelector((state: RootState) => state.auth); // Не используется в текущей реализации
  
  // Фильтруем уведомления о статусах уроков
  const lessonStatusNotifications = (notifications || []).filter(n => 
    n.notificationType === NotificationType.LESSON_COMPLETED ||
    n.notificationType === NotificationType.LESSON_CANCELLED ||
    n.notificationType === NotificationType.LESSON_SCHEDULED
  ).slice(0, maxItems);

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.LESSON_COMPLETED:
        return <CheckCircle color="success" />;
      case NotificationType.LESSON_CANCELLED:
        return <Cancel color="error" />;
      case NotificationType.LESSON_SCHEDULED:
        return <Schedule color="info" />;
      default:
        return <Event color="primary" />;
    }
  };

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case NotificationType.LESSON_COMPLETED:
        return 'success.main';
      case NotificationType.LESSON_CANCELLED:
        return 'error.main';
      case NotificationType.LESSON_SCHEDULED:
        return 'info.main';
      default:
        return 'primary.main';
    }
  };

  if (lessonStatusNotifications.length === 0) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Уведомления о статусах уроков
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Нет новых уведомлений
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">
          Уведомления о статусах уроков
        </Typography>
        <Chip 
          label={`${lessonStatusNotifications.length} новых`} 
          color="primary" 
          size="small" 
        />
      </Box>

      <List dense>
        {lessonStatusNotifications.map((notification, index) => (
          <React.Fragment key={notification.id}>
            <ListItem alignItems="flex-start">
              <ListItemIcon>
                {getNotificationIcon(notification.notificationType)}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography 
                    variant="subtitle2" 
                    sx={{ color: getNotificationColor(notification.notificationType) }}
                  >
                    {notification.title}
                  </Typography>
                }
                secondary={
                  <Box>
                    <Typography variant="body2" color="text.primary" gutterBottom>
                      {notification.message}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(notification.createdAt!).toLocaleString()}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
            {index < lessonStatusNotifications.length - 1 && <Divider variant="inset" component="li" />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default LessonStatusNotifications;