import React from 'react';
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
} from '@mui/material';

const AdminSettingsPage: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Системные настройки
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Основные настройки
            </Typography>
            
            <TextField
              fullWidth
              label="Название школы"
              defaultValue="Online English School"
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              label="Email поддержки"
              defaultValue="support@englishschool.com"
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              label="Телефон поддержки"
              defaultValue="+7 (XXX) XXX-XX-XX"
              sx={{ mb: 2 }}
            />
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Часовой пояс</InputLabel>
              <Select defaultValue="Europe/Moscow">
                <MenuItem value="Europe/Moscow">Москва (MSK)</MenuItem>
                <MenuItem value="Asia/Yekaterinburg">Екатеринбург (YEKT)</MenuItem>
                <MenuItem value="Asia/Novosibirsk">Новосибирск (NOVT)</MenuItem>
              </Select>
            </FormControl>
            
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Включить уведомления"
              sx={{ mb: 2 }}
            />
            
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Включить автоматическое резервное копирование"
              sx={{ mb: 2 }}
            />
            
            <Button variant="contained" sx={{ mt: 2 }}>
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
    </Box>
  );
};

export default AdminSettingsPage;