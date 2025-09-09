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
} from '@mui/material';
import { RootState } from '../store';
import { UserRole } from '../types';

const DashboardPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

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
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar sx={{ width: 56, height: 56, mr: 2 }}>
            {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h4">
              Добро пожаловать, {user?.firstName} {user?.lastName}!
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Роль: {getRoleDisplayName(user?.role || UserRole.STUDENT)}
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {actions.map((action, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h2">
                    {action.title}
                  </Typography>
                  <Typography>
                    {action.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    onClick={() => navigate(action.path)}
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