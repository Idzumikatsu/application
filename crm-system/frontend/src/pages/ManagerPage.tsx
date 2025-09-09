import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Routes, Route, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Tabs,
  Tab,
  AppBar,
  Toolbar,
  Button,
} from '@mui/material';
import { RootState } from '../store';
import ManagerTeachersPage from './ManagerTeachersPage';
import ManagerStudentsPage from './ManagerStudentsPage';
import ManagerSchedulingPage from './ManagerSchedulingPage';
import ManagerPackagesPage from './ManagerPackagesPage';

const ManagerPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    switch (newValue) {
      case 0:
        navigate('/manager/teachers');
        break;
      case 1:
        navigate('/manager/students');
        break;
      case 2:
        navigate('/manager/scheduling');
        break;
      case 3:
        navigate('/manager/packages');
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
        variant="fullWidth"
      >
        <Tab label="Преподаватели" />
        <Tab label="Студенты" />
        <Tab label="Планирование" />
        <Tab label="Пакеты" />
      </Tabs>
      
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <Routes>
          <Route path="/teachers" element={<ManagerTeachersPage />} />
          <Route path="/students" element={<ManagerStudentsPage />} />
          <Route path="/scheduling" element={<ManagerSchedulingPage />} />
          <Route path="/packages" element={<ManagerPackagesPage />} />
          <Route path="/" element={<ManagerTeachersPage />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default ManagerPage;