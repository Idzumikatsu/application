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
} from '@mui/material';
import { Search, Add } from '@mui/icons-material';
import { RootState } from '../store';
import { setStudents, addStudent, setLoading, setError } from '../store/userSlice';
import UserService from '../services/userService';
import { Student } from '../types';

const ManagerStudentsPage: React.FC = () => {
  const { students, loading, error } = useSelector((state: RootState) => state.users);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [newStudent, setNewStudent] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
  });

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    dispatch(setLoading(true));
    try {
      const data = await UserService.getAllStudents();
      dispatch(setStudents(data));
    } catch (err: any) {
      dispatch(setError(err.message || 'Ошибка загрузки студентов'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleCreateStudent = async () => {
    try {
      const createdStudent = await UserService.createStudent(newStudent);
      dispatch(addStudent(createdStudent));
      handleCloseDialog();
    } catch (err: any) {
      dispatch(setError(err.message || 'Ошибка создания студента'));
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewStudent({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
    });
  };

  const filteredStudents = students.filter(student =>
    student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Студенты</Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
        >
          Добавить студента
        </Button>
      </Box>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Поиск студентов..."
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
          {filteredStudents.map((student) => (
            <Grid item xs={12} sm={6} md={4} key={student.id}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6">
                  {student.firstName} {student.lastName}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  Email: {student.email}
                </Typography>
                {student.phone && (
                  <Typography variant="body1">
                    Телефон: {student.phone}
                  </Typography>
                )}
                {student.telegramUsername && (
                  <Typography variant="body1">
                    Telegram: @{student.telegramUsername}
                  </Typography>
                )}
                {student.dateOfBirth && (
                  <Typography variant="body2" color="textSecondary">
                    Дата рождения: {new Date(student.dateOfBirth).toLocaleDateString('ru-RU')}
                  </Typography>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Добавить студента</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Имя"
            fullWidth
            value={newStudent.firstName}
            onChange={(e) => setNewStudent({...newStudent, firstName: e.target.value})}
          />
          <TextField
            margin="dense"
            label="Фамилия"
            fullWidth
            value={newStudent.lastName}
            onChange={(e) => setNewStudent({...newStudent, lastName: e.target.value})}
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            value={newStudent.email}
            onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
          />
          <TextField
            margin="dense"
            label="Телефон"
            fullWidth
            value={newStudent.phone}
            onChange={(e) => setNewStudent({...newStudent, phone: e.target.value})}
          />
          <TextField
            margin="dense"
            label="Дата рождения"
            type="date"
            fullWidth
            value={newStudent.dateOfBirth}
            onChange={(e) => setNewStudent({...newStudent, dateOfBirth: e.target.value})}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отмена</Button>
          <Button onClick={handleCreateStudent} variant="contained">
            Создать
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManagerStudentsPage;