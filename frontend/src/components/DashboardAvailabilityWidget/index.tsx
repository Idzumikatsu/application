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
  AccessTime as AccessTimeIcon,
  CheckCircle as CheckCircleIcon,
  Block as BlockIcon,
  EventAvailable as EventAvailableIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { setSlots, setLoading, setError } from '../../store/availabilitySlice';
import AvailabilityService from '../../services/availabilityService';
import { AvailabilitySlotStatus } from '../../types';

const DashboardAvailabilityWidget: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { slots, loading, error } = useSelector((state: RootState) => state.availability);

  useEffect(() => {
    if (user?.role === 'TEACHER') {
      const loadAvailability = async () => {
        if (!user?.id || user.role !== 'TEACHER') return;
        
        dispatch(setLoading(true));
        try {
          // Get availability for the next week
          const today = new Date();
          const nextWeek = new Date();
          nextWeek.setDate(today.getDate() + 7);
          
          const startDate = today.toISOString().split('T')[0];
          const endDate = nextWeek.toISOString().split('T')[0];
          
          const data = await AvailabilityService.getTeacherAvailability(user.id, startDate, endDate);
          
          // Filter and sort slots
          const upcomingSlots = data
            .filter(slot =>
              slot.status === AvailabilitySlotStatus.AVAILABLE ||
              slot.status === AvailabilitySlotStatus.BOOKED
            )
            .sort((a, b) =>
              new Date(`${a.slotDate}T${a.slotTime}`).getTime() -
              new Date(`${b.slotDate}T${b.slotTime}`).getTime()
            )
            .slice(0, 5);
          
          dispatch(setSlots(upcomingSlots));
        } catch (err: any) {
          dispatch(setError(err.message || 'Ошибка загрузки расписания доступности'));
        } finally {
          dispatch(setLoading(false));
        }
      };
      
      loadAvailability();
    }
  }, [user?.id, user?.role, dispatch]);


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

  const getStatusIcon = (status: AvailabilitySlotStatus) => {
    switch (status) {
      case AvailabilitySlotStatus.AVAILABLE:
        return <CheckCircleIcon fontSize="small" />;
      case AvailabilitySlotStatus.BOOKED:
        return <EventAvailableIcon fontSize="small" />;
      case AvailabilitySlotStatus.BLOCKED:
        return <BlockIcon fontSize="small" />;
      default:
        return <AccessTimeIcon fontSize="small" />;
    }
  };

  const getStatusColor = (status: AvailabilitySlotStatus) => {
    switch (status) {
      case AvailabilitySlotStatus.AVAILABLE:
        return 'success';
      case AvailabilitySlotStatus.BOOKED:
        return 'warning';
      case AvailabilitySlotStatus.BLOCKED:
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: AvailabilitySlotStatus) => {
    switch (status) {
      case AvailabilitySlotStatus.AVAILABLE:
        return 'Доступен';
      case AvailabilitySlotStatus.BOOKED:
        return 'Забронирован';
      case AvailabilitySlotStatus.BLOCKED:
        return 'Заблокирован';
      default:
        return 'Неизвестно';
    }
  };

  if (user?.role !== 'TEACHER') {
    return null;
  }

  return (
    <Card elevation={3}>
      <CardHeader
        avatar={<AccessTimeIcon />}
        title="Мое расписание доступности"
        subheader={`Ближайшие слоты: ${slots.length}`}
      />
      
      <CardContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : slots.length === 0 ? (
          <Typography variant="body2" color="textSecondary" align="center" sx={{ py: 2 }}>
            Нет доступных слотов
          </Typography>
        ) : (
          <>
            <List disablePadding>
              {slots.map((slot, index) => (
                <React.Fragment key={slot.id}>
                  <ListItem alignItems="flex-start" sx={{ py: 1, px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36, mr: 1 }}>
                      <Chip 
                        label={formatDate(slot.slotDate)} 
                        color="primary" 
                        size="small" 
                        variant="outlined"
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2">
                          {formatTime(slot.slotTime)}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                          <Chip 
                            icon={getStatusIcon(slot.status)} 
                            label={getStatusText(slot.status)} 
                            color={getStatusColor(slot.status) as any}
                            size="small"
                            variant="outlined"
                          />
                          <Typography variant="caption" color="textSecondary" sx={{ ml: 1 }}>
                            {slot.durationMinutes} мин
                          </Typography>
                        </Box>
                      }
                    />
                    {slot.isBooked && (
                      <ListItemIcon sx={{ minWidth: 'auto' }}>
                        <EventAvailableIcon fontSize="small" color="warning" />
                      </ListItemIcon>
                    )}
                  </ListItem>
                  {index < slots.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button variant="outlined" size="small" startIcon={<AccessTimeIcon />}>
                Полное расписание
              </Button>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardAvailabilityWidget;