import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../../store/authSlice';
import AuthService from '../../services/authService';
import { LoginRequest } from '../../types';
import { RootState } from '../../store';
import { UserRole } from '../../types';

interface LoginFormProps {
  onLoginSuccess?: () => void;
}

interface LoginFormProps {
  onLoginSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [credentials, setCredentials] = useState<LoginRequest>({
    email: '',
    password: '',
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginStart());
    
    try {
      const response = await AuthService.login(credentials);
      dispatch(loginSuccess({ 
        user: {
          id: response.user.id,
          firstName: response.user.username || '',
          lastName: '', // Not available in response
          email: response.user.email,
          role: response.user.roles && response.user.roles.length > 0 ? 
                (response.user.roles[0] as UserRole) : UserRole.STUDENT,
          isActive: true // Not available in response, assuming active
        }, 
        token: response.token || response.accessToken 
      }));
      
      if (onLoginSuccess) {
        onLoginSuccess();
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Ошибка входа в систему';
      dispatch(loginFailure(errorMessage));
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400, mx: 'auto' }}>
      <Typography component="h1" variant="h5" align="center" gutterBottom>
        CRM Система
      </Typography>
      <Typography variant="h6" align="center" color="textSecondary" gutterBottom>
        Онлайн школа английского языка
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email"
          name="email"
          autoComplete="email"
          autoFocus
          value={credentials.email}
          onChange={handleChange}
          error={!!(credentials.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email))}
          helperText={credentials.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email) ? 'Введите корректный email' : ''}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Пароль"
          type="password"
          id="password"
          autoComplete="current-password"
          value={credentials.password}
          onChange={handleChange}
          error={!!(credentials.password && credentials.password.length < 6)}
          helperText={credentials.password && credentials.password.length < 6 ? 'Пароль должен содержать не менее 6 символов' : ''}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={loading || !credentials.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email) || !credentials.password || credentials.password.length < 6}
        >
          {loading ? <CircularProgress size={24} /> : 'Войти'}
        </Button>
      </Box>
    </Paper>
  );
};

export default LoginForm;