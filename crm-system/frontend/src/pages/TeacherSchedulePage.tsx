import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
} from '@mui/material';
import { RootState } from '../store';
import { setSlots, addSlot, setLoading, setError } from '../store/availabilitySlice';
import AvailabilityService from '../services/availabilityService';
import { AvailabilitySlot, AvailabilitySlotStatus } from '../types';

const TeacherSchedulePage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { slots, loading, error } = useSelector((state: RootState) => state.availability);
  const dispatch = useDispatch();
  
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [duration, setDuration] = useState(60);
  
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);

  useEffect(() => {
    if (user?.id) {
      loadAvailabilitySlots();
    }
  }, [user?.id]);

  const loadAvailabilitySlots = async () => {
    if (!user?.id) return;
    
    dispatch(setLoading(true));
    try {
      const startDate = today.toISOString().split('T')[0];
      const endDate = nextWeek.toISOString().split('T')[0];
      const data = await AvailabilityService.getTeacherAvailability(user.id, startDate, endDate);
      dispatch(setSlots(data));
    } catch (err: any) {
      dispatch(setError(err.message || 'Ошибка загрузки расписания'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleCreateSlot = async () => {
    if (!user?.id || !selectedDate || !selectedTime) return;
    
    try {
      const newSlot = await AvailabilityService.createAvailabilitySlot({
        teacherId: user.id,
        slotDate: selectedDate,
        slotTime: selectedTime,
        durationMinutes: duration,
        isBooked: false,
        status: AvailabilitySlotStatus.AVAILABLE,
      });
      
      dispatch(addSlot(newSlot));
      handleCloseDialog();
    } catch (err: any) {
      dispatch(setError(err.message || 'Ошибка создания слота'));
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedDate('');
    setSelectedTime('');
    setDuration(60);
  };

  const getStatusColor = (status: AvailabilitySlotStatus) => {
    switch (status) {
      case AvailabilitySlotStatus.AVAILABLE: return 'success';
      case AvailabilitySlotStatus.BOOKED: return 'warning';
      case AvailabilitySlotStatus.BLOCKED: return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status: AvailabilitySlotStatus) => {
    switch (status) {
      case AvailabilitySlotStatus.AVAILABLE: return 'Доступен';
      case AvailabilitySlotStatus.BOOKED: return 'Забронирован';
      case AvailabilitySlotStatus.BLOCKED: return 'Заблокирован';
      default: return 'Неизвестно';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Мое расписание</Typography>
        <Button 
          variant="contained" 
          onClick={() => setOpenDialog(true)}
        >
          Добавить слот
        </Button>
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
        <Grid container spacing={2}>
          {slots.map((slot) => (
            <Grid item xs={12} sm={6} md={4} key={slot.id}>
              <Paper 
                sx={{ 
                  p: 2, 
                  height: '100%',
                  borderLeft: `4px solid ${getStatusColor(slot.status)}`,
                }}
              >
                <Typography variant="h6">
                  {new Date(slot.slotDate).toLocaleDateString('ru-RU', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  Время: {slot.slotTime}
                </Typography>
                <Typography variant="body1">
                  Длительность: {slot.durationMinutes} минут
                </Typography>
                <Typography variant="body1">
                  Статус: {getStatusText(slot.status)}
                </Typography>
                {slot.isBooked && (
                  <Typography variant="body2" color="textSecondary">
                    Забронирован
                  </Typography>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Добавить слот доступности</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Дата"
            type="date"
            fullWidth
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin="dense"
            label="Время"
            type="time"
            fullWidth
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Длительность (минуты)</InputLabel>
            <Select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            >
              <MenuItem value={30}>30 минут</MenuItem>
              <MenuItem value={60}>60 минут</MenuItem>
              <MenuItem value={90}>90 минут</MenuItem>
              <MenuItem value={120}>120 минут</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отмена</Button>
          <Button onClick={handleCreateSlot} variant="contained">
            Создать
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TeacherSchedulePage;