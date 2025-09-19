import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
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
  Paper,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import { Add, People, School, Work, Edit, Delete, LockReset, Search } from '@mui/icons-material';
import { adminService } from '../services';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  telegramUsername: string;
  role: string;
  isActive: boolean;
}

const AdminUsersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [userType, setUserType] = useState<'manager' | 'teacher' | 'student'>('manager');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadUsers();
  }, [activeTab]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      switch (activeTab) {
        case 0: // Managers
          response = await adminService.getAllManagers();
          break;
        case 1: // Teachers
          response = await adminService.getAllTeachers();
          break;
        case 2: // Students
          response = await adminService.getAllStudents();
          break;
        default:
          response = [];
      }
      
      setUsers(response as unknown as User[]);
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки пользователей');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    try {
      let response;
      switch (userType) {
        case 'manager':
          response = await adminService.createManager({});
          break;
        case 'teacher':
          response = await adminService.createTeacher({});
          break;
        case 'student':
          response = await adminService.createStudent({});
          break;
      }
      
      setOpenDialog(false);
      loadUsers();
    } catch (err: any) {
      setError(err.message || 'Ошибка создания пользователя');
    }
  };

  const handleDeleteUser = async (id: number, role: string) => {
    if (window.confirm(`Вы уверены, что хотите удалить этого ${getRoleName(role)}?`)) {
      try {
        switch (role) {
          case 'MANAGER':
            await adminService.deleteManager(id);
            break;
          case 'TEACHER':
            await adminService.deleteTeacher(id);
            break;
          case 'STUDENT':
            await adminService.deleteStudent(id);
            break;
        }
        
        loadUsers();
      } catch (err: any) {
        setError(err.message || 'Ошибка удаления пользователя');
      }
    }
  };

  const handleResetPassword = async (id: number, role: string) => {
    try {
      switch (role) {
        case 'MANAGER':
          await adminService.resetManagerPassword(id);
          break;
        case 'TEACHER':
          await adminService.resetTeacherPassword(id);
          break;
        case 'STUDENT':
          await adminService.resetStudentPassword(id);
          break;
      }
      
      alert('Пароль сброшен успешно!');
    } catch (err: any) {
      setError(err.message || 'Ошибка сброса пароля');
    }
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'Администратор';
      case 'MANAGER': return 'Менеджер';
      case 'TEACHER': return 'Преподаватель';
      case 'STUDENT': return 'Студент';
      default: return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'error';
      case 'MANAGER': return 'primary';
      case 'TEACHER': return 'secondary';
      case 'STUDENT': return 'info';
      default: return 'default';
    }
  };

  const filteredUsers = users.filter(user =>
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Управление пользователями</Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
        >
          Добавить пользователя
        </Button>
      </Box>

      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        indicatorColor="secondary"
        textColor="inherit"
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 3 }}
      >
        <Tab label="Менеджеры" />
        <Tab label="Преподаватели" />
        <Tab label="Студенты" />
      </Tabs>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Поиск пользователей..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <Search sx={{ mr: 1 }} />
          ),
        }}
        sx={{ mb: 3 }}
      />

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
                <TableCell>Роль</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Typography variant="body1">
                      {user.firstName} {user.lastName}
                    </Typography>
                    {user.phone && (
                      <Typography variant="body2" color="textSecondary">
                        Тел: {user.phone}
                      </Typography>
                    )}
                    {user.telegramUsername && (
                      <Typography variant="body2" color="textSecondary">
                        Telegram: @{user.telegramUsername}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip 
                      label={getRoleName(user.role)} 
                      color={getRoleColor(user.role) as any} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    {user.isActive ? (
                      <Chip label="Активен" color="success" size="small" />
                    ) : (
                      <Chip label="Неактивен" color="error" size="small" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Редактировать">
                      <IconButton size="small">
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Сбросить пароль">
                      <IconButton 
                        size="small" 
                        onClick={() => handleResetPassword(user.id, user.role)}
                      >
                        <LockReset />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Удалить">
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDeleteUser(user.id, user.role)}
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

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Добавить пользователя</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Тип пользователя</InputLabel>
            <Select
              value={userType}
              onChange={(e) => setUserType(e.target.value as 'manager' | 'teacher' | 'student')}
            >
              <MenuItem value="manager">Менеджер</MenuItem>
              <MenuItem value="teacher">Преподаватель</MenuItem>
              <MenuItem value="student">Студент</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            autoFocus
            margin="dense"
            label="Имя"
            type="text"
            fullWidth
            variant="outlined"
            sx={{ mt: 2 }}
          />
          
          <TextField
            margin="dense"
            label="Фамилия"
            type="text"
            fullWidth
            variant="outlined"
            sx={{ mt: 2 }}
          />
          
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            sx={{ mt: 2 }}
          />
          
          <TextField
            margin="dense"
            label="Телефон"
            type="tel"
            fullWidth
            variant="outlined"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Отмена</Button>
          <Button onClick={handleCreateUser} variant="contained">
            Создать
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminUsersPage;