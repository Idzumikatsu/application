import React from 'react';
import { Routes, Route } from 'react-router-dom';
import StudentSchedulePage from '../pages/StudentSchedulePage';
import StudentGroupLessonsPage from '../pages/StudentGroupLessonsPage';
import StudentPackagesPage from '../pages/StudentPackagesPage';
import StudentNotificationsPage from '../pages/StudentNotificationsPage';

const StudentRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/schedule" element={<StudentSchedulePage />} />
      <Route path="/group-lessons" element={<StudentGroupLessonsPage />} />
      <Route path="/packages" element={<StudentPackagesPage />} />
      <Route path="/notifications" element={<StudentNotificationsPage />} />
      <Route path="/" element={<StudentSchedulePage />} />
    </Routes>
  );
};

export default StudentRoutes;