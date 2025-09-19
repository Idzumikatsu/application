import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TeacherDashboardPage from '../pages/TeacherDashboardPage';
import TeacherStatisticsPage from '../pages/TeacherStatisticsPage';
import TeacherAvailabilityPage from '../pages/TeacherAvailabilityPage';
import TeacherNotificationsPage from '../pages/TeacherNotificationsPage';
import TeacherLessonsPage from '../pages/TeacherLessonsPage';
import TeacherGroupLessonsPage from '../pages/TeacherGroupLessonsPage';
import TeacherStudentsPage from '../pages/TeacherStudentsPage';
import TeacherSchedulePage from '../pages/TeacherSchedulePage';

const TeacherRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="" element={<TeacherDashboardPage />} />
      <Route path="dashboard" element={<TeacherDashboardPage />} />
      <Route path="statistics" element={<TeacherStatisticsPage />} />
      <Route path="availability" element={<TeacherAvailabilityPage />} />
      <Route path="notifications" element={<TeacherNotificationsPage />} />
      <Route path="lessons" element={<TeacherLessonsPage />} />
      <Route path="group-lessons" element={<TeacherGroupLessonsPage />} />
      <Route path="students" element={<TeacherStudentsPage />} />
      <Route path="schedule" element={<TeacherSchedulePage />} />
    </Routes>
  );
};

export default TeacherRoutes;