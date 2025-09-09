import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider,
  CircularProgress,
  Button,
  Switch,
  FormControlLabel,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Language as LanguageIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  VolumeUp as VolumeUpIcon,
  VolumeOff as VolumeOffIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Telegram as TelegramIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { setUser } from '../../store/authSlice';
import UserService from '../../services/userService';
import { User } from '../../types';

const DashboardUserSettingsWidget: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Settings state
  const [settings, setSettings] = useState({
    theme: 'light', // 'light' | 'dark'
    language: 'ru', // 'ru' | 'en'
    notifications: {
      email: true,
      telegram: true,
      push: false,
    },
    privacy: {
      profileVisibility: 'public', // 'public' | 'private' | 'friends'
      showOnlineStatus: true,
    },
    communication: {
      receiveMarketingEmails: false,
      receiveProductUpdates: true,
    },
    appearance: {
      fontSize: 14, // 12-18
      compactMode: false,
    },
  });

  useEffect(() => {
    if (user?.id) {
      loadUserSettings();
    }
  }, [user?.id]);

  const loadUserSettings = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      // In a real implementation, you would fetch actual user settings
      // For now, we'll use default settings
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simulate loading user preferences
      const userPreferences = {
        theme: 'light',
        language: 'ru',
        notifications: {
          email: true,
          telegram: true,
          push: false,
        },
        privacy: {
          profileVisibility: 'public',
          showOnlineStatus: true,
        },
        communication: {
          receiveMarketingEmails: false,
          receiveProductUpdates: true,
        },
        appearance: {
          fontSize: 14,
          compactMode: false,
        },
      };
      
      setSettings(userPreferences);
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки настроек пользователя');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // In a real implementation, you would save settings to the server
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user in Redux store
      if (user) {
        const updatedUser: User = {
          ...user,
          preferences: settings,
        };
        dispatch(setUser(updatedUser));
      }
      
      setSuccess('Настройки успешно сохранены');
    } catch (err: any) {
      setError(err.message || 'Ошибка сохранения настроек');
    } finally {
      setLoading(false);
    }
  };

  const handleThemeChange = (theme: 'light' | 'dark') => {
    setSettings(prev => ({
      ...prev,
      theme,
    }));
  };

  const handleLanguageChange = (language: string) => {
    setSettings(prev => ({
      ...prev,
      language,
    }));
  };

  const handleNotificationChange = (type: keyof typeof settings.notifications, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: value,
      },
    }));
  };

  const handleFontSizeChange = (fontSize: number) => {
    setSettings(prev => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        fontSize,
      },
    }));
  };

  const handleCompactModeChange = (compactMode: boolean) => {
    setSettings(prev => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        compactMode,
      },
    }));
  };

  if (!user) {
    return null;
  }

  return (
    <Card elevation={3}>
      <CardHeader
        avatar={<SettingsIcon color="primary" />}
        title="Настройки пользователя"
        subheader="Персонализация вашего опыта"
      />
      
      <CardContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}
            
            <List disablePadding>
              {/* Appearance Settings */}
              <ListItem alignItems="flex-start" sx={{ py: 1, px: 0 }}>
                <ListItemIcon sx={{ minWidth: 36, mr: 1 }}>
                  {settings.theme === 'dark' ? <DarkModeIcon /> : <LightModeIcon />}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="subtitle2">
                      Тема оформления
                    </Typography>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <Chip 
                        icon={settings.theme === 'dark' ? <DarkModeIcon fontSize="small" /> : <LightModeIcon fontSize="small" />} 
                        label={settings.theme === 'dark' ? 'Темная' : 'Светлая'} 
                        color={settings.theme === 'dark' ? "secondary" : "primary"}
                        size="small"
                        variant="outlined"
                        onClick={() => handleThemeChange(settings.theme === 'dark' ? 'light' : 'dark')}
                        sx={{ mr: 1, cursor: 'pointer' }}
                      />
                      <Typography variant="caption" color="textSecondary" sx={{ ml: 1 }}>
                        Нажмите для переключения темы
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              
              <Divider component="li" />
              
              {/* Language Settings */}
              <ListItem alignItems="flex-start" sx={{ py: 1, px: 0 }}>
                <ListItemIcon sx={{ minWidth: 36, mr: 1 }}>
                  <LanguageIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="subtitle2">
                      Язык интерфейса
                    </Typography>
                  }
                  secondary={
                    <Box sx={{ mt: 1 }}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Выберите язык</InputLabel>
                        <Select
                          value={settings.language}
                          onChange={(e) => handleLanguageChange(e.target.value as string)}
                          label="Выберите язык"
                        >
                          <MenuItem value="ru">Русский</MenuItem>
                          <MenuItem value="en">English</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  }
                />
              </ListItem>
              
              <Divider component="li" />
              
              {/* Notification Settings */}
              <ListItem alignItems="flex-start" sx={{ py: 1, px: 0 }}>
                <ListItemIcon sx={{ minWidth: 36, mr: 1 }}>
                  <NotificationsIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="subtitle2">
                      Уведомления
                    </Typography>
                  }
                  secondary={
                    <Box sx={{ mt: 1 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.notifications.email}
                            onChange={(e) => handleNotificationChange('email', e.target.checked)}
                            color="primary"
                          />
                        }
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <EmailIcon fontSize="small" sx={{ mr: 1 }} />
                            <Typography variant="body2">Email</Typography>
                          </Box>
                        }
                        sx={{ mr: 2 }}
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.notifications.telegram}
                            onChange={(e) => handleNotificationChange('telegram', e.target.checked)}
                            color="secondary"
                          />
                        }
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}> 
                            <TelegramIcon fontSize="small" sx={{ mr: 1 }} />
                            <Typography variant="body2">Telegram</Typography>
                          </Box>
                        }
                        sx={{ mr: 2 }}
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.notifications.push}
                            onChange={(e) => handleNotificationChange('push', e.target.checked)}
                            color="info"
                          />
                        }
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <PhoneIcon fontSize="small" sx={{ mr: 1 }} />
                            <Typography variant="body2">Push-уведомления</Typography>
                          </Box>
                        }
                      />
                    </Box>
                  }
                />
              </ListItem>
              
              <Divider component="li" />
              
              {/* Appearance Settings */}
              <ListItem alignItems="flex-start" sx={{ py: 1, px: 0 }}>
                <ListItemIcon sx={{ minWidth: 36, mr: 1 }}>
                  <VolumeUpIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="subtitle2">
                      Внешний вид
                    </Typography>
                  }
                  secondary={
                    <Box sx={{ mt: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant="body2" sx={{ minWidth: 120 }}>
                          Размер шрифта: {settings.appearance.fontSize}px
                        </Typography>
                        <Slider
                          value={settings.appearance.fontSize}
                          onChange={(e, value) => handleFontSizeChange(value as number)}
                          min={12}
                          max={18}
                          step={1}
                          valueLabelDisplay="auto"
                          sx={{ flex: 1, ml: 2 }}
                        />
                      </Box>
                      
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.appearance.compactMode}
                            onChange={(e) => handleCompactModeChange(e.target.checked)}
                            color="primary"
                          />
                        }
                        label="Компактный режим"
                      />
                    </Box>
                  }
                />
              </ListItem>
              
              <Divider component="li" />
              
              {/* Communication Settings */}
              <ListItem alignItems="flex-start" sx={{ py: 1, px: 0 }}>
                <ListItemIcon sx={{ minWidth: 36, mr: 1 }}>
                  <EmailIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="subtitle2">
                      Коммуникации
                    </Typography>
                  }
                  secondary={
                    <Box sx={{ mt: 1 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.communication.receiveMarketingEmails}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              communication: {
                                ...prev.communication,
                                receiveMarketingEmails: e.target.checked,
                              },
                            }))}
                            color="primary"
                          />
                        }
                        label="Получать маркетинговые письма"
                        sx={{ mr: 2 }}
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.communication.receiveProductUpdates}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              communication: {
                                ...prev.communication,
                                receiveProductUpdates: e.target.checked,
                              },
                            }))}
                            color="secondary"
                          />
                        }
                        label="Получать обновления продукта"
                      />
                    </Box>
                  }
                />
              </ListItem>
            </List>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button 
                variant="contained" 
                size="large" 
                startIcon={<SettingsIcon />}
                onClick={saveSettings}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Сохранить настройки'}
              </Button>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardUserSettingsWidget;