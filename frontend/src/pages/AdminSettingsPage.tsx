import React, { useState } from 'react';
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
} from '@mui/material';
import { Save } from '@mui/icons-material';

const AdminSettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  // General settings
  const [generalSettings, setGeneralSettings] = useState({
    schoolName: 'Online English School',
    supportEmail: 'support@englishschool.com',
    supportPhone: '+7 (XXX) XXX-XX-XX',
    timezone: 'Europe/Moscow',
    enableNotifications: true,
    enableAutoBackup: true,
  });

  // Email settings
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUsername: 'noreply@englishschool.com',
    smtpPassword: '',
    fromEmail: 'noreply@englishschool.com',
    fromName: 'Online English School',
  });

  // Telegram settings
  const [telegramSettings, setTelegramSettings] = useState({
    botToken: '',
    botUsername: '',
    enableTelegram: true,
  });

  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    passwordMinLength: 8,
    requireSpecialChars: true,
    requireNumbers: true,
    sessionTimeout: 30, // minutes
    enableTwoFactor: false,
  });

  const handleSaveGeneralSettings = () => {
    try {
      // Save settings logic here
      showSnackbar('Общие настройки сохранены успешно!', 'success');
    } catch (error) {
      showSnackbar('Ошибка при сохранении настроек', 'error');
    }
  };

  const handleSaveEmailSettings = () => {
    try {
      // Save settings logic here
      showSnackbar('Настройки электронной почты сохранены успешно!', 'success');
    } catch (error) {
      showSnackbar('Ошибка при сохранении настроек электронной почты', 'error');
    }
  };

  const handleSaveTelegramSettings = () => {
    try {
      // Save settings logic here
      showSnackbar('Настройки Telegram сохранены успешно!', 'success');
    } catch (error) {
      showSnackbar('Ошибка при сохранении настроек Telegram', 'error');
    }
  };

  const handleSaveSecuritySettings = () => {
    try {
      // Save settings logic here
      showSnackbar('Настройки безопасности сохранены успешно!', 'success');
    } catch (error) {
      showSnackbar('Ошибка при сохранении настроек безопасности', 'error');
    }
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
      <Typography variant="h5" sx={{ mb: 3 }}>
        Системные настройки
      </Typography>
      
      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        indicatorColor="secondary"
        textColor="inherit"
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 3 }}
      >
        <Tab label="Общие" />
        <Tab label="Электронная почта" />
        <Tab label="Telegram" />
        <Tab label="Безопасность" />
        <Tab label="Информация о системе" />
      </Tabs>

      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Общие настройки
              </Typography>
              
              <TextField
                fullWidth
                label="Название школы"
                value={generalSettings.schoolName}
                onChange={(e) => setGeneralSettings({...generalSettings, schoolName: e.target.value})}
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="Email поддержки"
                value={generalSettings.supportEmail}
                onChange={(e) => setGeneralSettings({...generalSettings, supportEmail: e.target.value})}
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="Телефон поддержки"
                value={generalSettings.supportPhone}
                onChange={(e) => setGeneralSettings({...generalSettings, supportPhone: e.target.value})}
                sx={{ mb: 2 }}
              />
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Часовой пояс</InputLabel>
                <Select 
                  value={generalSettings.timezone}
                  onChange={(e) => setGeneralSettings({...generalSettings, timezone: e.target.value})}
                >
                  <MenuItem value="Europe/Moscow">Москва (MSK)</MenuItem>
                  <MenuItem value="Asia/Yekaterinburg">Екатеринбург (YEKT)</MenuItem>
                  <MenuItem value="Asia/Novosibirsk">Новосибирск (NOVT)</MenuItem>
                </Select>
              </FormControl>
              
              <FormControlLabel
                control={
                  <Switch 
                    checked={generalSettings.enableNotifications}
                    onChange={(e) => setGeneralSettings({...generalSettings, enableNotifications: e.target.checked})}
                  />
                }
                label="Включить уведомления"
                sx={{ mb: 2 }}
              />
              
              <FormControlLabel
                control={
                  <Switch 
                    checked={generalSettings.enableAutoBackup}
                    onChange={(e) => setGeneralSettings({...generalSettings, enableAutoBackup: e.target.checked})}
                  />
                }
                label="Включить автоматическое резервное копирование"
                sx={{ mb: 2 }}
              />
              
              <Button 
                variant="contained" 
                startIcon={<Save />}
                onClick={handleSaveGeneralSettings}
                sx={{ mt: 2 }}
              >
                Сохранить настройки
              </Button>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Информация о системе
              </Typography>
              
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Версия:</strong> 1.0.0
              </Typography>
              
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Статус:</strong> Работает
              </Typography>
              
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Последнее обновление:</strong> 19 сентября 2025
              </Typography>
              
              <Typography variant="body2" sx={{ mb: 2 }}>
                <strong>Следующее обслуживание:</strong> 26 сентября 2025
              </Typography>
              
              <Button variant="outlined" fullWidth sx={{ mt: 2 }}>
                Проверить обновления
              </Button>
              
              <Button variant="outlined" fullWidth sx={{ mt: 1 }}>
                Создать резервную копию
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
                Настройки электронной почты
              </Typography>
              
              <TextField
                fullWidth
                label="SMTP Хост"
                value={emailSettings.smtpHost}
                onChange={(e) => setEmailSettings({...emailSettings, smtpHost: e.target.value})}
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="SMTP Порт"
                value={emailSettings.smtpPort}
                onChange={(e) => setEmailSettings({...emailSettings, smtpPort: e.target.value})}
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="SMTP Имя пользователя"
                value={emailSettings.smtpUsername}
                onChange={(e) => setEmailSettings({...emailSettings, smtpUsername: e.target.value})}
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="SMTP Пароль"
                type="password"
                value={emailSettings.smtpPassword}
                onChange={(e) => setEmailSettings({...emailSettings, smtpPassword: e.target.value})}
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="Email отправителя"
                value={emailSettings.fromEmail}
                onChange={(e) => setEmailSettings({...emailSettings, fromEmail: e.target.value})}
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="Имя отправителя"
                value={emailSettings.fromName}
                onChange={(e) => setEmailSettings({...emailSettings, fromName: e.target.value})}
                sx={{ mb: 2 }}
              />
              
              <Button 
                variant="contained" 
                startIcon={<Save />}
                onClick={handleSaveEmailSettings}
                sx={{ mt: 2 }}
              >
                Сохранить настройки
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
                Настройки Telegram
              </Typography>
              
              <TextField
                fullWidth
                label="Токен бота"
                value={telegramSettings.botToken}
                onChange={(e) => setTelegramSettings({...telegramSettings, botToken: e.target.value})}
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="Имя пользователя бота"
                value={telegramSettings.botUsername}
                onChange={(e) => setTelegramSettings({...telegramSettings, botUsername: e.target.value})}
                sx={{ mb: 2 }}
              />
              
              <FormControlLabel
                control={
                  <Switch 
                    checked={telegramSettings.enableTelegram}
                    onChange={(e) => setTelegramSettings({...telegramSettings, enableTelegram: e.target.checked})}
                  />
                }
                label="Включить интеграцию с Telegram"
                sx={{ mb: 2 }}
              />
              
              <Button 
                variant="contained" 
                startIcon={<Save />}
                onClick={handleSaveTelegramSettings}
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
                Настройки безопасности
              </Typography>
              
              <TextField
                fullWidth
                label="Минимальная длина пароля"
                type="number"
                value={securitySettings.passwordMinLength}
                onChange={(e) => setSecuritySettings({...securitySettings, passwordMinLength: parseInt(e.target.value)})}
                sx={{ mb: 2 }}
              />
              
              <FormControlLabel
                control={
                  <Switch 
                    checked={securitySettings.requireSpecialChars}
                    onChange={(e) => setSecuritySettings({...securitySettings, requireSpecialChars: e.target.checked})}
                  />
                }
                label="Требовать специальные символы в пароле"
                sx={{ mb: 2 }}
              />
              
              <FormControlLabel
                control={
                  <Switch 
                    checked={securitySettings.requireNumbers}
                    onChange={(e) => setSecuritySettings({...securitySettings, requireNumbers: e.target.checked})}
                  />
                }
                label="Требовать цифры в пароле"
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="Таймаут сессии (минуты)"
                type="number"
                value={securitySettings.sessionTimeout}
                onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: parseInt(e.target.value)})}
                sx={{ mb: 2 }}
              />
              
              <FormControlLabel
                control={
                  <Switch 
                    checked={securitySettings.enableTwoFactor}
                    onChange={(e) => setSecuritySettings({...securitySettings, enableTwoFactor: e.target.checked})}
                  />
                }
                label="Включить двухфакторную аутентификацию"
                sx={{ mb: 2 }}
              />
              
              <Button 
                variant="contained" 
                startIcon={<Save />}
                onClick={handleSaveSecuritySettings}
                sx={{ mt: 2 }}
              >
                Сохранить настройки
              </Button>
            </Paper>
          </Grid>
        </Grid>
      )}

      {activeTab === 4 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Информация о системе
              </Typography>
              
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Версия:</strong> 1.0.0
              </Typography>
              
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Статус:</strong> Работает
              </Typography>
              
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Последнее обновление:</strong> 19 сентября 2025
              </Typography>
              
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Следующее обслуживание:</strong> 26 сентября 2025
              </Typography>
              
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Операционная система:</strong> Linux
              </Typography>
              
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Версия Java:</strong> OpenJDK 17
              </Typography>
              
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Версия базы данных:</strong> PostgreSQL 15
              </Typography>
              
              <Typography variant="body2" sx={{ mb: 2 }}>
                <strong>Версия веб-сервера:</strong> Nginx 1.20
              </Typography>
              
              <Button variant="outlined" fullWidth sx={{ mt: 2 }}>
                Проверить обновления
              </Button>
              
              <Button variant="outlined" fullWidth sx={{ mt: 1 }}>
                Создать резервную копию
              </Button>
              
              <Button variant="outlined" fullWidth sx={{ mt: 1 }}>
                Просмотреть журналы системы
              </Button>
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

export default AdminSettingsPage;