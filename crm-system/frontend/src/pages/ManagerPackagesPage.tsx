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
import { Search, Add } from '@mui/icons-material';
import { RootState } from '../store';
import { setStudents, setLoading, setError } from '../store/userSlice';
import UserService from '../services/userService';
import { Student, LessonPackage } from '../types';

const ManagerPackagesPage: React.FC = () => {
  const { students, loading, error } = useSelector((state: RootState) => state.users);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<number>(0);
  const [packageLessons, setPackageLessons] = useState<number>(10);

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

  const handleCreatePackage = async () => {
    if (!selectedStudent) return;
    
    try {
      // Здесь должна быть реализация создания пакета уроков
      // Пока используем заглушку
      console.log(`Создание пакета из ${packageLessons} уроков для студента ${selectedStudent}`);
      handleCloseDialog();
    } catch (err: any) {
      dispatch(setError(err.message || 'Ошибка создания пакета уроков'));
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedStudent(0);
    setPackageLessons(10);
  };

  const filteredStudents = students.filter(student =>
    student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Функция для получения последнего пакета студента (заглушка)
  const getLastPackage = (studentId: number): LessonPackage | null => {
    // В реальной реализации здесь будет логика получения пакета из API
    return {
      id: 1,
      studentId: studentId,
      totalLessons: 10,
      remainingLessons: 5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Пакеты уроков</Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
        >
          Создать пакет
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
          {filteredStudents.map((student) => {
            const lastPackage = getLastPackage(student.id);
            
            return (
              <Grid item xs={12} sm={6} md={4} key={student.id}>
                <Paper sx={{ p: 2, height: '100%' }}>
                  <Typography variant="h6">
                    {student.firstName} {student.lastName}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    Email: {student.email}
                  </Typography>
                  {lastPackage ? (
                    <>
                      <Typography variant="body1">
                        Всего уроков: {lastPackage.totalLessons}
                      </Typography>
                      <Typography variant="body1">
                        Осталось уроков: {lastPackage.remainingLessons}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Создан: {new Date(lastPackage.createdAt || '').toLocaleDateString('ru-RU')}
                      </Typography>
                      {lastPackage.remainingLessons <= 3 && (
                        <Typography variant="body2" color="error">
                          ⚠️ Заканчивается!
                        </Typography>
                      )}
                    </>
                  ) : (
                    <Typography variant="body1" color="textSecondary">
                      Нет активных пакетов
                    </Typography>
                  )}
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Создать пакет уроков</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Студент</InputLabel>
            <Select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(Number(e.target.value))}
            >
              {students.map(student => (
                <MenuItem key={student.id} value={student.id}>
                  {student.firstName} {student.lastName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl fullWidth margin="dense">
            <InputLabel>Количество уроков</InputLabel>
            <Select
              value={packageLessons}
              onChange={(e) => setPackageLessons(Number(e.target.value))}
            >
              <MenuItem value={5}>5 уроков</MenuItem>
              <MenuItem value={10}>10 уроков</MenuItem>
              <MenuItem value={20}>20 уроков</MenuItem>
              <MenuItem value={30}>30 уроков</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отмена</Button>
          <Button onClick={handleCreatePackage} variant="contained">
            Создать
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManagerPackagesPage;