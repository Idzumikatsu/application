import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TeacherSchedulePage from './TeacherSchedulePage';
import TeacherLessonsPage from './TeacherLessonsPage';
import TeacherGroupLessonsPage from './TeacherGroupLessonsPage';
import TeacherStudentsPage from './TeacherStudentsPage';

const TeacherRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/schedule" element={<TeacherSchedulePage />} />
      <Route path="/lessons" element={<TeacherLessonsPage />} />
      <Route path="/group-lessons" element={<TeacherGroupLessonsPage />} />
      <Route path="/students" element={<TeacherStudentsPage />} />
      <Route path="/" element={<TeacherSchedulePage />} />
    </Routes>
  );
};

export default TeacherRoutes;