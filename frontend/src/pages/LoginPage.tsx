import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import { setCredentials } from '../store/authSlice'; // Assuming setCredentials action for setting user and token
import { RootState } from '../store';
import AuthService from '../services/authService';
import { useLoginMutation, useVerifyMfaMutation } from '../apiSlice';

const schema = yup.object({
  email: yup.string().email('Неверный формат email').required('Email обязателен'),
  password: yup.string().min(6, 'Пароль должен содержать минимум 6 символов').required('Пароль обязателен'),
});

type LoginFormData = yup.InferType<typeof schema>;

const LoginPage: React.FC = () => {
  const [mfaDialogOpen, setMfaDialogOpen] = useState(false);
  const [otp, setOtp] = useState('');
  const [tempUser, setTempUser] = useState<any>(null);
  const [wasAuthenticated, setWasAuthenticated] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading: authLoading } = useSelector((state: RootState) => state.auth);

  const [login, { isLoading: loginLoading }] = useLoginMutation();
  const [verifyMfa, { isLoading: mfaLoading }] = useVerifyMfaMutation();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
  });

  const loading = loginLoading || mfaLoading || authLoading;

  useEffect(() => {
    if (isAuthenticated && user && !wasAuthenticated) {
      AuthService.setToken(user.token || '');
      let redirectPath = '/dashboard';
      switch (user.role) {
        case 'ADMIN':
          redirectPath = '/admin/dashboard';
          break;
        case 'MANAGER':
          redirectPath = '/manager/dashboard';
          break;
        case 'TEACHER':
          redirectPath = '/teacher/dashboard';
          break;
        case 'STUDENT':
          redirectPath = '/student/dashboard';
          break;
        default:
          redirectPath = '/dashboard';
      }
      navigate(redirectPath, { replace: true });
      setWasAuthenticated(true);
    }
  }, [isAuthenticated, user, navigate, wasAuthenticated]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      console.log('onSubmit called with data:', data);
      console.log('🔐 Attempting login for:', data.email);
      const result = await login({ email: data.email, password: data.password }).unwrap();
      if (result.mfaEnabled) {
        setTempUser(result);
        setMfaDialogOpen(true);
      } else {
        dispatch(setCredentials(result));
        toast.success('Успешный вход в систему');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMessage = err.data?.message || 'Ошибка входа в систему';
      if (err.status === 401) {
        toast.error('Неверный email или пароль');
      } else {
        toast.error(errorMessage);
      }
    }
  };

  const handleVerifyMfa = async () => {
    if (!tempUser || !otp) return;
    try {
      const result = await verifyMfa({ token: tempUser.token, otp }).unwrap();
      dispatch(setCredentials(result));
      setMfaDialogOpen(false);
      setOtp('');
      toast.success('Успешный вход в систему');
    } catch (err: any) {
      toast.error('Неверный OTP код');
      setOtp('');
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

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              autoComplete="email"
              autoFocus
              error={!!errors.email}
              helperText={errors.email?.message}
              {...register('email')}
              className="login-form-input"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Пароль"
              type="password"
              id="password"
              autoComplete="current-password"
              error={!!errors.password}
              helperText={errors.password?.message}
              {...register('password')}
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

      {/* MFA Dialog */}
      <Dialog open={mfaDialogOpen} onClose={() => { setMfaDialogOpen(false); reset(); }}>
        <DialogTitle>Подтверждение двухфакторной аутентификации</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Введите одноразовый пароль из вашего приложения-аутентификатора.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="OTP код"
            type="text"
            fullWidth
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            inputProps={{ maxLength: 6 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setMfaDialogOpen(false); setOtp(''); reset(); }}>Отмена</Button>
          <Button onClick={handleVerifyMfa} variant="contained" disabled={!otp || mfaLoading}>
            Подтвердить
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default LoginPage;