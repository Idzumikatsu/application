import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
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
        {/* Unified Drawer component */}
        <Drawer
          variant={mobileOpen ? "temporary" : "permanent"}
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              zIndex: 1200,
              backgroundColor: '#f5f5f5',
            },
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

          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="textSecondary">
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Администратор
            </Typography>
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
          </List>

          <Divider sx={{ mt: 'auto' }} />

          <List>
            <ListItem button onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Выход" />
            </ListItem>
          </List>
        </Drawer>

        {/* Desktop drawer - always visible */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              backgroundColor: '#f5f5f5',
            },
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
          </Box>

          <Divider />

          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="textSecondary">
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Администратор
            </Typography>
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
          </List>

          <Divider sx={{ mt: 'auto' }} />

          <List>
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
          width: { xs: '100%', md: `calc(100% - ${mobileOpen ? drawerWidth : 0}px)` },
          mt: { xs: 7, md: 8 },
          ml: { md: mobileOpen ? `${drawerWidth}px` : 0 },
          transition: 'margin 225ms cubic-bezier(0, 0, 0.2, 1) 0ms',
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Outlet />
        )}
      </Box>
    </Box>
  );
};

export default AdminPage;
