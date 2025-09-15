import * as React from 'react';
import { CssBaseline, Box } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ToastContainer } from 'react-toastify';

import { Navbar, Sidebar } from '@/components';
import ProtectedRoute from '@/routes/ProtectedRoute';
import { ManagerRoutes, StudentRoutes, TeacherRoutes } from '@/routes';
import LoginPage from '@/pages/LoginPage';
import UnauthorizedPage from '@/pages/UnauthorizedPage';
import { RootState, AppDispatch } from './store';
import { loginSuccess, logout } from './store/authSlice';
import AuthService from './services/authService';
import DashboardPage from './pages/DashboardPage';
import 'react-toastify/dist/ReactToastify.css';
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
  const [open, setOpen] = useState(false);

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

  const allowedRoles = ['ADMIN', 'STUDENT', 'TEACHER'] as const;
  const userRole = user?.role as typeof allowedRoles[number] | undefined;

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        {user && <Sidebar open={open} onClose={handleDrawerClose} />}
        <Box component="main" sx={{ flexGrow: 1 }}>
          {user && <Navbar />}
          <Box sx={{ p: 3 }}>
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
          <ToastContainer />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;