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
import ManagerDashboardPage from './ManagerDashboardPage';
import ManagerTeachersPage from './ManagerTeachersPage';
import ManagerStudentsPage from './ManagerStudentsPage';
import ManagerSchedulingPage from './ManagerSchedulingPage';
import ManagerPackagesPage from './ManagerPackagesPage';
import ManagerNotificationsPage from './ManagerNotificationsPage';

const ManagerPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    // Set initial tab based on current path
    const path = window.location.pathname;
    if (path.includes('/manager/notifications')) setActiveTab(5);
    else if (path.includes('/manager/packages')) setActiveTab(4);
    else if (path.includes('/manager/scheduling')) setActiveTab(3);
    else if (path.includes('/manager/students')) setActiveTab(2);
    else if (path.includes('/manager/teachers')) setActiveTab(1);
    else setActiveTab(0);
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    switch (newValue) {
      case 0:
        navigate('/manager/dashboard');
        break;
      case 1:
        navigate('/manager/teachers');
        break;
      case 2:
        navigate('/manager/students');
        break;
      case 3:
        navigate('/manager/scheduling');
        break;
      case 4:
        navigate('/manager/packages');
        break;
      case 5:
        navigate('/manager/notifications');
        break;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Менеджер: {user?.firstName} {user?.lastName}
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
        <Tab label="Преподаватели" />
        <Tab label="Студенты" />
        <Tab label="Планирование" />
        <Tab label="Пакеты" />
        <Tab label="Уведомления" />
      </Tabs>
      
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <Routes>
          <Route path="/dashboard" element={<ManagerDashboardPage />} />
          <Route path="/teachers" element={<ManagerTeachersPage />} />
          <Route path="/students" element={<ManagerStudentsPage />} />
          <Route path="/scheduling" element={<ManagerSchedulingPage />} />
          <Route path="/packages" element={<ManagerPackagesPage />} />
          <Route path="/notifications" element={<ManagerNotificationsPage />} />
          <Route path="/" element={<ManagerDashboardPage />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default ManagerPage;