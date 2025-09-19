import React, { useState, useEffect } from 'react';
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
  Avatar,
  IconButton,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  PhotoCamera,
  Save,
  LockReset,
  Person,
} from '@mui/icons-material';
import { RootState } from '../store';
import { adminService } from '../services';

interface ProfileData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  telegramUsername: string;
  dateOfBirth: string;
  avatarUrl?: string;
}

const AdminProfilePage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [profileData, setProfileData] = useState<ProfileData>({
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    telegramUsername: '',
    dateOfBirth: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // This would be implemented in adminService
      // const response = await adminService.getProfile(user?.id);
      // setProfileData(response as unknown as ProfileData);
      
      // For now, we'll use mock data
      setProfileData({
        id: user?.id || 0,
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phone: '',
        telegramUsername: '',
        dateOfBirth: '',
      });
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки профиля');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setError(null);
      
      // This would be implemented in adminService
      // await adminService.updateProfile(profileData.id, profileData);
      
      setSuccess('Профиль успешно сохранен');
      showSnackbar('Профиль успешно сохранен', 'success');
    } catch (err: any) {
      setError(err.message || 'Ошибка сохранения профиля');
      showSnackbar(err.message || 'Ошибка сохранения профиля', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      // This would be implemented in adminService
      // await adminService.changePassword(profileData.id);
      showSnackbar('Ссылка для смены пароля отправлена на ваш email', 'success');
    } catch (err: any) {
      showSnackbar(err.message || 'Ошибка запроса смены пароля', 'error');
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
        // Here you would typically upload the file to your server
        // This would be implemented in adminService
        // await adminService.uploadAvatar(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5">Профиль администратора</Typography>
        <Typography variant="body1" color="textSecondary">
          Управление личной информацией и настройками аккаунта
        </Typography>
      </Box>

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

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
              <Avatar
                src={avatarPreview || profileData.avatarUrl}
                sx={{ width: 120, height: 120, fontSize: 48 }}
              >
                {!avatarPreview && !profileData.avatarUrl && (
                  <Person sx={{ fontSize: 60 }} />
                )}
              </Avatar>
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="label"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  bgcolor: 'background.paper',
                  boxShadow: 2,
                  '&:hover': {
                    bgcolor: 'background.paper',
                  },
                }}
              >
                <input
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={handleAvatarChange}
                />
                <PhotoCamera />
              </IconButton>
            </Box>
            
            <Typography variant="h6">
              {profileData.firstName} {profileData.lastName}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Администратор системы
            </Typography>
            
            <Button
              variant="outlined"
              startIcon={<LockReset />}
              onClick={handleChangePassword}
              fullWidth
              sx={{ mt: 2 }}
            >
              Сменить пароль
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Личная информация
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Имя"
                  value={profileData.firstName}
                  onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                  sx={{ mb: 2 }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Фамилия"
                  value={profileData.lastName}
                  onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                  sx={{ mb: 2 }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  sx={{ mb: 2 }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Телефон"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  sx={{ mb: 2 }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Telegram"
                  value={profileData.telegramUsername}
                  onChange={(e) => setProfileData({...profileData, telegramUsername: e.target.value})}
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: '@',
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Дата рождения"
                  type="date"
                  value={profileData.dateOfBirth}
                  onChange={(e) => setProfileData({...profileData, dateOfBirth: e.target.value})}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{ mb: 2 }}
                />
              </Grid>
            </Grid>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSaveProfile}
                disabled={saving}
                size="large"
              >
                {saving ? 'Сохранение...' : 'Сохранить изменения'}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={openSnackbar}
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