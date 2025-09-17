import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import { loginStart, loginSuccess, loginFailure } from '../store/authSlice';
import AuthService from '../services/authService';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate inputs
    if (!email || !password) {
      setError('Введите email и пароль');
      setLoading(false);
      return;
    }

    dispatch(loginStart());

    try {
      console.log('🔐 Attempting login for:', email);
      const response = await AuthService.login({ email, password });

      console.log('✅ Login successful, user data:', {
        hasToken: !!response.token,
        role: response.user?.role,
        firstName: response.user?.firstName
      });

      dispatch(loginSuccess({ user: response.user, token: response.token }));

      AuthService.setToken(response.token);

      console.log('🏠 Navigation to dashboard...');
      navigate('/dashboard');
    } catch (err: any) {
      console.error('❌ Login failed:', {
        status: err.response?.status,
        statusText: err.response?.statusText,
        message: err.response?.data?.message || err.message,
        hasResponse: !!err.response
      });

      let errorMessage = 'Ошибка входа в систему';

      // Добавляем больше информации об ошибке для диагностики
      if (err.response?.status === 401) {
        errorMessage = 'Неверный email или пароль';
        console.log('🔍 401 Unauthorized - проверьте правильность учетных данных');
      } else if (err.response?.status === 400) {
        errorMessage = 'Некорректные данные для входа';
        console.log('🔍 400 Bad Request - проверьте формат данных');
      } else if (err.response?.status === 404) {
        errorMessage = 'Сервис аутентификации недоступен';
        console.log('🔍 404 Not Found - проверьте URL API endpoint');
      } else if (err.response?.status === 500) {
        errorMessage = 'Ошибка сервера';
        console.log('🔍 500 Internal Server Error - проблема на стороне сервера');
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      } else if (err.code === 'NETWORK_ERROR') {
        errorMessage = 'Ошибка сети. Проверьте подключение к интернету.';
      }

      console.log('🔍 Финальное сообщение об ошибке:', errorMessage);
      dispatch(loginFailure(errorMessage));
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs" className="login-container">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }} className="login-card">
          <Typography component="h1" variant="h5" align="center" gutterBottom className="login-title">
            CRM Система
          </Typography>
          <Typography variant="h6" align="center" color="textSecondary" gutterBottom className="login-subtitle">
            Онлайн школа английского языка
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} className="crm-alert crm-alert-error">
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-form-input"
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-form-input"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              className="login-button"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} className="login-button-loading" /> : 'Войти'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;
