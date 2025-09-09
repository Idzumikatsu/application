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
import StudentSchedulePage from './StudentSchedulePage';
import StudentGroupLessonsPage from './StudentGroupLessonsPage';
import StudentPackagesPage from './StudentPackagesPage';
import StudentNotificationsPage from './StudentNotificationsPage';

const StudentPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    switch (newValue) {
      case 0:
        navigate('/student/schedule');
        break;
      case 1:
        navigate('/student/group-lessons');
        break;
      case 2:
        navigate('/student/packages');
        break;
      case 3:
        navigate('/student/notifications');
        break;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Студент: {user?.firstName} {user?.lastName}
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
        <Tab label="Расписание" />
        <Tab label="Групповые уроки" />
        <Tab label="Пакеты" />
        <Tab label="Уведомления" />
      </Tabs>
      
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <Routes>
          <Route path="/schedule" element={<StudentSchedulePage />} />
          <Route path="/group-lessons" element={<StudentGroupLessonsPage />} />
          <Route path="/packages" element={<StudentPackagesPage />} />
          <Route path="/notifications" element={<StudentNotificationsPage />} />
          <Route path="/" element={<StudentSchedulePage />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default StudentPage;