import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Divider,
  Avatar,
  Box,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { logout } from '../../store/authSlice';
import AuthService from '../../services/authService';

interface NavbarProps {
  onNotificationClick?: () => void;
  notificationCount?: number;
}

const Navbar: React.FC<NavbarProps> = ({ onNotificationClick, notificationCount = 0 }) => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    AuthService.logout();
    navigate('/login');
    handleMenuClose();
  };

  const handleProfileClick = () => {
    navigate('/profile');
    handleMenuClose();
  };

  const handleDashboardClick = () => {
    navigate('/dashboard');
    handleMenuClose();
  };

  const getRoleDisplayName = (role: string): string => {
    switch (role) {
      case 'ADMIN': return 'Администратор';
      case 'MANAGER': return 'Менеджер';
      case 'TEACHER': return 'Преподаватель';
      case 'STUDENT': return 'Студент';
      default: return 'Пользователь';
    }
  };

  return (
    <AppBar 
      position="static" 
      sx={{ 
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        backgroundColor: 'background.paper',
        color: 'text.primary',
      }}
    >
      <Toolbar sx={{ minHeight: 64 }}>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1, 
            cursor: 'pointer',
            fontWeight: 600,
            color: 'primary.main',
          }}
          onClick={handleDashboardClick}
        >
          CRM Система
        </Typography>
        
        {onNotificationClick && (
          <IconButton 
            color="primary" 
            onClick={onNotificationClick}
            sx={{ 
              mr: 2,
              backgroundColor: 'rgba(25, 118, 210, 0.08)',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.12)',
              },
            }}
          >
            <Badge 
              badgeContent={notificationCount} 
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  minWidth: 16,
                  height: 16,
                  fontSize: '0.625rem',
                }
              }}
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>
        )}
        
        <IconButton
          color="primary"
          onClick={handleMenuOpen}
          aria-controls={menuOpen ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={menuOpen ? 'true' : undefined}
          sx={{
            backgroundColor: 'rgba(25, 118, 210, 0.08)',
            '&:hover': {
              backgroundColor: 'rgba(25, 118, 210, 0.12)',
            },
          }}
        >
          <Avatar 
            sx={{ 
              width: 36, 
              height: 36, 
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          >
            {user?.firstName?.charAt(0)}
            {user?.lastName?.charAt(0)}
          </Avatar>
        </IconButton>
        
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={menuOpen}
          onClose={handleMenuClose}
          onClick={handleMenuClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
              mt: 1.5,
              borderRadius: 2,
              minWidth: 280,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ p: 2, pb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Avatar 
                sx={{ 
                  width: 40, 
                  height: 40, 
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  fontSize: '1rem',
                  fontWeight: 500,
                  mr: 1.5,
                }}
              >
                {user?.firstName?.charAt(0)}
                {user?.lastName?.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {user?.firstName} {user?.lastName}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {getRoleDisplayName(user?.role || '')}
                </Typography>
              </Box>
            </Box>
          </Box>
          
          <Divider />
          
          <MenuItem onClick={handleDashboardClick} sx={{ py: 1.2 }}>
            <HomeIcon sx={{ mr: 1.5, color: 'primary.main' }} />
            <Typography variant="body2">Главная</Typography>
          </MenuItem>
          
          <MenuItem onClick={handleProfileClick} sx={{ py: 1.2 }}>
            <AccountCircleIcon sx={{ mr: 1.5, color: 'primary.main' }} />
            <Typography variant="body2">Профиль</Typography>
          </MenuItem>
          
          <Divider />
          
          <MenuItem onClick={handleLogout} sx={{ py: 1.2 }}>
            <LogoutIcon sx={{ mr: 1.5, color: 'error.main' }} />
            <Typography variant="body2" color="error.main">Выйти</Typography>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;