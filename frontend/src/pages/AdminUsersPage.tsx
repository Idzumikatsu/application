import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import { Add, People, School, Work } from '@mui/icons-material';

const AdminUsersPage: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [userType, setUserType] = useState<'manager' | 'teacher'>('manager');

  const handleCreateUser = () => {
    // Handle user creation logic
    setOpenDialog(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Управление пользователями</Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
        >
          Добавить пользователя
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card 
            sx={{ 
              height: '100%', 
              cursor: 'pointer',
              '&:hover': {
                boxShadow: 6,
              }
            }}
            onClick={() => window.location.hash = '#/admin/managers'}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Work sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Typography variant="h6">Менеджеры</Typography>
              </Box>
              <Typography variant="body1" color="textSecondary">
                Управление менеджерами системы
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card 
            sx={{ 
              height: '100%', 
              cursor: 'pointer',
              '&:hover': {
                boxShadow: 6,
              }
            }}
            onClick={() => window.location.hash = '#/admin/teachers'}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <School sx={{ fontSize: 40, color: 'secondary.main', mr: 2 }} />
                <Typography variant="h6">Преподаватели</Typography>
              </Box>
              <Typography variant="body1" color="textSecondary">
                Управление преподавателями
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card 
            sx={{ 
              height: '100%', 
              cursor: 'pointer',
              '&:hover': {
                boxShadow: 6,
              }
            }}
            onClick={() => window.location.hash = '#/admin/students'}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <People sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
                <Typography variant="h6">Студенты</Typography>
              </Box>
              <Typography variant="body1" color="textSecondary">
                Управление студентами
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Добавить пользователя</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Тип пользователя</InputLabel>
            <Select
              value={userType}
              onChange={(e) => setUserType(e.target.value as 'manager' | 'teacher')}
            >
              <MenuItem value="manager">Менеджер</MenuItem>
              <MenuItem value="teacher">Преподаватель</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            autoFocus
            margin="dense"
            label="Имя"
            type="text"
            fullWidth
            variant="outlined"
            sx={{ mt: 2 }}
          />
          
          <TextField
            margin="dense"
            label="Фамилия"
            type="text"
            fullWidth
            variant="outlined"
            sx={{ mt: 2 }}
          />
          
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            sx={{ mt: 2 }}
          />
          
          <TextField
            margin="dense"
            label="Телефон"
            type="tel"
            fullWidth
            variant="outlined"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Отмена</Button>
          <Button onClick={handleCreateUser} variant="contained">
            Создать
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminUsersPage;