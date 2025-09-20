import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
  Alert,
  Snackbar,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Save, Visibility, VisibilityOff, Refresh } from '@mui/icons-material';
import { RootState, AppDispatch } from '@/store';
import { logout } from '@/store/authSlice';
import AuthService from '@/services/authService';

const AdminProfilePage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch: AppDispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  // Personal info
  const [personalInfo, setPersonalInfo] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    telegramUsername: user?.telegramUsername || '',
  });

  // Password change
  const [passwordChange, setPasswordChange] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    showCurrentPassword: false,
    showNewPassword: false,
    showConfirmPassword: false,
  });

  // Preferences
  const [preferences, setPreferences] = useState({
    theme: 'light',
    language: 'ru',
    notifications: {
      email: true,
      telegram: true,
      push: false,
    },
    timezone: 'Europe/Moscow',
  });

  const handleSavePersonalInfo = async () => {
    try {
      console.log('🔄 Saving personal info:', personalInfo);
      
      // Имитируем сохранение личной информации
      await new Promise(resolve => setTimeout(resolve, 500));
      
      showSnackbar('Личная информация сохранена успешно!', 'success');
    } catch (err: any) {
      console.error('❌ Error saving personal info:', err);
      showSnackbar('Ошибка сохранения личной информации: ' + (err.message || 'Неизвестная ошибка'), 'error');
    }
  };

  const handleChangePassword = async () => {
    try {
      // Валидация
      if (passwordChange.newPassword !== passwordChange.confirmPassword) {
        showSnackbar('Новые пароли не совпадают', 'error');
        return;
      }
      
      if (passwordChange.newPassword.length < 8) {
        showSnackbar('Новый пароль должен содержать минимум 8 символов', 'error');
        return;
      }
      
      console.log('🔄 Changing password');
      
      // Имитируем изменение пароля
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Сброс формы
      setPasswordChange({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        showCurrentPassword: false,
        showNewPassword: false,
        showConfirmPassword: false,
      });
      
      showSnackbar('Пароль успешно изменен!', 'success');
    } catch (err: any) {
      console.error('❌ Error changing password:', err);
      showSnackbar('Ошибка изменения пароля: ' + (err.message || 'Неизвестная ошибка'), 'error');
    }
  };

  const handleSavePreferences = async () => {
    try {
      console.log('🔄 Saving preferences:', preferences);
      
      // Имитируем сохранение настроек
      await new Promise(resolve => setTimeout(resolve, 500));
      
      showSnackbar('Настройки сохранены успешно!', 'success');
    } catch (err: any) {
      console.error('❌ Error saving preferences:', err);
      showSnackbar('Ошибка сохранения настроек: ' + (err.message || 'Неизвестная ошибка'), 'error');
    }
  };

  const handleLogout = () => {
    AuthService.logout();
    dispatch(logout());
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5">Профиль администратора</Typography>
        <Typography variant="body1" color="textSecondary">
          Управление личной информацией и настройками
        </Typography>
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
        <Tab label="Личная информация" />
        <Tab label="Изменение пароля" />
        <Tab label="Настройки" />
        <Tab label="Безопасность" />
      </Tabs>

      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Личная информация
              </Typography>
              
              <TextField
                fullWidth
                label="Имя"
                value={personalInfo.firstName}
                onChange={(e) => setPersonalInfo({...personalInfo, firstName: e.target.value})}
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="Фамилия"
                value={personalInfo.lastName}
                onChange={(e) => setPersonalInfo({...personalInfo, lastName: e.target.value})}
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="Email"
                value={personalInfo.email}
                onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="Телефон"
                value={personalInfo.phone}
                onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="Telegram"
                value={personalInfo.telegramUsername}
                onChange={(e) => setPersonalInfo({...personalInfo, telegramUsername: e.target.value})}
                sx={{ mb: 2 }}
              />
              
              <Button 
                variant="contained" 
                startIcon={<Save />}
                onClick={handleSavePersonalInfo}
                sx={{ mt: 2 }}
              >
                Сохранить изменения
              </Button>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Аккаунт
              </Typography>
              
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Роль:</strong> Администратор
              </Typography>
              
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Статус:</strong> Активен
              </Typography>
              
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Дата регистрации:</strong> 01.01.2025
              </Typography>
              
              <Typography variant="body2" sx={{ mb: 2 }}>
                <strong>Последний вход:</strong> {new Date().toLocaleString('ru-RU')}
              </Typography>
              
              <Button 
                variant="outlined" 
                color="error" 
                fullWidth
                onClick={handleLogout}
              >
                Выйти из аккаунта
              </Button>
            </Paper>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Изменение пароля
              </Typography>
              
              <TextField
                fullWidth
                label="Текущий пароль"
                type={passwordChange.showCurrentPassword ? "text" : "password"}
                value={passwordChange.currentPassword}
                onChange={(e) => setPasswordChange({...passwordChange, currentPassword: e.target.value})}
                sx={{ mb: 2 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setPasswordChange({...passwordChange, showCurrentPassword: !passwordChange.showCurrentPassword})}
                      >
                        {passwordChange.showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              
              <TextField
                fullWidth
                label="Новый пароль"
                type={passwordChange.showNewPassword ? "text" : "password"}
                value={passwordChange.newPassword}
                onChange={(e) => setPasswordChange({...passwordChange, newPassword: e.target.value})}
                sx={{ mb: 2 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setPasswordChange({...passwordChange, showNewPassword: !passwordChange.showNewPassword})}
                      >
                        {passwordChange.showNewPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              
              <TextField
                fullWidth
                label="Подтвердите новый пароль"
                type={passwordChange.showConfirmPassword ? "text" : "password"}
                value={passwordChange.confirmPassword}
                onChange={(e) => setPasswordChange({...passwordChange, confirmPassword: e.target.value})}
                sx={{ mb: 2 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setPasswordChange({...passwordChange, showConfirmPassword: !passwordChange.showConfirmPassword})}
                      >
                        {passwordChange.showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              
              <Button 
                variant="contained" 
                startIcon={<Save />}
                onClick={handleChangePassword}
                sx={{ mt: 2 }}
              >
                Изменить пароль
              </Button>
            </Paper>
          </Grid>
        </Grid>
      )}

      {activeTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Настройки
              </Typography>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Тема</InputLabel>
                <Select 
                  value={preferences.theme}
                  onChange={(e) => setPreferences({...preferences, theme: e.target.value})}
                >
                  <MenuItem value="light">Светлая</MenuItem>
                  <MenuItem value="dark">Темная</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Язык</InputLabel>
                <Select 
                  value={preferences.language}
                  onChange={(e) => setPreferences({...preferences, language: e.target.value})}
                >
                  <MenuItem value="ru">Русский</MenuItem>
                  <MenuItem value="en">English</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Часовой пояс</InputLabel>
                <Select 
                  value={preferences.timezone}
                  onChange={(e) => setPreferences({...preferences, timezone: e.target.value})}
                >
                  <MenuItem value="Europe/Moscow">Москва (MSK)</MenuItem>
                  <MenuItem value="Asia/Yekaterinburg">Екатеринбург (YEKT)</MenuItem>
                  <MenuItem value="Asia/Novosibirsk">Новосибирск (NOVT)</MenuItem>
                </Select>
              </FormControl>
              
              <FormControlLabel
                control={
                  <Switch 
                    checked={preferences.notifications.email}
                    onChange={(e) => setPreferences({
                      ...preferences, 
                      notifications: {...preferences.notifications, email: e.target.checked}
                    })}
                  />
                }
                label="Уведомления по электронной почте"
                sx={{ mb: 1 }}
              />
              
              <FormControlLabel
                control={
                  <Switch 
                    checked={preferences.notifications.telegram}
                    onChange={(e) => setPreferences({
                      ...preferences, 
                      notifications: {...preferences.notifications, telegram: e.target.checked}
                    })}
                  />
                }
                label="Уведомления в Telegram"
                sx={{ mb: 1 }}
              />
              
              <FormControlLabel
                control={
                  <Switch 
                    checked={preferences.notifications.push}
                    onChange={(e) => setPreferences({
                      ...preferences, 
                      notifications: {...preferences.notifications, push: e.target.checked}
                    })}
                  />
                }
                label="Push-уведомления"
                sx={{ mb: 2 }}
              />
              
              <Button 
                variant="contained" 
                startIcon={<Save />}
                onClick={handleSavePreferences}
                sx={{ mt: 2 }}
              >
                Сохранить настройки
              </Button>
            </Paper>
          </Grid>
        </Grid>
      )}

      {activeTab === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Безопасность
              </Typography>
              
              <Typography variant="body1" sx={{ mb: 2 }}>
                Здесь вы можете управлять настройками безопасности вашего аккаунта.
              </Typography>
              
              <Button 
                variant="outlined" 
                startIcon={<Refresh />}
                sx={{ mb: 2 }}
              >
                Обновить ключи API
              </Button>
              
              <Button 
                variant="outlined" 
                color="error"
                sx={{ ml: 2 }}
              >
                Отозвать все сессии
              </Button>
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Двухфакторная аутентификация
                </Typography>
                
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Двухфакторная аутентификация добавляет дополнительный уровень безопасности к вашему аккаунту.
                </Typography>
                
                <Button variant="outlined">
                  Включить двухфакторную аутентификацию
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminProfilePage;