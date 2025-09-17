import * as React from 'react';
import { useState, useEffect } from 'react';
import { CssBaseline, Box, useMediaQuery, ThemeProvider as MuiThemeProvider } from '@mui/material';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '@mui/material/styles';

import { Navbar, Sidebar } from '@/components';
import ProtectedRoute from '@/routes/ProtectedRoute';
import { ManagerRoutes, StudentRoutes, TeacherRoutes } from '@/routes';
import LoginPage from '@/pages/LoginPage';
import UnauthorizedPage from '@/pages/UnauthorizedPage';
import { RootState, AppDispatch } from './store';
import { loginSuccess, logout } from './store/authSlice';
import AuthService from './services/authService';
import DashboardPage from './pages/DashboardPage';
import theme from './theme';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch: AppDispatch = useDispatch();
  const [open, setOpen] = useState(!isMobile);

  useEffect(() => {
    const token = AuthService.getToken();
    console.log('🔄 App initialization - token in localStorage:', token ? 'PRESENT' : 'NOT FOUND');

    if (token) {
      // Проверяем, действителен ли токен перед попыткой восстановления сессии
      if (AuthService.isAuthenticated()) {
        console.log('🔄 Token is valid, attempting to restore session...');
        try {
          // Проверяем токен и восстанавливаем сессию
          AuthService.getCurrentUser()
            .then((userData) => {
              console.log('✅ Session restored successfully:', userData);
              dispatch(loginSuccess({ user: userData, token }));
            })
            .catch((error) => {
              console.error('❌ Session restoration failed:', error);
              // Очищаем недействительный токен
              AuthService.logout();
              dispatch(logout());
            });
        } catch (error) {
          console.error('❌ Unexpected error during session restoration:', error);
          AuthService.logout();
          dispatch(logout());
        }
      } else {
        console.log('ℹ️ Token is expired or invalid, clearing session');
        // Токен недействителен, очищаем сессию
        AuthService.logout();
        dispatch(logout());
      }
    } else {
      console.log('ℹ️ No token found, user not authenticated');
    }
  }, [dispatch]);

  useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  const renderProtectedRoute = (element: React.ReactElement) => {
    return isAuthenticated ? element : <Navigate to="/login" replace />;
  };

  const renderRoleBasedRoute = (allowedRoles: string[], element: React.ReactElement) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    
    if (user && allowedRoles.includes(user.role)) {
      return element;
    }
    
    // Если роль пользователя не соответствует разрешенным, перенаправляем на dashboard
    return <Navigate to="/dashboard" replace />;
  };

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleDrawerClose = () => {
    if (isMobile) {
      setOpen(false);
    }
  };

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
        {user && (
          <Sidebar 
            open={open} 
            onClose={handleDrawerClose} 
            onNotificationClick={handleDrawerToggle}
          />
        )}
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1,
            width: user ? { xs: '100%', md: `calc(100% - ${open ? 280 : 0}px)` } : '100%',
            ml: user ? { xs: 0, md: open ? '280px' : 0 } : 0,
            transition: 'margin 225ms cubic-bezier(0, 0, 0.2, 1) 0ms',
          }}
        >
          {user && <Navbar onNotificationClick={handleDrawerToggle} />}
          <Box 
            sx={{ 
              p: { xs: 1, sm: 2, md: 3 },
              pt: { xs: 2, sm: 3, md: 3 },
              minHeight: 'calc(100vh - 64px)',
            }}
            className="main-content"
          >
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              <Route 
                path="/dashboard" 
                element={renderProtectedRoute(<DashboardPage />)} 
              />
              
              {/* Teacher routes */}
              <Route 
                path="/teacher/*" 
                element={renderRoleBasedRoute(['TEACHER'], <TeacherRoutes />)} 
              />
              
              {/* Manager routes */}
              <Route 
                path="/manager/*" 
                element={renderRoleBasedRoute(['MANAGER', 'ADMIN'], <ManagerRoutes />)} 
              />
              
              {/* Student routes */}
              <Route 
                path="/student/*" 
                element={renderRoleBasedRoute(['STUDENT'], <StudentRoutes />)} 
              />
              
              {/* Admin routes */}
              <Route
                path="/admin/*"
                element={renderRoleBasedRoute(['ADMIN'], <ManagerRoutes />)}
              />
              
              {/* Default route */}
              <Route
                path="/"
                element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
              />
            </Routes>
          </Box>
          <ToastContainer 
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </Box>
      </Box>
    </MuiThemeProvider>
  );
}

export default App;