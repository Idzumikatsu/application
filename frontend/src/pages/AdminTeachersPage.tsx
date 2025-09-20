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

interface Teacher {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  telegramUsername: string;
  isActive: boolean;
  role?: string;
}

const AdminTeachersPage: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
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
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Loading teachers...');
      
      // Fetch real teachers from the backend API
      const teachersData: any[] = await adminService.getAllTeachers();
      
      // Transform the data to match the expected interface
      const transformedTeachers: Teacher[] = teachersData.map((teacher: any) => ({
        id: teacher.id,
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        email: teacher.email,
        phone: teacher.phone || '',
        telegramUsername: teacher.telegramUsername || '',
        isActive: teacher.isActive !== undefined ? teacher.isActive : true,
        role: teacher.role
      }));
      
      setTeachers(transformedTeachers);
      console.log('✅ Teachers loaded successfully:', transformedTeachers);
    } catch (err: any) {
      console.error('❌ Error loading teachers:', err);
      setError(err.message || 'Ошибка загрузки преподавателей');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeacher = async () => {
    try {
      console.log('🔄 Creating teacher:', formData);
      
      // Create teacher through the backend API
      await adminService.createTeacher({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        telegramUsername: formData.telegramUsername,
        isActive: formData.isActive,
      });
      
      handleCloseDialog();
      loadTeachers();
      showSnackbar('Преподаватель успешно создан!');
    } catch (err: any) {
      console.error('❌ Error creating teacher:', err);
      setError(err.message || 'Ошибка создания преподавателя');
      showSnackbar('Ошибка создания преподавателя: ' + (err.message || ''));
    }
  };

  const handleUpdateTeacher = async () => {
    if (!editingTeacher) return;
    
    try {
      console.log('🔄 Updating teacher:', editingTeacher.id, formData);
      
      // Update teacher through the backend API
      await adminService.updateTeacher(editingTeacher.id, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        telegramUsername: formData.telegramUsername,
        isActive: formData.isActive,
      });
      
      handleCloseDialog();
      loadTeachers();
      showSnackbar('Преподаватель успешно обновлен!');
    } catch (err: any) {
      console.error('❌ Error updating teacher:', err);
      setError(err.message || 'Ошибка обновления преподавателя');
      showSnackbar('Ошибка обновления преподавателя: ' + (err.message || ''));
    }
  };

  const handleDeleteTeacher = async (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить этого преподавателя?')) {
      try {
        console.log('🔄 Deleting teacher with id:', id);
        
        // Delete teacher through the backend API
        await adminService.deleteTeacher(id);
        
        loadTeachers();
        showSnackbar('Преподаватель успешно удален!');
      } catch (err: any) {
        console.error('❌ Error deleting teacher:', err);
        setError(err.message || 'Ошибка удаления преподавателя');
        showSnackbar('Ошибка удаления преподавателя: ' + (err.message || ''));
      }
    }
  };

  const handleResetPassword = async (id: number) => {
    try {
      console.log('🔄 Resetting password for teacher with id:', id);
      
      // Reset password through the backend API
      await adminService.resetTeacherPassword(id);
      
      showSnackbar('Пароль сброшен успешно!');
    } catch (err: any) {
      console.error('❌ Error resetting password:', err);
      setError(err.message || 'Ошибка сброса пароля');
      showSnackbar('Ошибка сброса пароля: ' + (err.message || ''));
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTeacher(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      telegramUsername: '',
      isActive: true,
    });
  };

  const handleOpenEditDialog = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      email: teacher.email,
      phone: teacher.phone || '',
      telegramUsername: teacher.telegramUsername || '',
      isActive: teacher.isActive !== undefined ? teacher.isActive : true,
    });
    setOpenDialog(true);
  };

  const handleOpenCreateDialog = () => {
    setEditingTeacher(null);
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

  const filteredTeachers = teachers.filter(teacher =>
    teacher.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
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
        <Typography variant="h5">Управление преподавателями</Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={handleOpenCreateDialog}
        >
          Добавить преподавателя
        </Button>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Поиск преподавателей..."
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
          onClick={loadTeachers}
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
              {filteredTeachers.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell>
                    <Typography variant="body1">
                      {teacher.firstName} {teacher.lastName}
                    </Typography>
                  </TableCell>
                  <TableCell>{teacher.email}</TableCell>
                  <TableCell>{teacher.phone || '-'}</TableCell>
                  <TableCell>
                    {teacher.telegramUsername ? `@${teacher.telegramUsername}` : '-'}
                  </TableCell>
                  <TableCell>
                    {teacher.isActive ? (
                      <Chip label="Активен" color="success" size="small" />
                    ) : (
                      <Chip label="Неактивен" color="error" size="small" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Редактировать">
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpenEditDialog(teacher)}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Сбросить пароль">
                      <IconButton 
                        size="small" 
                        onClick={() => handleResetPassword(teacher.id)}
                      >
                        <LockReset />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Удалить">
                      <IconButton 
                        size="small" 
                        onClick={() => handleDeleteTeacher(teacher.id)}
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
          {editingTeacher ? 'Редактировать преподавателя' : 'Добавить преподавателя'}
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
            onClick={editingTeacher ? handleUpdateTeacher : handleCreateTeacher} 
            variant="contained"
          >
            {editingTeacher ? 'Сохранить' : 'Создать'}
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

export default AdminTeachersPage;