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
    console.log('🚀 [LOGINPAGE] Submit form with email:', email, 'password:', password ? '***' : 'empty');

    setLoading(true);
    setError(null);

    dispatch(loginStart());
    console.log('📝 [LOGINPAGE] Dispatched loginStart');

    try {
      console.log('🌐 [LOGINPAGE] Calling AuthService.login...');
      const response = await AuthService.login({ email, password });
      console.log('✅ [LOGINPAGE] AuthService response:', response);

      dispatch(loginSuccess({ user: response.user, token: response.token }));
      console.log('✅ [LOGINPAGE] Dispatched loginSuccess');

      AuthService.setToken(response.token);

      // Сохраняем refresh token если он есть в ответе
      if ((response as any).refreshToken) {
        AuthService.setRefreshToken((response as any).refreshToken);
      }

      console.log('🚀 [LOGINPAGE] Navigating to /dashboard');
      navigate('/dashboard');
    } catch (err: any) {
      console.error('❌ [LOGINPAGE] Login error:', err);

      let errorMessage = 'Ошибка входа в систему';

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
        console.log('📝 [LOGINPAGE] Error from backend:', err.response.data);
      } else if (err.message) {
        errorMessage = err.message;
        console.log('📝 [LOGINPAGE] Error message:', err.message);
      } else if (err.code === 'NETWORK_ERROR') {
        errorMessage = 'Ошибка сети. Проверьте подключение к интернету.';
        console.log('🌐 [LOGINPAGE] Network error detected');
      }

      dispatch(loginFailure(errorMessage));
      console.log('❌ [LOGINPAGE] Set error state and will show:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
      console.log('🏁 [LOGINPAGE] Set loading to false');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Войти'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;
