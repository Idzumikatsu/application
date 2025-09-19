import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from '@mui/material';
import {
  Add,
  Notifications,
  Email,
  Send,
  Delete,
  Refresh,
  Check,
  Close,
} from '@mui/icons-material';
import { adminService } from '../services';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'LESSON_SCHEDULED' | 'LESSON_CANCELLED' | 'PAYMENT_DUE' | 'SYSTEM_MESSAGE' | 'OTHER';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'PENDING' | 'SENT' | 'DELIVERED' | 'FAILED';
  recipientType: 'STUDENT' | 'TEACHER' | 'MANAGER' | 'ALL';
  recipientId?: number;
  createdAt: string;
  sentAt?: string;
}

const AdminNotificationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'SYSTEM_MESSAGE' as Notification['type'],
    priority: 'MEDIUM' as Notification['priority'],
    recipientType: 'ALL' as Notification['recipientType'],
    recipientId: undefined as number | undefined,
  });
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, [activeTab]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // This would be implemented in adminService
      // const response = await adminService.getNotifications(activeTab);
      // setNotifications(response as unknown as Notification[]);
      
      // For now, we'll use mock data
      const mockNotifications: Notification[] = [
        {
          id: 1,
          title: 'Новый урок запланирован',
          message: 'Ваш урок по английскому языку запланирован на завтра в 15:00.',
          type: 'LESSON_SCHEDULED',
          priority: 'HIGH',
          status: 'DELIVERED',
          recipientType: 'STUDENT',
          createdAt: '2025-09-18T10:00:00Z',
          sentAt: '2025-09-18T10:05:00Z',
        },
        {
          id: 2,
          title: 'Отмена урока',
          message: 'Ваш урок на сегодня отменен по техническим причинам.',
          type: 'LESSON_CANCELLED',
          priority: 'HIGH',
          status: 'DELIVERED',
          recipientType: 'STUDENT',
          createdAt: '2025-09-18T08:00:00Z',
          sentAt: '2025-09-18T08:05:00Z',
        },
        {
          id: 3,
          title: 'Оплата по расписанию',
          message: 'Напоминаем о необходимости оплаты следующего пакета уроков.',
          type: 'PAYMENT_DUE',
          priority: 'MEDIUM',
          status: 'SENT',
          recipientType: 'STUDENT',
          createdAt: '2025-09-17T12:00:00Z',
          sentAt: '2025-09-17T12:05:00Z',
        },
        {
          id: 4,
          title: 'Системное сообщение',
          message: 'Плановое техническое обслуживание системы запланировано на выходные.',
          type: 'SYSTEM_MESSAGE',
          priority: 'LOW',
          status: 'PENDING',
          recipientType: 'ALL',
          createdAt: '2025-09-16T09:00:00Z',
        },
      ];
      
      setNotifications(mockNotifications);
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки уведомлений');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNotification = async () => {
    try {
      // This would be implemented in adminService
      // const response = await adminService.createNotification(newNotification);
      // setNotifications(prev => [response as unknown as Notification, ...prev]);
      
      setOpenDialog(false);
      setNewNotification({
        title: '',
        message: '',
        type: 'SYSTEM_MESSAGE',
        priority: 'MEDIUM',
        recipientType: 'ALL',
        recipientId: undefined,
      });
    } catch (err: any) {
      setError(err.message || 'Ошибка создания уведомления');
    }
  };

  const handleSendNotification = async (id: number) => {
    try {
      // This would be implemented in adminService
      // await adminService.sendNotification(id);
      // setNotifications(prev => prev.map(n => n.id === id ? {...n, status: 'SENT', sentAt: new Date().toISOString()} : n));
    } catch (err: any) {
      setError(err.message || 'Ошибка отправки уведомления');
    }
  };

  const handleDeleteNotification = async (id: number) => {
    try {
      // This would be implemented in adminService
      // await adminService.deleteNotification(id);
      // setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err: any) {
      setError(err.message || 'Ошибка удаления уведомления');
    }
  };

  const handleBatchDelete = async () => {
    try {
      // This would be implemented in adminService
      // await adminService.batchDeleteNotifications(selectedNotifications);
      // setNotifications(prev => prev.filter(n => !selectedNotifications.includes(n.id)));
      setSelectedNotifications([]);
      setSelectAll(false);
    } catch (err: any) {
      setError(err.message || 'Ошибка массового удаления уведомлений');
    }
  };

  const handleBatchSend = async () => {
    try {
      // This would be implemented in adminService
      // await adminService.batchSendNotifications(selectedNotifications);
      // setNotifications(prev => prev.map(n => selectedNotifications.includes(n.id) ? {...n, status: 'SENT', sentAt: new Date().toISOString()} : n));
      setSelectedNotifications([]);
      setSelectAll(false);
    } catch (err: any) {
      setError(err.message || 'Ошибка массовой отправки уведомлений');
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(notifications.map(n => n.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectNotification = (id: number) => {
    if (selectedNotifications.includes(id)) {
      setSelectedNotifications(prev => prev.filter(nId => nId !== id));
    } else {
      setSelectedNotifications(prev => [...prev, id]);
    }
  };

  const getNotificationTypeLabel = (type: Notification['type']) => {
    switch (type) {
      case 'LESSON_SCHEDULED': return 'Урок запланирован';
      case 'LESSON_CANCELLED': return 'Урок отменен';
      case 'PAYMENT_DUE': return 'Оплата по расписанию';
      case 'SYSTEM_MESSAGE': return 'Системное сообщение';
      case 'OTHER': return 'Другое';
      default: return type;
    }
  };

  const getNotificationTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'LESSON_SCHEDULED': return 'success';
      case 'LESSON_CANCELLED': return 'error';
      case 'PAYMENT_DUE': return 'warning';
      case 'SYSTEM_MESSAGE': return 'info';
      case 'OTHER': return 'default';
      default: return 'default';
    }
  };

  const getPriorityLabel = (priority: Notification['priority']) => {
    switch (priority) {
      case 'HIGH': return 'Высокий';
      case 'MEDIUM': return 'Средний';
      case 'LOW': return 'Низкий';
      default: return priority;
    }
  };

  const getStatusLabel = (status: Notification['status']) => {
    switch (status) {
      case 'PENDING': return 'Ожидает';
      case 'SENT': return 'Отправлено';
      case 'DELIVERED': return 'Доставлено';
      case 'FAILED': return 'Ошибка';
      default: return status;
    }
  };

  const getStatusColor = (status: Notification['status']) => {
    switch (status) {
      case 'PENDING': return 'warning';
      case 'SENT': return 'info';
      case 'DELIVERED': return 'success';
      case 'FAILED': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Управление уведомлениями</Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
        >
          Создать уведомление
        </Button>
      </Box>

      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        indicatorColor="secondary"
        textColor="inherit"
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 3 }}
      >
        <Tab label="Все уведомления" />
        <Tab label="Ожидают отправки" />
        <Tab label="Отправленные" />
        <Tab label="Доставленные" />
        <Tab label="С ошибками" />
      </Tabs>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={loadNotifications}
            disabled={loading}
            sx={{ mr: 1 }}
          >
            Обновить
          </Button>
          
          {selectedNotifications.length > 0 && (
            <>
              <Button
                variant="outlined"
                startIcon={<Send />}
                onClick={handleBatchSend}
                sx={{ mr: 1 }}
              >
                Отправить ({selectedNotifications.length})
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<Delete />}
                onClick={handleBatchDelete}
                color="error"
              >
                Удалить ({selectedNotifications.length})
              </Button>
            </>
          )}
        </Box>
        
        <FormControlLabel
          control={
            <Checkbox
              checked={selectAll}
              onChange={handleSelectAll}
            />
          }
          label={`Выбрать все (${notifications.length})`}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Заголовок</TableCell>
                <TableCell>Тип</TableCell>
                <TableCell>Приоритет</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell>Получатель</TableCell>
                <TableCell>Дата создания</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {notifications.map((notification) => (
                <TableRow key={notification.id}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedNotifications.includes(notification.id)}
                      onChange={() => handleSelectNotification(notification.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" fontWeight="bold">
                      {notification.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {notification.message}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={getNotificationTypeLabel(notification.type)} 
                      color={getNotificationTypeColor(notification.type) as any} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={getPriorityLabel(notification.priority)} 
                      color={notification.priority === 'HIGH' ? 'error' : notification.priority === 'MEDIUM' ? 'warning' : 'info'} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={getStatusLabel(notification.status)} 
                      color={getStatusColor(notification.status) as any} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    {notification.recipientType === 'ALL' ? 'Все пользователи' : notification.recipientType}
                    {notification.recipientId && ` (ID: ${notification.recipientId})`}
                  </TableCell>
                  <TableCell>
                    {new Date(notification.createdAt).toLocaleDateString('ru-RU')}
                  </TableCell>
                  <TableCell>
                    {notification.status === 'PENDING' && (
                      <Tooltip title="Отправить">
                        <IconButton 
                          size="small" 
                          onClick={() => handleSendNotification(notification.id)}
                        >
                          <Send />
                        </IconButton>
                      </Tooltip>
                    )}
                    
                    <Tooltip title="Удалить">
                      <IconButton 
                        size="small" 
                        onClick={() => handleDeleteNotification(notification.id)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Notifications />
            Создать уведомление
          </Box>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Заголовок"
            fullWidth
            value={newNotification.title}
            onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
            sx={{ mb: 2 }}
          />
          
          <TextField
            margin="dense"
            label="Сообщение"
            fullWidth
            multiline
            rows={4}
            value={newNotification.message}
            onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
            sx={{ mb: 2 }}
          />
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Тип уведомления</InputLabel>
            <Select
              value={newNotification.type}
              onChange={(e) => setNewNotification({...newNotification, type: e.target.value as Notification['type']})}
            >
              <MenuItem value="LESSON_SCHEDULED">Урок запланирован</MenuItem>
              <MenuItem value="LESSON_CANCELLED">Урок отменен</MenuItem>
              <MenuItem value="PAYMENT_DUE">Оплата по расписанию</MenuItem>
              <MenuItem value="SYSTEM_MESSAGE">Системное сообщение</MenuItem>
              <MenuItem value="OTHER">Другое</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Приоритет</InputLabel>
            <Select
              value={newNotification.priority}
              onChange={(e) => setNewNotification({...newNotification, priority: e.target.value as Notification['priority']})}
            >
              <MenuItem value="LOW">Низкий</MenuItem>
              <MenuItem value="MEDIUM">Средний</MenuItem>
              <MenuItem value="HIGH">Высокий</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Получатель</InputLabel>
            <Select
              value={newNotification.recipientType}
              onChange={(e) => setNewNotification({
                ...newNotification, 
                recipientType: e.target.value as Notification['recipientType'],
                recipientId: undefined
              })}
            >
              <MenuItem value="ALL">Все пользователи</MenuItem>
              <MenuItem value="STUDENT">Студенты</MenuItem>
              <MenuItem value="TEACHER">Преподаватели</MenuItem>
              <MenuItem value="MANAGER">Менеджеры</MenuItem>
            </Select>
          </FormControl>
          
          {newNotification.recipientType !== 'ALL' && (
            <TextField
              margin="dense"
              label="ID получателя (опционально)"
              fullWidth
              type="number"
              value={newNotification.recipientId || ''}
              onChange={(e) => setNewNotification({
                ...newNotification, 
                recipientId: e.target.value ? parseInt(e.target.value) : undefined
              })}
              sx={{ mb: 2 }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Отмена</Button>
          <Button 
            onClick={handleCreateNotification} 
            variant="contained"
            startIcon={<Notifications />}
          >
            Создать
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminNotificationsPage;