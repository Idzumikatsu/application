import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
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
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Snackbar,
  Alert,
} from '@mui/material';
import { Search, Add, Edit, Delete, LockReset, Refresh } from '@mui/icons-material';
import adminService from '@/services/adminService';

interface Manager {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  telegramUsername: string;
  isActive: boolean;
  role?: string;
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
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    loadManagers();
  }, []);

  const loadManagers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Loading managers...');
      
      // Fetch real managers from the backend API
      const managersData: any[] = await adminService.getAllManagers();
      
      // Transform the data to match the expected interface
      const transformedManagers: Manager[] = managersData.map((manager: any) => ({
        id: manager.id,
        firstName: manager.firstName,
        lastName: manager.lastName,
        email: manager.email,
        phone: manager.phone || '',
        telegramUsername: manager.telegramUsername || '',
        isActive: manager.isActive !== undefined ? manager.isActive : true,
        role: manager.role
      }));
      
      setManagers(transformedManagers);
      console.log('✅ Managers loaded successfully:', transformedManagers);
    } catch (err: any) {
      console.error('❌ Error loading managers:', err);
      setError(err.message || 'Ошибка загрузки менеджеров');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateManager = async () => {
    try {
      console.log('🔄 Creating manager:', formData);
      
      // Create manager through the backend API
      await adminService.createManager({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        telegramUsername: formData.telegramUsername,
        isActive: formData.isActive,
      });
      
      handleCloseDialog();
      loadManagers();
      showSnackbar('Менеджер успешно создан!');
    } catch (err: any) {
      console.error('❌ Error creating manager:', err);
      setError(err.message || 'Ошибка создания менеджера');
      showSnackbar('Ошибка создания менеджера: ' + (err.message || ''));
    }
  };

  const handleUpdateManager = async () => {
    if (!editingManager) return;
    
    try {
      console.log('🔄 Updating manager:', editingManager.id, formData);
      
      // Update manager through the backend API
      await adminService.updateManager(editingManager.id, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        telegramUsername: formData.telegramUsername,
        isActive: formData.isActive,
      });
      
      handleCloseDialog();
      loadManagers();
      showSnackbar('Менеджер успешно обновлен!');
    } catch (err: any) {
      console.error('❌ Error updating manager:', err);
      setError(err.message || 'Ошибка обновления менеджера');
      showSnackbar('Ошибка обновления менеджера: ' + (err.message || ''));
    }
  };

  const handleDeleteManager = async (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить этого менеджера?')) {
      try {
        console.log('🔄 Deleting manager with id:', id);
        
        // Delete manager through the backend API
        await adminService.deleteManager(id);
        
        loadManagers();
        showSnackbar('Менеджер успешно удален!');
      } catch (err: any) {
        console.error('❌ Error deleting manager:', err);
        setError(err.message || 'Ошибка удаления менеджера');
        showSnackbar('Ошибка удаления менеджера: ' + (err.message || ''));
      }
    }
  };

  const handleResetPassword = async (id: number) => {
    try {
      console.log('🔄 Resetting password for manager with id:', id);
      
      // Reset password through the backend API
      await adminService.resetManagerPassword(id);
      
      showSnackbar('Пароль сброшен успешно!');
    } catch (err: any) {
      console.error('❌ Error resetting password:', err);
      setError(err.message || 'Ошибка сброса пароля');
      showSnackbar('Ошибка сброса пароля: ' + (err.message || ''));
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
      isActive: manager.isActive !== undefined ? manager.isActive : true,
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

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

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

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
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
          sx={{ maxWidth: 400 }}
        />
        
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={loadManagers}
          disabled={loading}
          sx={{ ml: 2 }}
        >
          Обновить
        </Button>
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
                <TableCell>Имя</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Телефон</TableCell>
                <TableCell>Telegram</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredManagers.map((manager) => (
                <TableRow key={manager.id}>
                  <TableCell>
                    <Typography variant="body1">
                      {manager.firstName} {manager.lastName}
                    </Typography>
                  </TableCell>
                  <TableCell>{manager.email}</TableCell>
                  <TableCell>{manager.phone || '-'}</TableCell>
                  <TableCell>
                    {manager.telegramUsername ? `@${manager.telegramUsername}` : '-'}
                  </TableCell>
                  <TableCell>
                    {manager.isActive ? (
                      <Chip label="Активен" color="success" size="small" />
                    ) : (
                      <Chip label="Неактивен" color="error" size="small" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Редактировать">
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpenEditDialog(manager)}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Сбросить пароль">
                      <IconButton 
                        size="small" 
                        onClick={() => handleResetPassword(manager.id)}
                      >
                        <LockReset />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Удалить">
                      <IconButton 
                        size="small" 
                        onClick={() => handleDeleteManager(manager.id)}
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
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Фамилия"
            fullWidth
            value={formData.lastName}
            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Телефон"
            fullWidth
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Telegram"
            fullWidth
            value={formData.telegramUsername}
            onChange={(e) => setFormData({...formData, telegramUsername: e.target.value})}
            sx={{ mb: 2 }}
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

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default AdminManagersPage;