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

interface Teacher {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  telegramUsername: string;
  isActive: boolean;
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

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllTeachers();
      setTeachers(response as unknown as Teacher[]);
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки преподавателей');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeacher = async () => {
    try {
      await adminService.createTeacher(formData);
      handleCloseDialog();
      loadTeachers();
    } catch (err: any) {
      setError(err.message || 'Ошибка создания преподавателя');
    }
  };

  const handleUpdateTeacher = async () => {
    if (!editingTeacher) return;
    
    try {
      await adminService.updateTeacher(editingTeacher.id, formData);
      handleCloseDialog();
      loadTeachers();
    } catch (err: any) {
      setError(err.message || 'Ошибка обновления преподавателя');
    }
  };

  const handleDeleteTeacher = async (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить этого преподавателя?')) {
      try {
        await adminService.deleteTeacher(id);
        loadTeachers();
      } catch (err: any) {
        setError(err.message || 'Ошибка удаления преподавателя');
      }
    }
  };

  const handleResetPassword = async (id: number) => {
    try {
      await adminService.resetTeacherPassword(id);
      alert('Пароль сброшен успешно!');
    } catch (err: any) {
      setError(err.message || 'Ошибка сброса пароля');
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
      isActive: teacher.isActive || true,
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
          {filteredTeachers.map((teacher) => (
            <Grid item xs={12} sm={6} md={4} key={teacher.id}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6">
                  {teacher.firstName} {teacher.lastName}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Email: {teacher.email}
                </Typography>
                {teacher.phone && (
                  <Typography variant="body2">
                    Телефон: {teacher.phone}
                  </Typography>
                )}
                {teacher.telegramUsername && (
                  <Typography variant="body2">
                    Telegram: @{teacher.telegramUsername}
                  </Typography>
                )}
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Статус: {teacher.isActive ? (
                    <span style={{ color: 'green' }}>Активен</span>
                  ) : (
                    <span style={{ color: 'red' }}>Неактивен</span>
                  )}
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
                  <IconButton 
                    size="small" 
                    onClick={() => handleOpenEditDialog(teacher)}
                    title="Редактировать"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={() => handleResetPassword(teacher.id)}
                    title="Сбросить пароль"
                  >
                    <LockReset />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={() => handleDeleteTeacher(teacher.id)}
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
            onClick={editingTeacher ? handleUpdateTeacher : handleCreateTeacher} 
            variant="contained"
          >
            {editingTeacher ? 'Сохранить' : 'Создать'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminTeachersPage;