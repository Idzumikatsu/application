import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Tabs,
  Tab,
  AppBar,
  Toolbar,
  Chip,
  Avatar,
  Badge,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  ExitToApp as LogoutIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
import { RootState } from '../store';
import TeacherSchedulePage from './TeacherSchedulePage';
import TeacherLessonsPage from './TeacherLessonsPage';
import TeacherStudentsPage from './TeacherStudentsPage';
import TeacherStatisticsPage from './TeacherStatisticsPage';
import TeacherAvailabilityPage from './TeacherAvailabilityPage';
import TeacherNotificationsPage from './TeacherNotificationsPage';
import { logout } from '../store/authSlice';
import { setNotifications } from '../store/notificationSlice';

const TeacherDashboardPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { notifications } = useSelector((state: RootState) => state.notifications);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    if (user?.id) {
      // TODO: Implement fetch notifications logic
      // For now, we'll use empty notifications
      dispatch(setNotifications([]));
    }
  }, [user?.id, dispatch]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    switch (newValue) {
      case 0:
        navigate('/teacher/dashboard');
        break;
      case 1:
        navigate('/teacher/schedule');
        break;
      case 2:
        navigate('/teacher/lessons');
        break;
      case 3:
        navigate('/teacher/students');
        break;
      case 4:
        navigate('/teacher/availability');
        break;
      case 5:
        navigate('/teacher/statistics');
        break;
    }
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationsMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleNotificationsMenuClose = () => {
    setNotificationsAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    handleProfileMenuClose();
  };

  const handleNavigateToProfile = () => {
    navigate('/profile');
    handleProfileMenuClose();
  };

  const unreadNotifications = notifications.filter(n => !n.readAt).length;

  const tabLabels = [
    'Главная',
    'Расписание',
    'Уроки',
    'Студенты',
    'Доступность',
    'Статистика'
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppBar position="static" elevation={2}>
        <Toolbar>
          <DashboardIcon sx={{ mr: 2 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Личный кабинет преподавателя
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              size="large"
              color="inherit"
              onClick={handleNotificationsMenuOpen}
            >
              <Badge badgeContent={unreadNotifications} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            
            <Chip
              avatar={<Avatar>{user?.firstName?.[0]}{user?.lastName?.[0]}</Avatar>}
              label={`${user?.firstName} ${user?.lastName}`}
              variant="outlined"
              onClick={handleProfileMenuOpen}
              clickable
            />
          </Box>
        </Toolbar>

        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          indicatorColor="secondary"
          textColor="inherit"
          variant="scrollable"
          scrollButtons="auto"
          sx={{ 
            bgcolor: 'primary.dark',
            '& .MuiTab-root': { 
              minWidth: 'auto',
              px: 2,
              fontSize: '0.875rem'
            }
          }}
        >
          {tabLabels.map((label, index) => (
            <Tab 
              key={index} 
              label={label}
              sx={{ 
                fontWeight: activeTab === index ? 'bold' : 'normal',
                opacity: activeTab === index ? 1 : 0.8
              }}
            />
          ))}
        </Tabs>
      </AppBar>
      
      <Box sx={{ flexGrow: 1, overflow: 'auto', bgcolor: 'grey.50' }}>
        <Routes>
          <Route path="/dashboard" element={<TeacherDashboardOverview />} />
          <Route path="/schedule" element={<TeacherSchedulePage />} />
          <Route path="/lessons" element={<TeacherLessonsPage />} />
          <Route path="/students" element={<TeacherStudentsPage />} />
          <Route path="/availability" element={<TeacherAvailabilityPage />} />
          <Route path="/statistics" element={<TeacherStatisticsPage />} />
          <Route path="/notifications" element={<TeacherNotificationsPage />} />
          <Route path="/" element={<TeacherDashboardOverview />} />
        </Routes>
      </Box>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleNavigateToProfile}>
          <AccountCircleIcon sx={{ mr: 1 }} />
          Мой профиль
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <LogoutIcon sx={{ mr: 1 }} />
          Выйти
        </MenuItem>
      </Menu>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationsAnchorEl}
        open={Boolean(notificationsAnchorEl)}
        onClose={handleNotificationsMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => navigate('/teacher/notifications')}>
          Все уведомления
        </MenuItem>
        {notifications.slice(0, 5).map((notification) => (
          <MenuItem key={notification.id} onClick={handleNotificationsMenuClose}>
            <Box sx={{ maxWidth: 300 }}>
              <Typography variant="body2" noWrap>
                {notification.title}
              </Typography>
              <Typography variant="caption" color="textSecondary" noWrap>
                {notification.message}
              </Typography>
            </Box>
          </MenuItem>
        ))}
        {notifications.length === 0 && (
          <MenuItem disabled>
            <Typography variant="body2" color="textSecondary">
              Нет уведомлений
            </Typography>
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};

// Компонент обзора главной страницы
const TeacherDashboardOverview: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Добро пожаловать, {user?.firstName}!
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Ваш личный кабинет преподавателя английского языка
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
        {/* Карточка расписания */}
        <Box 
          sx={{ 
            p: 3, 
            bgcolor: 'white', 
            borderRadius: 2, 
            boxShadow: 1,
            cursor: 'pointer',
            '&:hover': { boxShadow: 3 }
          }}
          onClick={() => navigate('/teacher/schedule')}
        >
          <Typography variant="h6" gutterBottom>
            📅 Расписание уроков
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Просмотр и управление вашим расписанием уроков
          </Typography>
        </Box>

        {/* Карточка студентов */}
        <Box 
          sx={{ 
            p: 3, 
            bgcolor: 'white', 
            borderRadius: 2, 
            boxShadow: 1,
            cursor: 'pointer',
            '&:hover': { boxShadow: 3 }
          }}
          onClick={() => navigate('/teacher/students')}
        >
          <Typography variant="h6" gutterBottom>
            👥 Мои студенты
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Управление вашими студентами и контактной информацией
          </Typography>
        </Box>

        {/* Карточка доступности */}
        <Box 
          sx={{ 
            p: 3, 
            bgcolor: 'white', 
            borderRadius: 2, 
            boxShadow: 1,
            cursor: 'pointer',
            '&:hover': { boxShadow: 3 }
          }}
          onClick={() => navigate('/teacher/availability')}
        >
          <Typography variant="h6" gutterBottom>
            ⏰ Слоты доступности
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Настройка времени для проведения уроков
          </Typography>
        </Box>

        {/* Карточка статистики */}
        <Box 
          sx={{ 
            p: 3, 
            bgcolor: 'white', 
            borderRadius: 2, 
            boxShadow: 1,
            cursor: 'pointer',
            '&:hover': { boxShadow: 3 }
          }}
          onClick={() => navigate('/teacher/statistics')}
        >
          <Typography variant="h6" gutterBottom>
            📊 Статистика
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Анализ вашей преподавательской деятельности
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default TeacherDashboardPage;