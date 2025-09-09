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
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { RootState } from '../store';
import { setSlots, addSlot, updateSlot, removeSlot, setLoading, setError } from '../store/availabilitySlice';
import AvailabilityService from '../services/availabilityService';
import { AvailabilitySlot, AvailabilitySlotStatus } from '../types';

const TeacherAvailabilityPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { slots, loading, error } = useSelector((state: RootState) => state.availability);
  const dispatch = useDispatch();
  
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSlot, setEditingSlot] = useState<AvailabilitySlot | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [duration, setDuration] = useState(60);
  const [status, setStatus] = useState<AvailabilitySlotStatus>(AvailabilitySlotStatus.AVAILABLE);

  useEffect(() => {
    if (user?.id) {
      loadAvailabilitySlots();
    }
  }, [user?.id]);

  const loadAvailabilitySlots = async () => {
    if (!user?.id) return;
    
    dispatch(setLoading(true));
    try {
      const today = new Date();
      const nextMonth = new Date();
      nextMonth.setMonth(today.getMonth() + 1);
      
      const startDate = today.toISOString().split('T')[0];
      const endDate = nextMonth.toISOString().split('T')[0];
      
      const data = await AvailabilityService.getTeacherAvailability(user.id, startDate, endDate);
      dispatch(setSlots(data));
    } catch (err: any) {
      dispatch(setError(err.message || 'Ошибка загрузки слотов доступности'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleCreateSlot = async () => {
    if (!user?.id || !selectedDate || !selectedTime) return;
    
    try {
      const slotData = {
        teacherId: user.id,
        slotDate: selectedDate,
        slotTime: selectedTime,
        durationMinutes: duration,
        isBooked: false,
        status: status,
      };

      if (editingSlot) {
        const updatedSlot = await AvailabilityService.updateAvailabilitySlot(editingSlot.id, slotData);
        dispatch(updateSlot(updatedSlot));
      } else {
        const newSlot = await AvailabilityService.createAvailabilitySlot(slotData);
        dispatch(addSlot(newSlot));
      }
      
      handleCloseDialog();
    } catch (err: any) {
      dispatch(setError(err.message || 'Ошибка сохранения слота'));
    }
  };

  const handleEditSlot = (slot: AvailabilitySlot) => {
    setEditingSlot(slot);
    setSelectedDate(slot.slotDate);
    setSelectedTime(slot.slotTime);
    setDuration(slot.durationMinutes);
    setStatus(slot.status);
    setOpenDialog(true);
  };

  const handleDeleteSlot = async (slotId: number) => {
    try {
      await AvailabilityService.deleteAvailabilitySlot(slotId);
      dispatch(removeSlot(slotId));
    } catch (err: any) {
      dispatch(setError(err.message || 'Ошибка удаления слота'));
    }
  };

  const handleBlockSlot = async (slot: AvailabilitySlot) => {
    try {
      const updatedSlot = await AvailabilityService.updateAvailabilitySlot(slot.id, {
        ...slot,
        status: AvailabilitySlotStatus.BLOCKED,
        isBooked: false,
      });
      dispatch(updateSlot(updatedSlot));
    } catch (err: any) {
      dispatch(setError(err.message || 'Ошибка блокировки слота'));
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingSlot(null);
    setSelectedDate('');
    setSelectedTime('');
    setDuration(60);
    setStatus(AvailabilitySlotStatus.AVAILABLE);
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

  const getStatusIcon = (status: AvailabilitySlotStatus) => {
    switch (status) {
      case AvailabilitySlotStatus.AVAILABLE: return <CheckCircleIcon />;
      case AvailabilitySlotStatus.BOOKED: return <CheckCircleIcon />;
      case AvailabilitySlotStatus.BLOCKED: return <BlockIcon />;
      default: return <CheckCircleIcon />;
    }
  };

  const groupedSlots = slots.reduce((acc, slot) => {
    const dateKey = slot.slotDate;
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(slot);
    return acc;
  }, {} as Record<string, AvailabilitySlot[]>);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4">Управление доступностью</Typography>
          <Typography variant="body1" color="textSecondary">
            Настройка времени для проведения уроков
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
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
        <Box>
          {Object.keys(groupedSlots).length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Нет доступных слотов
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Добавьте слоты доступности для проведения уроков
              </Typography>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={() => setOpenDialog(true)}
              >
                Добавить первый слот
              </Button>
            </Paper>
          ) : (
            Object.entries(groupedSlots)
              .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
              .map(([date, dateSlots]) => (
                <Box key={date} sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    {new Date(date).toLocaleDateString('ru-RU', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </Typography>
                  
                  <Grid container spacing={2}>
                    {dateSlots.map((slot) => (
                      <Grid item xs={12} sm={6} md={4} key={slot.id}>
                        <Paper 
                          sx={{ 
                            p: 2, 
                            position: 'relative',
                            borderLeft: `4px solid`,
                            borderColor: `${getStatusColor(slot.status)}.main`,
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                            <Chip 
                              label={getStatusText(slot.status)}
                              color={getStatusColor(slot.status)}
                              size="small"
                              icon={getStatusIcon(slot.status)}
                            />
                            
                            <Box>
                              <Tooltip title="Редактировать">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleEditSlot(slot)}
                                  disabled={slot.isBooked}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              
                              {slot.status !== AvailabilitySlotStatus.BLOCKED && (
                                <Tooltip title="Заблокировать">
                                  <IconButton 
                                    size="small" 
                                    onClick={() => handleBlockSlot(slot)}
                                    disabled={slot.isBooked}
                                  >
                                    <BlockIcon />
                                  </IconButton>
                                </Tooltip>
                              )}
                              
                              <Tooltip title="Удалить">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleDeleteSlot(slot.id)}
                                  disabled={slot.isBooked}
                                  color="error"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Box>
                          
                          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            {slot.slotTime}
                          </Typography>
                          
                          <Typography variant="body2" color="textSecondary">
                            Длительность: {slot.durationMinutes} минут
                          </Typography>
                          
                          {slot.isBooked && (
                            <Typography variant="caption" color="warning.main">
                              Забронирован студентом
                            </Typography>
                          )}
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ))
          )}
        </Box>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingSlot ? 'Редактирование слота' : 'Добавление слота доступности'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Дата"
            type="date"
            fullWidth
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          
          <TextField
            margin="dense"
            label="Время"
            type="time"
            fullWidth
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          
          <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
            <InputLabel>Длительность (минуты)</InputLabel>
            <Select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              label="Длительность (минуты)"
            >
              <MenuItem value={30}>30 минут</MenuItem>
              <MenuItem value={45}>45 минут</MenuItem>
              <MenuItem value={60}>60 минут</MenuItem>
              <MenuItem value={90}>90 минут</MenuItem>
              <MenuItem value={120}>120 минут</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl fullWidth margin="dense">
            <InputLabel>Статус</InputLabel>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value as AvailabilitySlotStatus)}
              label="Статус"
            >
              <MenuItem value={AvailabilitySlotStatus.AVAILABLE}>Доступен</MenuItem>
              <MenuItem value={AvailabilitySlotStatus.BLOCKED}>Заблокирован</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отмена</Button>
          <Button onClick={handleCreateSlot} variant="contained">
            {editingSlot ? 'Сохранить' : 'Создать'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TeacherAvailabilityPage;