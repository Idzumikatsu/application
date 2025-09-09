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
    if (token) {
      // Проверяем токен и восстанавливаем сессию
      AuthService.getCurrentUser()
        .then((userData) => {
          dispatch(loginSuccess({ user: userData, token }));
        })
        .catch(() => {
          dispatch(logout());
        });
    }
  }, [dispatch]);

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
          
          {/* Default route */}
          <Route 
            path="/" 
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} 
          />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;