import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Routes, Route, useNavigate } from 'react-router-dom';
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
import AdminReportsPage from './AdminReportsPage';
import AdminSettingsPage from './AdminSettingsPage';

const AdminPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    // Set initial tab based on current path
    const path = window.location.pathname;
    if (path.includes('/admin/reports')) setActiveTab(5);
    else if (path.includes('/admin/students')) setActiveTab(4);
    else if (path.includes('/admin/teachers')) setActiveTab(3);
    else if (path.includes('/admin/managers')) setActiveTab(2);
    else if (path.includes('/admin/users')) setActiveTab(1);
    else setActiveTab(0);
  }, []);

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
        navigate('/admin/reports');
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
        <Tab label="Отчеты" />
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
          <Route path="/reports" element={<AdminReportsPage />} />
          <Route path="/settings" element={<AdminSettingsPage />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default AdminPage;