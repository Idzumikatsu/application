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
  Divider,
  Alert,
} from '@mui/material';
import {
  Speed as SpeedIcon,
  Add as AddIcon,
  Event as EventIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  School as SchoolIcon,
  CalendarToday as CalendarTodayIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useNavigate } from 'react-router-dom';

interface QuickAction {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  roles: string[];
  color: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  size: 'small' | 'medium' | 'large';
}

const DashboardQuickActionsWidget: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  
  const quickActions: QuickAction[] = [
    // Teacher actions
    {
      id: 1,
      title: 'Добавить слот доступности',
      description: 'Создать новый слот для приема уроков',
      icon: <AddIcon />,
      path: '/teacher/availability/create',
      roles: ['TEACHER'],
      color: 'primary',
      size: 'medium',
    },
    {
      id: 2,
      title: 'Запланировать урок',
      description: 'Назначить индивидуальный урок студенту',
      icon: <EventIcon />,
      path: '/teacher/lessons/schedule',
      roles: ['TEACHER'],
      color: 'secondary',
      size: 'medium',
    },
    {
      id: 3,
      title: 'Создать групповой урок',
      description: 'Организовать новый групповой урок',
      icon: <GroupIcon />,
      path: '/teacher/group-lessons/create',
      roles: ['TEACHER'],
      color: 'info',
      size: 'medium',
    },
    
    // Manager actions
    {
      id: 4,
      title: 'Добавить студента',
      description: 'Зарегистрировать нового студента в системе',
      icon: <PersonIcon />,
      path: '/manager/students/create',
      roles: ['MANAGER', 'ADMIN'],
      color: 'success',
      size: 'medium',
    },
    {
      id: 5,
      title: 'Добавить преподавателя',
      description: 'Зарегистрировать нового преподавателя',
      icon: <SchoolIcon />,
      path: '/manager/teachers/create',
      roles: ['MANAGER', 'ADMIN'],
      color: 'warning',
      size: 'medium',
    },
    {
      id: 6,
      title: 'Назначить пакет уроков',
      description: 'Создать или продлить пакет уроков для студента',
      icon: <AssignmentIcon />,
      path: '/manager/packages/assign',
      roles: ['MANAGER', 'ADMIN'],
      color: 'info',
      size: 'medium',
    },
    
    // Student actions
    {
      id: 7,
      title: 'Записаться на групповой урок',
      description: 'Выбрать и зарегистрироваться на групповой урок',
      icon: <GroupIcon />,
      path: '/student/group-lessons/register',
      roles: ['STUDENT'],
      color: 'secondary',
      size: 'medium',
    },
    {
      id: 8,
      title: 'Мое расписание',
      description: 'Просмотреть свое расписание уроков',
      icon: <CalendarTodayIcon />,
      path: '/student/schedule',
      roles: ['STUDENT'],
      color: 'primary',
      size: 'medium',
    },
    
    // Common actions
    {
      id: 9,
      title: 'Уведомления',
      description: 'Просмотреть и управлять уведомлениями',
      icon: <NotificationsIcon />,
      path: '/notifications',
      roles: ['TEACHER', 'MANAGER', 'ADMIN', 'STUDENT'],
      color: 'info',
      size: 'small',
    },
    {
      id: 10,
      title: 'Настройки',
      description: 'Персонализировать настройки аккаунта',
      icon: <SettingsIcon />,
      path: '/settings',
      roles: ['TEACHER', 'MANAGER', 'ADMIN', 'STUDENT'],
      color: 'warning',
      size: 'small',
    },
  ];

  const getFilteredActions = () => {
    if (!user?.role) return [];
    
    return quickActions.filter(action => 
      action.roles.includes(user.role)
    );
  };

  const filteredActions = getFilteredActions();

  const handleActionClick = (path: string) => {
    navigate(path);
  };

  if (filteredActions.length === 0) {
    return null;
  }

  return (
    <Card elevation={3}>
      <CardHeader
        avatar={<SpeedIcon color="primary" />}
        title="Быстрые действия"
        subheader={`Доступно действий: ${filteredActions.length}`}
      />
      
      <CardContent>
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            Быстрые действия позволяют быстро выполнять часто используемые операции
          </Typography>
        </Alert>
        
        <Grid container spacing={2}>
          {filteredActions.map((action) => (
            <Grid item xs={12} sm={6} md={4} key={action.id}>
              <Button
                fullWidth
                variant="outlined"
                size={action.size}
                startIcon={action.icon}
                onClick={() => handleActionClick(action.path)}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  p: 2,
                  textTransform: 'none',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Chip 
                    icon={action.icon} 
                    label={action.title} 
                    color={action.color as any}
                    size="small"
                    variant="outlined"
                  />
                </Box>
                <Typography variant="caption" color="textSecondary">
                  {action.description}
                </Typography>
              </Button>
            </Grid>
          ))}
        </Grid>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Chip 
            label={`Всего доступных действий: ${filteredActions.length}`} 
            color="primary" 
            size="small" 
            variant="outlined"
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default DashboardQuickActionsWidget;