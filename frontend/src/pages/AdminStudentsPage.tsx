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
import { Search, Add, Edit, Delete, Refresh } from '@mui/icons-material';
import adminService from '@/services/adminService';

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  telegramUsername: string;
  assignedTeacherId: number | null;
  assignedTeacherName: string | null;
  isActive: boolean;
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
    isActive: true,
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Loading students...');
      
      // Fetch real students from the backend API
      const studentsData: any = await adminService.getAllStudents();
      
      // Transform the data to match the expected interface
      const transformedStudents: Student[] = studentsData.content?.map((student: any) => ({
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        phone: student.phone || '',
        telegramUsername: student.telegramUsername || '',
        assignedTeacherId: student.assignedTeacherId || null,
        assignedTeacherName: student.assignedTeacherName || null,
        isActive: student.isActive !== undefined ? student.isActive : true,
      })) || [];
      
      setStudents(transformedStudents);
      console.log('✅ Students loaded successfully:', transformedStudents);
    } catch (err: any) {
      console.error('❌ Error loading students:', err);
      setError(err.message || 'Ошибка загрузки студентов');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStudent = async () => {
    try {
      console.log('🔄 Creating student:', formData);
      
      // Create student through the backend API
      await adminService.createStudent({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        telegramUsername: formData.telegramUsername,
        assignedTeacherId: formData.assignedTeacherId,
        isActive: formData.isActive,
      });
      
      handleCloseDialog();
      loadStudents();
      showSnackbar('Студент успешно создан!');
    } catch (err: any) {
      console.error('❌ Error creating student:', err);
      setError(err.message || 'Ошибка создания студента');
      showSnackbar('Ошибка создания студента: ' + (err.message || ''));
    }
  };

  const handleUpdateStudent = async () => {
    if (!editingStudent) return;
    
    try {
      console.log('🔄 Updating student:', editingStudent.id, formData);
      
      // Update student through the backend API
      await adminService.updateStudent(editingStudent.id, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        telegramUsername: formData.telegramUsername,
        assignedTeacherId: formData.assignedTeacherId,
        isActive: formData.isActive,
      });
      
      handleCloseDialog();
      loadStudents();
      showSnackbar('Студент успешно обновлен!');
    } catch (err: any) {
      console.error('❌ Error updating student:', err);
      setError(err.message || 'Ошибка обновления студента');
      showSnackbar('Ошибка обновления студента: ' + (err.message || ''));
    }
  };

  const handleDeleteStudent = async (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить этого студента?')) {
      try {
        console.log('🔄 Deleting student with id:', id);
        
        // Delete student through the backend API
        await adminService.deleteStudent(id);
        
        loadStudents();
        showSnackbar('Студент успешно удален!');
      } catch (err: any) {
        console.error('❌ Error deleting student:', err);
        setError(err.message || 'Ошибка удаления студента');
        showSnackbar('Ошибка удаления студента: ' + (err.message || ''));
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
      isActive: true,
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
      isActive: student.isActive !== undefined ? student.isActive : true,
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
      isActive: true,
    });
    setOpenDialog(true);
  };

  const filteredStudents = students.filter(student =>
    student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
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
        <Typography variant="h5">Управление студентами</Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={handleOpenCreateDialog}
        >
          Добавить студента
        </Button>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
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
          sx={{ maxWidth: 400 }}
        />
        
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={loadStudents}
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
                <TableCell>Преподаватель</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <Typography variant="body1">
                      {student.firstName} {student.lastName}
                    </Typography>
                  </TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.phone || '-'}</TableCell>
                  <TableCell>
                    {student.telegramUsername ? `@${student.telegramUsername}` : '-'}
                  </TableCell>
                  <TableCell>
                    {student.assignedTeacherName || (
                      <Chip label="Не назначен" color="warning" size="small" />
                    )}
                  </TableCell>
                  <TableCell>
                    {student.isActive ? (
                      <Chip label="Активен" color="success" size="small" />
                    ) : (
                      <Chip label="Неактивен" color="error" size="small" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Редактировать">
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpenEditDialog(student)}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Удалить">
                      <IconButton 
                        size="small" 
                        onClick={() => handleDeleteStudent(student.id)}
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
            <InputLabel>Назначить преподавателя</InputLabel>
            <Select
              value={formData.assignedTeacherId || ''}
              onChange={(e) => setFormData({...formData, assignedTeacherId: e.target.value as number || null})}
            >
              <MenuItem value="">Не назначен</MenuItem>
              <MenuItem value={1}>Елена Сидорова</MenuItem>
              <MenuItem value={2}>Дмитрий Козлов</MenuItem>
              <MenuItem value={3}>Анна Волкова</MenuItem>
            </Select>
          </FormControl>
          
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
            onClick={editingStudent ? handleUpdateStudent : handleCreateStudent} 
            variant="contained"
          >
            {editingStudent ? 'Сохранить' : 'Создать'}
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

export default AdminStudentsPage;