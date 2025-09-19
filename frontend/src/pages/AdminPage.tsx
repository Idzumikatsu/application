import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  AppBar,
  Toolbar,
  Button,
} from '@mui/material';
import { RootState } from '../store';
import AdminDashboardPage from './AdminDashboardPage';
import AdminUsersPage from './AdminUsersPage';
import AdminManagersPage from './AdminManagersPage';
import AdminTeachersPage from './AdminTeachersPage';
import AdminStudentsPage from './AdminStudentsPage';
import AdminLessonsPage from './AdminLessonsPage';
import AdminReportsPage from './AdminReportsPage';
import AdminNotificationsPage from './AdminNotificationsPage';
import AdminProfilePage from './AdminProfilePage';
import AdminSettingsPage from './AdminSettingsPage';

const AdminPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    // Set initial tab based on current path
    const path = location.pathname;
    if (path.includes('/admin/reports')) setActiveTab(6);
    else if (path.includes('/admin/lessons')) setActiveTab(5);
    else if (path.includes('/admin/students')) setActiveTab(4);
    else if (path.includes('/admin/teachers')) setActiveTab(3);
    else if (path.includes('/admin/managers')) setActiveTab(2);
    else if (path.includes('/admin/users')) setActiveTab(1);
    else if (path.includes('/admin/notifications')) setActiveTab(7);
    else if (path.includes('/admin/profile')) setActiveTab(8);
    else if (path.includes('/admin/settings')) setActiveTab(9);
    else setActiveTab(0);
  }, [location]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    switch (newValue) {
      case 0:
        navigate('/admin/dashboard');
        break;
      case 1:
        navigate('/admin/users');
        break;
      case 2:
        navigate('/admin/managers');
        break;
      case 3:
        navigate('/admin/teachers');
        break;
      case 4:
        navigate('/admin/students');
        break;
      case 5:
        navigate('/admin/lessons');
        break;
      case 6:
        navigate('/admin/reports');
        break;
      case 7:
        navigate('/admin/notifications');
        break;
      case 8:
        navigate('/admin/profile');
        break;
      case 9:
        navigate('/admin/settings');
        break;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Администратор: {user?.firstName} {user?.lastName}
          </Typography>
          <Button color="inherit" onClick={() => navigate('/dashboard')}>
            Назад на главную
          </Button>
        </Toolbar>
      </AppBar>
      
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        indicatorColor="secondary"
        textColor="inherit"
        variant="scrollable"
        scrollButtons="auto"
        sx={{ maxWidth: '100%' }}
      >
        <Tab label="Главная" />
        <Tab label="Пользователи" />
        <Tab label="Менеджеры" />
        <Tab label="Преподаватели" />
        <Tab label="Студенты" />
        <Tab label="Уроки" />
        <Tab label="Отчеты" />
        <Tab label="Уведомления" />
        <Tab label="Профиль" />
        <Tab label="Настройки" />
      </Tabs>
      
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <Routes>
          <Route path="/" element={<AdminDashboardPage />} />
          <Route path="/dashboard" element={<AdminDashboardPage />} />
          <Route path="/users" element={<AdminUsersPage />} />
          <Route path="/managers" element={<AdminManagersPage />} />
          <Route path="/teachers" element={<AdminTeachersPage />} />
          <Route path="/students" element={<AdminStudentsPage />} />
          <Route path="/lessons" element={<AdminLessonsPage />} />
          <Route path="/reports" element={<AdminReportsPage />} />
          <Route path="/notifications" element={<AdminNotificationsPage />} />
          <Route path="/profile" element={<AdminProfilePage />} />
          <Route path="/settings" element={<AdminSettingsPage />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default AdminPage;