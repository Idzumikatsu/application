import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
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
  Menu as MenuIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { RootState, AppDispatch } from '@/store';
import { logout } from '@/store/authSlice';
import AuthService from '@/services/authService';

const drawerWidth = 280;

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
  onDrawerToggle?: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ open, onClose, onDrawerToggle }) => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

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

  return (
    <>
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          '& .MuiDrawer-paper': {
            width: drawerWidth,
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
          <Typography variant="h6" noWrap>
            Администрирование
          </Typography>
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <CloseIcon />
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
              component={Link}
              to={item.path}
              onClick={onClose}
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
              <ListItemIcon sx={{ color: 'inherit' }}>
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

      {/* Permanent drawer for desktop */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
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
          <Typography variant="h6" noWrap>
            Администрирование
          </Typography>
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
              component={Link}
              to={item.path}
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
              <ListItemIcon sx={{ color: 'inherit' }}>
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
    </>
  );
};

export default AdminSidebar;