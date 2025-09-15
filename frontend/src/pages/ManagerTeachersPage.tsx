import React, { useEffect, useState, useCallback } from 'react';
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
} from '@mui/material';
import { Search, Add } from '@mui/icons-material';
import { RootState } from '../store';
import { setTeachers, addTeacher, setLoading, setError } from '../store/userSlice';
import UserService from '../services/userService';
import { UserRole } from '../types';

const ManagerTeachersPage: React.FC = () => {
  const { teachers, loading, error } = useSelector((state: RootState) => state.users);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const loadTeachers = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const data = await UserService.getAllTeachers();
      dispatch(setTeachers(data));
    } catch (err: any) {
      dispatch(setError(err.message || 'Ошибка загрузки преподавателей'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    loadTeachers();
  }, [loadTeachers]);


  const handleCreateTeacher = async () => {
    try {
      const teacherData = {
        ...newTeacher,
        role: UserRole.TEACHER,
        isActive: true,
      };
      
      const createdTeacher = await UserService.createTeacher(teacherData);
      dispatch(addTeacher(createdTeacher));
      handleCloseDialog();
    } catch (err: any) {
      dispatch(setError(err.message || 'Ошибка создания преподавателя'));
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewTeacher({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    });
  };

  const filteredTeachers = teachers.filter(teacher =>
    teacher.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Преподаватели</Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
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
                <Typography variant="body1" sx={{ mt: 1 }}>
                  Email: {teacher.email}
                </Typography>
                {teacher.phone && (
                  <Typography variant="body1">
                    Телефон: {teacher.phone}
                  </Typography>
                )}
                {teacher.telegramUsername && (
                  <Typography variant="body1">
                    Telegram: @{teacher.telegramUsername}
                  </Typography>
                )}
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  Статус: {teacher.isActive ? 'Активен' : 'Неактивен'}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Добавить преподавателя</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Имя"
            fullWidth
            value={newTeacher.firstName}
            onChange={(e) => setNewTeacher({...newTeacher, firstName: e.target.value})}
          />
          <TextField
            margin="dense"
            label="Фамилия"
            fullWidth
            value={newTeacher.lastName}
            onChange={(e) => setNewTeacher({...newTeacher, lastName: e.target.value})}
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            value={newTeacher.email}
            onChange={(e) => setNewTeacher({...newTeacher, email: e.target.value})}
          />
          <TextField
            margin="dense"
            label="Телефон"
            fullWidth
            value={newTeacher.phone}
            onChange={(e) => setNewTeacher({...newTeacher, phone: e.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отмена</Button>
          <Button onClick={handleCreateTeacher} variant="contained">
            Создать
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManagerTeachersPage;