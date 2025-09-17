import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { RootState } from '../store';
import { UserRole } from '../types';

const DashboardPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getRoleDisplayName = (role: UserRole): string => {
    switch (role) {
      case UserRole.ADMIN: return 'Администратор';
      case UserRole.MANAGER: return 'Менеджер';
      case UserRole.TEACHER: return 'Преподаватель';
      case UserRole.STUDENT: return 'Студент';
      default: return 'Пользователь';
    }
  };

  const getDashboardActions = () => {
    switch (user?.role) {
      case UserRole.ADMIN:
        return [
          { title: 'Управление пользователями', path: '/admin/users', description: 'Управление менеджерами, преподавателями и студентами' },
          { title: 'Системные настройки', path: '/admin/settings', description: 'Конфигурация системы и параметры' },
        ];
      case UserRole.MANAGER:
        return [
          { title: 'Управление преподавателями', path: '/manager/teachers', description: 'Просмотр и управление преподавателями' },
          { title: 'Управление студентами', path: '/manager/students', description: 'Просмотр и управление студентами' },
          { title: 'Планирование уроков', path: '/manager/scheduling', description: 'Планирование индивидуальных и групповых уроков' },
          { title: 'Пакеты уроков', path: '/manager/packages', description: 'Управление пакетами уроков студентов' },
        ];
      case UserRole.TEACHER:
        return [
          { title: 'Мое расписание', path: '/teacher/schedule', description: 'Просмотр своего расписания и доступности' },
          { title: 'Мои уроки', path: '/teacher/lessons', description: 'Просмотр и управление запланированными уроками' },
          { title: 'Групповые уроки', path: '/teacher/group-lessons', description: 'Управление групповыми уроками' },
          { title: 'Мои студенты', path: '/teacher/students', description: 'Просмотр назначенных студентов' },
        ];
      case UserRole.STUDENT:
        return [
          { title: 'Мое расписание', path: '/student/schedule', description: 'Просмотр своего расписания уроков' },
          { title: 'Групповые уроки', path: '/student/group-lessons', description: 'Просмотр и регистрация на групповые уроки' },
          { title: 'Мои пакеты', path: '/student/packages', description: 'Просмотр своих пакетов уроков' },
          { title: 'Уведомления', path: '/student/notifications', description: 'Просмотр уведомлений и сообщений' },
        ];
      default:
        return [];
    }
  };

  const actions = getDashboardActions();

  return (
    <Container maxWidth="lg" sx={{ py: isMobile ? 2 : 4 }}>
      <Box sx={{ mb: 4 }}>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 4,
            flexDirection: isMobile ? 'column' : 'row',
            textAlign: isMobile ? 'center' : 'left',
          }}
        >
          <Avatar 
            sx={{ 
              width: isMobile ? 64 : 72, 
              height: isMobile ? 64 : 72, 
              mr: isMobile ? 0 : 3,
              mb: isMobile ? 2 : 0,
              fontSize: isMobile ? '1.5rem' : '1.75rem',
              fontWeight: 500,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
            }}
          >
            {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
          </Avatar>
          <Box>
            <Typography 
              variant={isMobile ? "h5" : "h4"} 
              sx={{ 
                fontWeight: 600,
                mb: 0.5,
              }}
            >
              Добро пожаловать, {user?.firstName}!
            </Typography>
            <Typography 
              variant="subtitle1" 
              color="textSecondary"
              sx={{
                mb: 1,
              }}
            >
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography 
              variant="body1" 
              sx={{
                display: 'inline-block',
                px: 1.5,
                py: 0.5,
                borderRadius: 2,
                backgroundColor: 'primary.light',
                color: 'primary.main',
                fontWeight: 500,
              }}
            >
              {getRoleDisplayName(user?.role || UserRole.STUDENT)}
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={isMobile ? 2 : 3}>
          {actions.map((action, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, pb: 2 }}>
                  <Typography 
                    gutterBottom 
                    variant="h6" 
                    component="h2"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                    }}
                  >
                    {action.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="textSecondary"
                    sx={{
                      lineHeight: 1.6,
                    }}
                  >
                    {action.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ pt: 0, px: 2, pb: 2 }}>
                  <Button 
                    size="small" 
                    onClick={() => navigate(action.path)}
                    variant="contained"
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 500,
                    }}
                  >
                    Перейти
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default DashboardPage;