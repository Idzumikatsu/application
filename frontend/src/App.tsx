import * as React from 'react';
import { useState, useEffect } from 'react';
import { CssBaseline, Box, useMediaQuery, ThemeProvider as MuiThemeProvider, CircularProgress, Typography } from '@mui/material';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '@mui/material/styles';

import { Navbar, Sidebar } from '@/components';
import ProtectedRoute from '@/routes/ProtectedRoute';
import { ManagerRoutes, StudentRoutes, TeacherRoutes, AdminRoutes } from '@/routes';
import LoginPage from '@/pages/LoginPage';
import UnauthorizedPage from '@/pages/UnauthorizedPage';
import { RootState, AppDispatch } from './store';
import { loginSuccess, logout } from './store/authSlice';
import AuthService from './services/authService';
import DashboardPage from './pages/DashboardPage';
import theme from './theme';
import 'react-toastify/dist/ReactToastify.css';
import './styles/global.css';
import './App.css';

function App() {
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const authState = useSelector((state: RootState) => {
    console.log('🔄 useSelector - raw state:', state);
    const auth = state.auth;
    console.log('🔄 useSelector - auth state:', auth);
    return auth;
  });
  const { isAuthenticated, user, loading } = authState;
  console.log('🔄 useSelector - isAuthenticated:', isAuthenticated, 'user:', user, 'loading:', loading);
  const dispatch: AppDispatch = useDispatch();
  const [open, setOpen] = useState(!isMobile);
  const [initializing, setInitializing] = useState(true);

  console.log('🔄 App render - isAuthenticated:', isAuthenticated, 'user:', user, 'loading:', loading, 'initializing:', initializing);

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
              console.log('🔄 Dispatching loginSuccess action...');
              const action = loginSuccess({ user: userData, token });
              console.log('🔄 Action to dispatch:', action);
              const result = dispatch(action);
              console.log('✅ loginSuccess action dispatched, result:', result);
              console.log('🔄 Setting initializing to false...');
              setInitializing(false);
              console.log('✅ Initializing set to false');
            })
            .catch((error) => {
              console.error('❌ Session restoration failed:', error);
              // Очищаем недействительный токен
              AuthService.logout();
              dispatch(logout());
              console.log('🔄 Setting initializing to false due to error...');
              setInitializing(false);
              console.log('✅ Initializing set to false due to error');
            });
        } catch (error) {
          console.error('❌ Unexpected error during session restoration:', error);
          AuthService.logout();
          dispatch(logout());
          console.log('🔄 Setting initializing to false due to exception...');
          setInitializing(false);
          console.log('✅ Initializing set to false due to exception');
        }
      } else {
        console.log('ℹ️ Token is expired or invalid, clearing session');
        // Токен недействителен, очищаем сессию
        AuthService.logout();
        dispatch(logout());
        console.log('🔄 Setting initializing to false due to invalid token...');
        setInitializing(false);
        console.log('✅ Initializing set to false due to invalid token');
      }
    } else {
      console.log('ℹ️ No token found, user not authenticated');
      console.log('🔄 Setting initializing to false due to no token...');
      setInitializing(false);
      console.log('✅ Initializing set to false due to no token');
    }
  }, [dispatch]);

  useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  const renderProtectedRoute = (element: React.ReactElement) => {
    // If still initializing, show loading indicator
    if (initializing) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
          <Typography variant="body1" sx={{ ml: 2 }}>Загрузка...</Typography>
        </Box>
      );
    }
    
    return isAuthenticated ? element : <Navigate to="/login" replace />;
  };

  const renderRoleBasedRoute = (allowedRoles: string[], element: React.ReactElement) => {
    console.log('🔄 renderRoleBasedRoute - isAuthenticated:', isAuthenticated, 'user:', user, 'allowedRoles:', allowedRoles, 'initializing:', initializing);
    
    // If still initializing, show loading indicator
    if (initializing) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
          <Typography variant="body1" sx={{ ml: 2 }}>Загрузка...</Typography>
        </Box>
      );
    }
    
    if (!isAuthenticated) {
      console.log('❌ User not authenticated, redirecting to login');
      return <Navigate to="/login" replace />;
    }
    
    if (user && allowedRoles.includes(user.role)) {
      console.log('✅ User authenticated and has correct role, rendering element');
      return element;
    }
    
    // Если роль пользователя не соответствует разрешенным, перенаправляем на dashboard
    console.log('❌ User does not have correct role, redirecting to dashboard');
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
                element={renderRoleBasedRoute(['ADMIN'], <AdminRoutes />)}
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