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
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { RootState } from '../store';
import { setStudents, setLoading, setError } from '../store/userSlice';
import UserService from '../services/userService';
import { Student } from '../types';

const TeacherStudentsPage: React.FC = () => {
  const { students, loading, error } = useSelector((state: RootState) => state.users);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredStudents = students.filter(student =>
    student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Мои студенты
      </Typography>

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
    </Box>
  );
};

export default TeacherStudentsPage;