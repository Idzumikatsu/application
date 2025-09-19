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
import { Search, Add, Edit, Delete } from '@mui/icons-material';
import { RootState } from '../store';
import { adminService } from '../services';

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  telegramUsername: string;
  assignedTeacherId: number | null;
  assignedTeacherName: string | null;
}

const AdminStudentsPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    telegramUsername: '',
    assignedTeacherId: null as number | null,
  });

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllStudents();
      setStudents(response as unknown as Student[]);
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки студентов');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStudent = async () => {
    try {
      await adminService.createStudent(formData);
      handleCloseDialog();
      loadStudents();
    } catch (err: any) {
      setError(err.message || 'Ошибка создания студента');
    }
  };

  const handleUpdateStudent = async () => {
    if (!editingStudent) return;
    
    try {
      await adminService.updateStudent(editingStudent.id, formData);
      handleCloseDialog();
      loadStudents();
    } catch (err: any) {
      setError(err.message || 'Ошибка обновления студента');
    }
  };

  const handleDeleteStudent = async (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить этого студента?')) {
      try {
        await adminService.deleteStudent(id);
        loadStudents();
      } catch (err: any) {
        setError(err.message || 'Ошибка удаления студента');
      }
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingStudent(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      telegramUsername: '',
      assignedTeacherId: null,
    });
  };

  const handleOpenEditDialog = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      phone: student.phone || '',
      telegramUsername: student.telegramUsername || '',
      assignedTeacherId: student.assignedTeacherId,
    });
    setOpenDialog(true);
  };

  const handleOpenCreateDialog = () => {
    setEditingStudent(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      telegramUsername: '',
      assignedTeacherId: null,
    });
    setOpenDialog(true);
  };

  const filteredStudents = students.filter(student =>
    student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Управление студентами</Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={handleOpenCreateDialog}
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
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Email: {student.email}
                </Typography>
                {student.phone && (
                  <Typography variant="body2">
                    Телефон: {student.phone}
                  </Typography>
                )}
                {student.telegramUsername && (
                  <Typography variant="body2">
                    Telegram: @{student.telegramUsername}
                  </Typography>
                )}
                {student.assignedTeacherName && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Преподаватель: {student.assignedTeacherName}
                  </Typography>
                )}
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
                  <IconButton 
                    size="small" 
                    onClick={() => handleOpenEditDialog(student)}
                    title="Редактировать"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={() => handleDeleteStudent(student.id)}
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
          {editingStudent ? 'Редактировать студента' : 'Добавить студента'}
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
            <InputLabel>Назначить преподавателя</InputLabel>
            <Select
              value={formData.assignedTeacherId || ''}
              onChange={(e) => setFormData({...formData, assignedTeacherId: e.target.value as number || null})}
            >
              <MenuItem value="">Не назначен</MenuItem>
              {/* In a real implementation, you would fetch teachers and populate this list */}
              <MenuItem value={1}>Иванов Иван</MenuItem>
              <MenuItem value={2}>Петрова Мария</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отмена</Button>
          <Button 
            onClick={editingStudent ? handleUpdateStudent : handleCreateStudent} 
            variant="contained"
          >
            {editingStudent ? 'Сохранить' : 'Создать'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminStudentsPage;