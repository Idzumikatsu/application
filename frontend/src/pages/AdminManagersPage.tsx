import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Search, Add, Edit, Delete, LockReset } from '@mui/icons-material';
import { RootState } from '../store';
import { adminService } from '../services';

interface Manager {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  telegramUsername: string;
  isActive: boolean;
}

const AdminManagersPage: React.FC = () => {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingManager, setEditingManager] = useState<Manager | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    telegramUsername: '',
    isActive: true,
  });

  useEffect(() => {
    loadManagers();
  }, []);

  const loadManagers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllManagers();
      setManagers(response as unknown as Manager[]);
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки менеджеров');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateManager = async () => {
    try {
      await adminService.createManager(formData);
      handleCloseDialog();
      loadManagers();
    } catch (err: any) {
      setError(err.message || 'Ошибка создания менеджера');
    }
  };

  const handleUpdateManager = async () => {
    if (!editingManager) return;
    
    try {
      await adminService.updateManager(editingManager.id, formData);
      handleCloseDialog();
      loadManagers();
    } catch (err: any) {
      setError(err.message || 'Ошибка обновления менеджера');
    }
  };

  const handleDeleteManager = async (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить этого менеджера?')) {
      try {
        await adminService.deleteManager(id);
        loadManagers();
      } catch (err: any) {
        setError(err.message || 'Ошибка удаления менеджера');
      }
    }
  };

  const handleResetPassword = async (id: number) => {
    try {
      await adminService.resetManagerPassword(id);
      alert('Пароль сброшен успешно!');
    } catch (err: any) {
      setError(err.message || 'Ошибка сброса пароля');
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingManager(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      telegramUsername: '',
      isActive: true,
    });
  };

  const handleOpenEditDialog = (manager: Manager) => {
    setEditingManager(manager);
    setFormData({
      firstName: manager.firstName,
      lastName: manager.lastName,
      email: manager.email,
      phone: manager.phone || '',
      telegramUsername: manager.telegramUsername || '',
      isActive: manager.isActive || true,
    });
    setOpenDialog(true);
  };

  const handleOpenCreateDialog = () => {
    setEditingManager(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      telegramUsername: '',
      isActive: true,
    });
    setOpenDialog(true);
  };

  const filteredManagers = managers.filter(manager =>
    manager.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    manager.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    manager.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Управление менеджерами</Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={handleOpenCreateDialog}
        >
          Добавить менеджера
        </Button>
      </Box>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Поиск менеджеров..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconButton>
                <Search />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

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
          {filteredManagers.map((manager) => (
            <Grid item xs={12} sm={6} md={4} key={manager.id}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6">
                  {manager.firstName} {manager.lastName}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Email: {manager.email}
                </Typography>
                {manager.phone && (
                  <Typography variant="body2">
                    Телефон: {manager.phone}
                  </Typography>
                )}
                {manager.telegramUsername && (
                  <Typography variant="body2">
                    Telegram: @{manager.telegramUsername}
                  </Typography>
                )}
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Статус: {manager.isActive ? (
                    <span style={{ color: 'green' }}>Активен</span>
                  ) : (
                    <span style={{ color: 'red' }}>Неактивен</span>
                  )}
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
                  <IconButton 
                    size="small" 
                    onClick={() => handleOpenEditDialog(manager)}
                    title="Редактировать"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={() => handleResetPassword(manager.id)}
                    title="Сбросить пароль"
                  >
                    <LockReset />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={() => handleDeleteManager(manager.id)}
                    title="Удалить"
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {editingManager ? 'Редактировать менеджера' : 'Добавить менеджера'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Имя"
            fullWidth
            value={formData.firstName}
            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
          />
          <TextField
            margin="dense"
            label="Фамилия"
            fullWidth
            value={formData.lastName}
            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <TextField
            margin="dense"
            label="Телефон"
            fullWidth
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
          <TextField
            margin="dense"
            label="Telegram"
            fullWidth
            value={formData.telegramUsername}
            onChange={(e) => setFormData({...formData, telegramUsername: e.target.value})}
          />
          
          <FormControl fullWidth margin="dense">
            <InputLabel>Статус</InputLabel>
            <Select
              value={formData.isActive ? 'active' : 'inactive'}
              onChange={(e) => setFormData({...formData, isActive: e.target.value === 'active'})}
            >
              <MenuItem value="active">Активен</MenuItem>
              <MenuItem value="inactive">Неактивен</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отмена</Button>
          <Button 
            onClick={editingManager ? handleUpdateManager : handleCreateManager} 
            variant="contained"
          >
            {editingManager ? 'Сохранить' : 'Создать'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminManagersPage;