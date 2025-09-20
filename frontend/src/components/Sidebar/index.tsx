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
  useTheme,
  useMediaQuery,
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
  Person as PersonIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import AdminSidebar from './AdminSidebar';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  onNotificationClick?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose, onNotificationClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useSelector((state: RootState) => state.auth);

  // Если пользователь - администратор, используем специальную боковую панель
  if (user?.role === 'ADMIN') {
    return (
      <AdminSidebar 
        open={open} 
        onClose={onClose} 
        onDrawerToggle={onNotificationClick}
      />
    );
  }

  const getMenuItems = () => {
    const items: Array<{
      text: string;
      icon: React.ReactNode;
      path: string;
      roles: string[];
    }> = [];

    if (user?.role === 'MANAGER') {
      items.push(
        { text: 'Главная', icon: <DashboardIcon />, path: '/manager/dashboard', roles: ['MANAGER'] },
        { text: 'Преподаватели', icon: <PeopleIcon />, path: '/manager/teachers', roles: ['MANAGER'] },
        { text: 'Студенты', icon: <SchoolIcon />, path: '/manager/students', roles: ['MANAGER'] },
        { text: 'Планирование', icon: <CalendarIcon />, path: '/manager/scheduling', roles: ['MANAGER'] },
        { text: 'Пакеты', icon: <AssignmentIcon />, path: '/manager/packages', roles: ['MANAGER'] },
      );
    } else if (user?.role === 'TEACHER') {
      items.push(
        { text: 'Главная', icon: <DashboardIcon />, path: '/teacher/dashboard', roles: ['TEACHER'] },
        { text: 'Расписание', icon: <CalendarIcon />, path: '/teacher/schedule', roles: ['TEACHER'] },
        { text: 'Уроки', icon: <AssignmentIcon />, path: '/teacher/lessons', roles: ['TEACHER'] },
        { text: 'Групповые уроки', icon: <GroupIcon />, path: '/teacher/group-lessons', roles: ['TEACHER'] },
        { text: 'Студенты', icon: <SchoolIcon />, path: '/teacher/students', roles: ['TEACHER'] },
      );
    } else if (user?.role === 'STUDENT') {
      items.push(
        { text: 'Главная', icon: <DashboardIcon />, path: '/student/dashboard', roles: ['STUDENT'] },
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
    if (isMobile) {
      onClose();
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // Icons mapping for active state
  const getActiveIcon = (icon: React.ReactNode, active: boolean) => {
    if (!active) return icon;
    
    // Clone the icon with active color
    return React.cloneElement(icon as React.ReactElement, {
      sx: { color: 'primary.main' }
    });
  };

  return (
    <Drawer 
      anchor="left" 
      open={open} 
      onClose={onClose}
      variant={isMobile ? 'temporary' : 'persistent'}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile
      }}
      sx={{
        width: 280,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 280,
          boxSizeing: 'border-box',
          borderRight: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        },
      }}
    >
      <Box
        sx={{
          width: 280,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'background.paper',
        }}
        role="presentation"
      >
        <Box 
          sx={{ 
            p: 3, 
            backgroundColor: 'primary.main', 
            color: 'primary.contrastText',
            textAlign: 'center',
          }}
        >
          <Typography variant="h6" component="div" sx={{ fontWeight: 600, mb: 0.5 }}>
            CRM Система
          </Typography>
          <Typography variant="body2" component="div" sx={{ opacity: 0.9 }}>
            Онлайн школа английского
          </Typography>
        </Box>
        
        <Divider />
        
        <List sx={{ flex: 1, pt: 1 }}>
          {menuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <ListItem
                button
                key={item.text}
                onClick={() => handleNavigation(item.path)}
                selected={active}
                sx={{
                  margin: '4px 8px',
                  borderRadius: 2,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.light',
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'primary.light',
                    },
                  },
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    color: active ? 'primary.main' : 'inherit',
                    minWidth: 40,
                  }}
                >
                  {getActiveIcon(item.icon, active)}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  sx={{ 
                    '& .MuiListItemText-primary': {
                      fontWeight: active ? 600 : 400,
                    }
                  }} 
                />
              </ListItem>
            );
          })}
        </List>
        
        <Divider />
        
        <List sx={{ pb: 2 }}>
          <ListItem 
            button 
            onClick={onNotificationClick}
            sx={{
              margin: '4px 8px',
              borderRadius: 2,
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <ListItemIcon>
              <NotificationsIcon />
            </ListItemIcon>
            <ListItemText primary="Уведомления" />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;