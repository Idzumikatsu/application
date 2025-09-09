import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Grid,
  Button,
  Chip,
} from '@mui/material';
import {
  Person as PersonIcon,
  School as SchoolIcon,
  Event as EventIcon,
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  Group as GroupIcon,
  Payment as PaymentIcon,
  Assessment as AssessmentIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'error';
  badge?: string;
  badgeColor?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
}

const DashboardQuickActionsWidget: React.FC = () => {
  const navigate = useNavigate();

  const quickActions: QuickAction[] = [
    {
      id: 'add-student',
      title: 'Добавить студента',
      description: 'Зарегистрировать нового студента',
      icon: <PersonIcon />,
      path: '/manager/students/create',
      color: 'success',
      badge: 'Новый',
      badgeColor: 'success',
    },
    {
      id: 'add-teacher',
      title: 'Добавить преподавателя',
      description: 'Зарегистрировать нового преподавателя',
      icon: <SchoolIcon />,
      path: '/manager/teachers/create',
      color: 'warning',
    },
    {
      id: 'schedule-lesson',
      title: 'Назначить урок',
      description: 'Запланировать индивидуальный урок',
      icon: <EventIcon />,
      path: '/manager/scheduling/create',
      color: 'primary',
      badge: '5+',
      badgeColor: 'info',
    },
    {
      id: 'manage-packages',
      title: 'Управление пакетами',
      description: 'Создать или продлить пакет уроков',
      icon: <AssignmentIcon />,
      path: '/manager/packages',
      color: 'info',
      badge: '3',
      badgeColor: 'warning',
    },
    {
      id: 'view-schedule',
      title: 'Просмотр расписания',
      description: 'Посмотреть расписание на неделю',
      icon: <ScheduleIcon />,
      path: '/manager/scheduling',
      color: 'secondary',
    },
    {
      id: 'group-lessons',
      title: 'Групповые уроки',
      description: 'Управление групповыми занятиями',
      icon: <GroupIcon />,
      path: '/manager/group-lessons',
      color: 'primary',
    },
    {
      id: 'payments',
      title: 'Платежи',
      description: 'Просмотр и управление платежами',
      icon: <PaymentIcon />,
      path: '/manager/payments',
      color: 'success',
    },
    {
      id: 'reports',
      title: 'Отчеты',
      description: 'Генерация отчетов и статистики',
      icon: <AssessmentIcon />,
      path: '/manager/reports',
      color: 'info',
    },
    {
      id: 'notifications',
      title: 'Уведомления',
      description: 'Настройка и отправка уведомлений',
      icon: <NotificationsIcon />,
      path: '/manager/notifications',
      color: 'warning',
      badge: '12',
      badgeColor: 'error',
    },
  ];

  const handleActionClick = (path: string) => {
    navigate(path);
  };

  return (
    <Card elevation={3}>
      <CardHeader
        title="Быстрые действия"
        subheader="Доступ к основным функциям системы"
      />
      
      <CardContent>
        <Grid container spacing={1.5}>
          {quickActions.map((action) => (
            <Grid item xs={6} key={action.id}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={action.icon}
                onClick={() => handleActionClick(action.path)}
                sx={{
                  height: 80,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  position: 'relative',
                  borderColor: `${action.color}.main`,
                  color: `${action.color}.main`,
                  '&:hover': {
                    borderColor: `${action.color}.dark`,
                    backgroundColor: `${action.color}.light`,
                  },
                }}
              >
                {action.badge && (
                  <Chip
                    label={action.badge}
                    color={action.badgeColor || 'default'}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      fontSize: '0.6rem',
                      height: 18,
                    }}
                  />
                )}
                
                <Typography 
                  variant="body2" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 'bold',
                    fontSize: '0.75rem',
                    lineHeight: 1.2,
                  }}
                >
                  {action.title}
                </Typography>
                
                <Typography 
                  variant="caption" 
                  color="textSecondary"
                  sx={{
                    fontSize: '0.65rem',
                    lineHeight: 1.1,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {action.description}
                </Typography>
              </Button>
            </Grid>
          ))}
        </Grid>
        
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="caption" color="textSecondary">
            Используйте быстрые действия для эффективной работы с системой
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DashboardQuickActionsWidget;