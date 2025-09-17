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
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Вход в CRM Synergy</h1>
        <p className="login-subtitle">Онлайн школа английского языка</p>

        {error && (
          <Alert severity="error" className="crm-alert crm-alert-error">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <div className="login-form-group">
            <label htmlFor="email" className="login-form-label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoFocus
              placeholder="Введите ваш email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-form-input"
              autoComplete="email"
            />
          </div>
          
          <div className="login-form-group">
            <label htmlFor="password" className="login-form-label">
              Пароль
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Введите ваш пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-form-input"
              autoComplete="current-password"
            />
          </div>
          
          <Button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            <span className={`login-button-text ${loading ? 'loading' : ''}`}>
              {loading ? 'Вход...' : 'Войти'}
            </span>
            {loading && (
              <CircularProgress size={24} className="login-button-loading" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
