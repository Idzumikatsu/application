import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { RootState, AppDispatch } from './store';
import { loginSuccess, logout } from './store/authSlice';
import AuthService from './services/authService';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TeacherPage from './pages/TeacherPage';
import ManagerPage from './pages/ManagerPage';
import StudentPage from './pages/StudentPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import AuthErrorHandler from './components/AuthErrorHandler';
import LessonStatusAutomation from './components/LessonStatus/LessonStatusAutomation';
import NotificationPanel from './components/NotificationPanel';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

function App() {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch: AppDispatch = useDispatch();

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

  // Автоматическое обновление токена
  useEffect(() => {
    const checkTokenRefresh = async () => {
      if (isAuthenticated && AuthService.shouldRefreshToken()) {
        try {
          const newToken = await AuthService.refreshToken();
          AuthService.setToken(newToken);
          dispatch(loginSuccess({ user: user!, token: newToken }));
        } catch (error) {
          console.warn('Не удалось обновить токен:', error);
          // При ошибке обновления токена выходим из системы
          dispatch(logout());
          AuthService.logout();
        }
      }
    };

    // Проверяем каждые 30 секунд
    const interval = setInterval(checkTokenRefresh, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated, user, dispatch]);

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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app-container">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/dashboard" 
            element={renderProtectedRoute(<DashboardPage />)} 
          />
          
          {/* Teacher routes */}
          <Route 
            path="/teacher/*" 
            element={renderRoleBasedRoute(['TEACHER'], <TeacherPage />)} 
          />
          
          {/* Manager routes */}
          <Route 
            path="/manager/*" 
            element={renderRoleBasedRoute(['MANAGER', 'ADMIN'], <ManagerPage />)} 
          />
          
          {/* Student routes */}
          <Route 
            path="/student/*" 
            element={renderRoleBasedRoute(['STUDENT'], <StudentPage />)} 
          />
          
          {/* Admin routes */}
          <Route
            path="/admin/*"
            element={renderRoleBasedRoute(['ADMIN'], <ManagerPage />)}
          />
          
          {/* Unauthorized route */}
          <Route
            path="/unauthorized"
            element={<UnauthorizedPage />}
          />
          
          {/* Default route */}
          <Route
            path="/"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
          />
        </Routes>
        
        {/* Global authentication error handler */}
        <AuthErrorHandler />
        
        {/* Global lesson status automation */}
        {isAuthenticated && (
          <LessonStatusAutomation />
        )}
        
        {/* Global notification panel */}
        {isAuthenticated && (
          <NotificationPanel />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;