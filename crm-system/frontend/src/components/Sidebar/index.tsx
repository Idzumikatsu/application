import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Box,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  CalendarToday as CalendarIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  Group as GroupIcon,
  Assignment as AssignmentIcon,
  Notifications as NotificationsIcon,
  Assessment as ReportsIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  onNotificationClick?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose, onNotificationClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);

  const getMenuItems = () => {
    const items: Array<{
      text: string;
      icon: React.ReactNode;
      path: string;
      roles: string[];
    }> = [];

    if (user?.role === 'ADMIN' || user?.role === 'MANAGER') {
      items.push(
        { text: 'Главная', icon: <DashboardIcon />, path: '/dashboard', roles: ['ADMIN', 'MANAGER'] },
        { text: 'Преподаватели', icon: <PeopleIcon />, path: '/manager/teachers', roles: ['ADMIN', 'MANAGER'] },
        { text: 'Студенты', icon: <SchoolIcon />, path: '/manager/students', roles: ['ADMIN', 'MANAGER'] },
        { text: 'Планирование', icon: <CalendarIcon />, path: '/manager/scheduling', roles: ['ADMIN', 'MANAGER'] },
        { text: 'Пакеты', icon: <AssignmentIcon />, path: '/manager/packages', roles: ['ADMIN', 'MANAGER'] },
      );
    }

    if (user?.role === 'TEACHER') {
      items.push(
        { text: 'Главная', icon: <DashboardIcon />, path: '/dashboard', roles: ['TEACHER'] },
        { text: 'Расписание', icon: <CalendarIcon />, path: '/teacher/schedule', roles: ['TEACHER'] },
        { text: 'Уроки', icon: <AssignmentIcon />, path: '/teacher/lessons', roles: ['TEACHER'] },
        { text: 'Групповые уроки', icon: <GroupIcon />, path: '/teacher/group-lessons', roles: ['TEACHER'] },
        { text: 'Студенты', icon: <SchoolIcon />, path: '/teacher/students', roles: ['TEACHER'] },
      );
    }

    if (user?.role === 'STUDENT') {
      items.push(
        { text: 'Главная', icon: <DashboardIcon />, path: '/dashboard', roles: ['STUDENT'] },
        { text: 'Расписание', icon: <CalendarIcon />, path: '/student/schedule', roles: ['STUDENT'] },
        { text: 'Групповые уроки', icon: <GroupIcon />, path: '/student/group-lessons', roles: ['STUDENT'] },
        { text: 'Пакеты', icon: <AssignmentIcon />, path: '/student/packages', roles: ['STUDENT'] },
        { text: 'Уведомления', icon: <NotificationsIcon />, path: '/student/notifications', roles: ['STUDENT'] },
      );
    }

    return items;
  };

  const menuItems = getMenuItems();

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <Box
        sx={{
          width: 280,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
        role="presentation"
      >
        <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
          <Typography variant="h6" component="div">
            CRM Система
          </Typography>
          <Typography variant="body2" component="div">
            Онлайн школа английского
          </Typography>
        </Box>
        
        <Divider />
        
        <List sx={{ flex: 1 }}>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => handleNavigation(item.path)}
              selected={isActive(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
        
        <Divider />
        
        <List>
          <ListItem button onClick={onNotificationClick}>
            <ListItemIcon>
              <NotificationsIcon />
            </ListItemIcon>
            <ListItemText primary="Уведомления" />
          </ListItem>
          
          <ListItem button>
            <ListItemIcon>
              <ReportsIcon />
            </ListItemIcon>
            <ListItemText primary="Отчеты" />
          </ListItem>
          
          <ListItem button>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Настройки" />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;