import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  Chip,
  Divider,
} from '@mui/material';
import { AccountCircle, Email, Phone, Telegram } from '@mui/icons-material';

interface AdminProfileProps {
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    telegramUsername?: string;
    role: string;
    isActive: boolean;
    createdAt: string;
    lastLoginAt?: string;
  };
}

const AdminProfile: React.FC<AdminProfileProps> = ({ user }) => {
  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Avatar sx={{ width: 80, height: 80, mr: 3 }}>
          <AccountCircle sx={{ fontSize: 60 }} />
        </Avatar>
        <Box>
          <Typography variant="h5">
            {user.firstName} {user.lastName}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {user.role === 'ADMIN' ? 'Администратор' : user.role}
          </Typography>
          <Chip 
            label={user.isActive ? 'Активен' : 'Неактивен'} 
            color={user.isActive ? 'success' : 'error'} 
            size="small" 
            sx={{ mt: 1 }}
          />
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Email sx={{ mr: 2, color: 'text.secondary' }} />
            <Typography variant="body1">
              <strong>Email:</strong> {user.email}
            </Typography>
          </Box>
        </Grid>

        {user.phone && (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Phone sx={{ mr: 2, color: 'text.secondary' }} />
              <Typography variant="body1">
                <strong>Телефон:</strong> {user.phone}
              </Typography>
            </Box>
          </Grid>
        )}

        {user.telegramUsername && (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Telegram sx={{ mr: 2, color: 'text.secondary' }} />
              <Typography variant="body1">
                <strong>Telegram:</strong> @{user.telegramUsername}
              </Typography>
            </Box>
          </Grid>
        )}

        <Grid item xs={12}>
          <Typography variant="body1">
            <strong>Дата регистрации:</strong> {new Date(user.createdAt).toLocaleDateString('ru-RU')}
          </Typography>
        </Grid>

        {user.lastLoginAt && (
          <Grid item xs={12}>
            <Typography variant="body1">
              <strong>Последний вход:</strong> {new Date(user.lastLoginAt).toLocaleString('ru-RU')}
            </Typography>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

export default AdminProfile;