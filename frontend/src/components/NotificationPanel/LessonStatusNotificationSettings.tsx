import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  FormControlLabel,
  Switch,
  Button,
  Grid,
  Alert,
  Divider,
  Chip
} from '@mui/material';
import { Save, Notifications } from '@mui/icons-material';

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  channel: 'email' | 'telegram' | 'push';
}

const LessonStatusNotificationSettings: React.FC = () => {
  // const { user } = useSelector((state: RootState) => state.auth); // Не используется в текущей реализации
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: 'lesson-completed',
      label: 'Завершение урока',
      description: 'Уведомление о завершении урока',
      enabled: true,
      channel: 'email'
    },
    {
      id: 'lesson-cancelled',
      label: 'Отмена урока',
      description: 'Уведомление об отмене урока',
      enabled: true,
      channel: 'email'
    },
    {
      id: 'lesson-missed',
      label: 'Пропуск урока',
      description: 'Уведомление о пропуске урока',
      enabled: true,
      channel: 'email'
    },
    {
      id: 'lesson-scheduled',
      label: 'Запланированный урок',
      description: 'Уведомление о запланированном уроке',
      enabled: true,
      channel: 'email'
    },
    {
      id: 'lesson-automated',
      label: 'Автоматические изменения',
      description: 'Уведомления об автоматических изменениях статуса',
      enabled: true,
      channel: 'email'
    }
  ]);

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  const handleSettingChange = useCallback((id: string, field: keyof NotificationSetting, value: any) => {
    setSettings(prev => prev.map(setting =>
      setting.id === id ? { ...setting, [field]: value } : setting
    ));
  }, []);

  const handleSave = useCallback(async () => {
    setSaveStatus('saving');
    try {
      // Здесь будет вызов API для сохранения настроек
      await new Promise(resolve => setTimeout(resolve, 1000)); // Имитация задержки
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  }, []);

  const getChannelColor = useCallback((channel: string) => {
    switch (channel) {
      case 'email': return 'primary';
      case 'telegram': return 'info';
      case 'push': return 'secondary';
      default: return 'default';
    }
  }, []);

  const getChannelLabel = useCallback((channel: string) => {
    switch (channel) {
      case 'email': return 'Email';
      case 'telegram': return 'Telegram';
      case 'push': return 'Push';
      default: return channel;
    }
  }, []);

  return (
    <Paper sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <Notifications sx={{ mr: 1 }} />
        <Typography variant="h5" component="h2">
          Настройки уведомлений о статусах уроков
        </Typography>
      </Box>

      {saveStatus === 'success' && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Настройки успешно сохранены!
        </Alert>
      )}

      {saveStatus === 'error' && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Ошибка при сохранении настроек
        </Alert>
      )}

      <Grid container spacing={3}>
        {settings.map((setting) => (
          <Grid item xs={12} key={setting.id}>
            <Box
              sx={{
                p: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                backgroundColor: 'background.paper'
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                <Box>
                  <Typography variant="subtitle1" fontWeight="medium">
                    {setting.label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {setting.description}
                  </Typography>
                </Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={setting.enabled}
                      onChange={(e) => handleSettingChange(setting.id, 'enabled', e.target.checked)}
                      color="primary"
                    />
                  }
                  label={setting.enabled ? 'Вкл' : 'Выкл'}
                />
              </Box>

              <Divider sx={{ my: 1 }} />

              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="body2">
                  Канал уведомлений:
                </Typography>
                <Chip
                  label={getChannelLabel(setting.channel)}
                  color={getChannelColor(setting.channel) as any}
                  size="small"
                />
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Box mt={3} display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          startIcon={<Save />}
          onClick={handleSave}
          disabled={saveStatus === 'saving'}
        >
          {saveStatus === 'saving' ? 'Сохранение...' : 'Сохранить настройки'}
        </Button>
      </Box>
    </Paper>
  );
};

export default LessonStatusNotificationSettings;