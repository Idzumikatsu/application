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
  Avatar,
  Alert,
} from '@mui/material';
import {
  AccountCircle as AccountCircleIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Cake as CakeIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  LocationOn as LocationIcon,
  Telegram as TelegramIcon,
  Edit as EditIcon,
  Lock as LockIcon,
  Verified as VerifiedIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { setUser } from '../../store/authSlice';
import UserService from '../../services/userService';
import { User, UserRole } from '../../types';

const DashboardProfileWidget: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<User | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadUserProfile();
    }
  }, [user?.id]);

  const loadUserProfile = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // In a real implementation, you would fetch the actual user profile
      // For now, we'll use the user data from Redux store
      setProfileData(user);
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки профиля пользователя');
    } finally {
      setLoading(false);
    }
  };

  const getRoleDisplayName = (role: UserRole): string => {
    switch (role) {
      case UserRole.ADMIN: return 'Администратор';
      case UserRole.MANAGER: return 'Менеджер';
      case UserRole.TEACHER: return 'Преподаватель';
      case UserRole.STUDENT: return 'Студент';
      default: return 'Пользователь';
    }
  };

  const getRoleColor = (role: UserRole): 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning' => {
    switch (role) {
      case UserRole.ADMIN: return 'error';
      case UserRole.MANAGER: return 'primary';
      case UserRole.TEACHER: return 'secondary';
      case UserRole.STUDENT: return 'info';
      default: return 'default';
    }
  };

  const calculateAge = (birthDate?: string): number | null => {
    if (!birthDate) return null;
    
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Не указана';
    
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (!user) {
    return null;
  }

  return (
    <Card elevation={3}>
      <CardHeader
        avatar={
          <Avatar sx={{ width: 56, height: 56 }}>
            {user.firstName?.charAt(0)}
            {user.lastName?.charAt(0)}
          </Avatar>
        }
        title={
          <Typography variant="h6">
            {user.firstName} {user.lastName}
          </Typography>
        }
        subheader={
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
            <Chip 
              icon={<WorkIcon fontSize="small" />} 
              label={getRoleDisplayName(user.role)} 
              color={getRoleColor(user.role)} 
              size="small" 
              variant="outlined"
            />
            {user.isActive && (
              <Chip 
                icon={<VerifiedIcon fontSize="small" />} 
                label="Активен" 
                color="success" 
                size="small" 
                variant="outlined"
                sx={{ ml: 1 }}
              />
            )}
          </Box>
        }
      />
      
      <CardContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : profileData ? (
          <>
            <List disablePadding>
              <ListItem alignItems="flex-start" sx={{ py: 1, px: 0 }}>
                <ListItemIcon sx={{ minWidth: 36, mr: 1 }}>
                  <EmailIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="subtitle2">
                      Email
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" color="textPrimary">
                      {profileData.email}
                    </Typography>
                  }
                />
              </ListItem>
              
              <Divider component="li" />
              
              {profileData.phone && (
                <>
                  <ListItem alignItems="flex-start" sx={{ py: 1, px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36, mr: 1 }}>
                      <PhoneIcon color="secondary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2">
                          Телефон
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="textPrimary">
                          {profileData.phone}
                        </Typography>
                      }
                    />
                  </ListItem>
                  
                  <Divider component="li" />
                </>
              )}
              
              {profileData.dateOfBirth && (
                <>
                  <ListItem alignItems="flex-start" sx={{ py: 1, px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36, mr: 1 }}>
                      <CakeIcon color="info" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2">
                          Дата рождения
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body2" color="textPrimary">
                            {formatDate(profileData.dateOfBirth)}
                          </Typography>
                          {calculateAge(profileData.dateOfBirth) && (
                            <Chip 
                              label={`${calculateAge(profileData.dateOfBirth)} лет`} 
                              size="small" 
                              variant="outlined"
                              sx={{ ml: 1 }}
                            />
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                  
                  <Divider component="li" />
                </>
              )}
              
              {profileData.telegramUsername && (
                <>
                  <ListItem alignItems="flex-start" sx={{ py: 1, px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36, mr: 1 }}>
                      <TelegramIcon color="secondary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2">
                          Telegram
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="textPrimary">
                          @{profileData.telegramUsername}
                        </Typography>
                      }
                    />
                  </ListItem>
                  
                  <Divider component="li" />
                </>
              )}
              
              {profileData.role === UserRole.TEACHER && profileData.specialization && (
                <>
                  <ListItem alignItems="flex-start" sx={{ py: 1, px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36, mr: 1 }}>
                      <SchoolIcon color="secondary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2">
                          Специализация
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="textPrimary">
                          {profileData.specialization}
                        </Typography>
                      }
                    />
                  </ListItem>
                  
                  <Divider component="li" />
                </>
              )}
              
              {profileData.role === UserRole.STUDENT && profileData.assignedTeacherId && (
                <>
                  <ListItem alignItems="flex-start" sx={{ py: 1, px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36, mr: 1 }}>
                      <PersonIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2">
                          Назначенный преподаватель
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="textPrimary">
                          ID: {profileData.assignedTeacherId}
                        </Typography>
                      }
                    />
                  </ListItem>
                  
                  <Divider component="li" />
                </>
              )}
              
              <ListItem alignItems="flex-start" sx={{ py: 1, px: 0 }}>
                <ListItemIcon sx={{ minWidth: 36, mr: 1 }}>
                  <LockIcon color="action" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="subtitle2">
                      Статус аккаунта
                    </Typography>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Chip 
                        label={profileData.isActive ? 'Активен' : 'Неактивен'} 
                        color={profileData.isActive ? 'success' : 'error'} 
                        size="small" 
                        variant="outlined"
                      />
                      <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                        Создан: {formatDate(profileData.createdAt)}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            </List>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
              <Button 
                variant="outlined" 
                size="small" 
                startIcon={<EditIcon />}
                onClick={() => {
                  // Navigate to profile edit page
                }}
              >
                Редактировать профиль
              </Button>
              <Button 
                variant="outlined" 
                size="small" 
                startIcon={<LockIcon />}
                onClick={() => {
                  // Navigate to password change page
                }}
              >
                Изменить пароль
              </Button>
            </Box>
            
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                Для изменения контактной информации свяжитесь с администратором
              </Typography>
            </Alert>
          </>
        ) : (
          <Typography variant="body2" color="textSecondary" align="center" sx={{ py: 2 }}>
            Нет данных профиля
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardProfileWidget;