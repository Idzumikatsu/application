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
  Rating,
} from '@mui/material';
import {
  RateReview as RateReviewIcon,
  School as SchoolIcon,
  People as PeopleIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { setNotifications, setLoading, setError } from '../../store/notificationSlice';
import NotificationService from '../../services/notificationService';
import { Notification, NotificationType, NotificationStatus } from '../../types';

const DashboardFeedbackWidget: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { notifications, loading, error } = useSelector((state: RootState) => state.notifications);

  useEffect(() => {
    loadFeedbackRequests();
  }, [user?.id]);

  const loadFeedbackRequests = async () => {
    if (!user?.id) return;
    
    dispatch(setLoading(true));
    try {
      // Load feedback request notifications
      let data: Notification[] = [];
      
      if (user.role === 'TEACHER') {
        // Load feedback requests for teachers
        data = await NotificationService.getNotificationsByType(
          user.id, 
          user.role, 
          NotificationType.FEEDBACK_REQUEST
        );
      } else if (user.role === 'STUDENT') {
        // Load feedback requests for students
        data = await NotificationService.getNotificationsByType(
          user.id, 
          user.role, 
          NotificationType.FEEDBACK_REQUEST
        );
      } else {
        // For managers and admins, load all feedback requests
        data = await NotificationService.getNotificationsByType(
          user.id, 
          user.role, 
          NotificationType.FEEDBACK_REQUEST
        );
      }
      
      // Filter only pending feedback requests and sort by date
      const feedbackRequests = data
        .filter(notification => notification.status === NotificationStatus.PENDING)
        .sort((a, b) => 
          new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
        )
        .slice(0, 5);
      
      dispatch(setNotifications(feedbackRequests));
    } catch (err: any) {
      dispatch(setError(err.message || 'Ошибка загрузки запросов на обратную связь'));
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

  const getFeedbackType = (notification: Notification) => {
    if (notification.message?.includes('урок')) {
      return 'individual';
    } else if (notification.message?.includes('групп')) {
      return 'group';
    } else {
      return 'general';
    }
  };

  const getFeedbackIcon = (type: string) => {
    switch (type) {
      case 'individual':
        return <SchoolIcon fontSize="small" />;
      case 'group':
        return <PeopleIcon fontSize="small" />;
      default:
        return <RateReviewIcon fontSize="small" />;
    }
  };

  const getFeedbackColor = (type: string) => {
    switch (type) {
      case 'individual':
        return 'primary';
      case 'group':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getFeedbackText = (type: string) => {
    switch (type) {
      case 'individual':
        return 'Индивидуальный урок';
      case 'group':
        return 'Групповой урок';
      default:
        return 'Обратная связь';
    }
  };

  // Simulate rating for demo purposes
  const getRandomRating = () => {
    return Math.floor(Math.random() * 5) + 1;
  };

  return (
    <Card elevation={3}>
      <CardHeader
        avatar={<RateReviewIcon color="secondary" />}
        title="Запросы на обратную связь"
        subheader={`Ожидают ответа: ${notifications.length}`}
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
            Нет запросов на обратную связь
          </Typography>
        ) : (
          <>
            <List disablePadding>
              {notifications.map((notification, index) => {
                const feedbackType = getFeedbackType(notification);
                const rating = getRandomRating();
                
                return (
                  <React.Fragment key={notification.id}>
                    <ListItem alignItems="flex-start" sx={{ py: 1, px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36, mr: 1 }}>
                        <Chip 
                          icon={getFeedbackIcon(feedbackType)} 
                          label={getFeedbackText(feedbackType)} 
                          color={getFeedbackColor(feedbackType) as any}
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
                              <StarIcon sx={{ fontSize: '0.875rem', mr: 0.5, color: 'text.secondary' }} />
                              <Typography
                                component="span"
                                variant="caption"
                                color="textSecondary"
                              >
                                {formatDate(notification.createdAt || '')}
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                      <ListItemIcon sx={{ minWidth: 'auto' }}>
                        <Rating 
                          value={rating} 
                          readOnly 
                          size="small" 
                          emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                        />
                      </ListItemIcon>
                    </ListItem>
                    {index < notifications.length - 1 && <Divider />}
                  </React.Fragment>
                );
              })}
            </List>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button variant="outlined" size="small" startIcon={<RateReviewIcon />}>
                Все отзывы
              </Button>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardFeedbackWidget;