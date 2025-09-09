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
import TeacherDashboardPage from './TeacherDashboardPage';
import TeacherStatisticsPage from './TeacherStatisticsPage';
import TeacherAvailabilityPage from './TeacherAvailabilityPage';
import TeacherNotificationsPage from './TeacherNotificationsPage';
import TeacherSchedulePage from './TeacherSchedulePage';
import TeacherLessonsPage from './TeacherLessonsPage';
import TeacherGroupLessonsPage from './TeacherGroupLessonsPage';
import TeacherStudentsPage from './TeacherStudentsPage';

const TeacherPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    switch (newValue) {
      case 0:
        navigate('/teacher/dashboard');
        break;
      case 1:
        navigate('/teacher/statistics');
        break;
      case 2:
        navigate('/teacher/availability');
        break;
      case 3:
        navigate('/teacher/notifications');
        break;
      case 4:
        navigate('/teacher/schedule');
        break;
      case 5:
        navigate('/teacher/lessons');
        break;
      case 6:
        navigate('/teacher/group-lessons');
        break;
      case 7:
        navigate('/teacher/students');
        break;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Преподаватель: {user?.firstName} {user?.lastName}
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
        <Tab label="Статистика" />
        <Tab label="Доступность" />
        <Tab label="Уведомления" />
        <Tab label="Расписание" />
        <Tab label="Уроки" />
        <Tab label="Групповые уроки" />
        <Tab label="Студенты" />
      </Tabs>
      
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <Routes>
          <Route path="/dashboard" element={<TeacherDashboardPage />} />
          <Route path="/statistics" element={<TeacherStatisticsPage />} />
          <Route path="/availability" element={<TeacherAvailabilityPage />} />
          <Route path="/notifications" element={<TeacherNotificationsPage />} />
          <Route path="/schedule" element={<TeacherSchedulePage />} />
          <Route path="/lessons" element={<TeacherLessonsPage />} />
          <Route path="/group-lessons" element={<TeacherGroupLessonsPage />} />
          <Route path="/students" element={<TeacherStudentsPage />} />
          <Route path="/" element={<TeacherDashboardPage />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default TeacherPage;