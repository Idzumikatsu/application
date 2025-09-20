import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Event as EventIcon,
  Assessment as AssessmentIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { RootState } from '@/store';
import AuthService from '@/services/authService';
import { logout } from '@/store/authSlice';
import { AppDispatch } from '@/store';

const drawerWidth = 280;

const AdminPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch: AppDispatch = useDispatch();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    AuthService.logout();
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = [
    { text: 'Главная', icon: <DashboardIcon />, path: '/admin/dashboard' },
    { text: 'Пользователи', icon: <PeopleIcon />, path: '/admin/users' },
    { text: 'Менеджеры', icon: <WorkIcon />, path: '/admin/managers' },
    { text: 'Преподаватели', icon: <SchoolIcon />, path: '/admin/teachers' },
    { text: 'Студенты', icon: <PeopleIcon />, path: '/admin/students' },
    { text: 'Уроки', icon: <EventIcon />, path: '/admin/lessons' },
    { text: 'Отчеты', icon: <AssessmentIcon />, path: '/admin/reports' },
    { text: 'Уведомления', icon: <NotificationsIcon />, path: '/admin/notifications' },
    { text: 'Профиль', icon: <PersonIcon />, path: '/admin/profile' },
    { text: 'Настройки', icon: <SettingsIcon />, path: '/admin/settings' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Администратор: {user?.firstName} {user?.lastName}
          </Typography>
          <Button color="inherit" onClick={() => navigate('/dashboard')}>
            Назад на главную
          </Button>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="admin navigation"
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
              backgroundColor: 'primary.main',
              color: 'white',
            }}
          >
            <Typography variant="h6">Администрирование</Typography>
            <IconButton onClick={handleDrawerToggle} sx={{ color: 'white' }}>
              <RefreshIcon />
            </IconButton>
          </Box>
          <Divider />
          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.text}
                selected={isActive(item.path)}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'primary.light',
                    color: 'primary.contrastText',
                    '& .MuiListItemIcon-root': {
                      color: 'primary.contrastText',
                    },
                  },
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    color: 'primary.contrastText',
                    '& .MuiListItemIcon-root': {
                      color: 'primary.contrastText',
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive(item.path) ? 'primary.contrastText' : 'inherit',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
            <Divider sx={{ my: 1 }} />
            <ListItem button onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Выход" />
            </ListItem>
          </List>
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
              backgroundColor: 'primary.main',
              color: 'white',
            }}
          >
            <Typography variant="h6">Администрирование</Typography>
            <IconButton onClick={handleDrawerToggle} sx={{ color: 'white' }}>
              <RefreshIcon />
            </IconButton>
          </Box>
          <Divider />
          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.text}
                selected={isActive(item.path)}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'primary.light',
                    color: 'primary.contrastText',
                    '& .MuiListItemIcon-root': {
                      color: 'primary.contrastText',
                    },
                  },
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    color: 'primary.contrastText',
                    '& .MuiListItemIcon-root': {
                      color: 'primary.contrastText',
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive(item.path) ? 'primary.contrastText' : 'inherit',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
            <Divider sx={{ my: 1 }} />
            <ListItem button onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Выход" />
            </ListItem>
          </List>
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
          mt: { xs: 7, md: 8 },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box>
            {/* Маршруты теперь обрабатываются в AdminRoutes.tsx */}
            {/* Этот компонент только предоставляет навигацию и layout */}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AdminPage;
