import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ManagerTeachersPage from '../pages/ManagerTeachersPage';
import ManagerStudentsPage from '../pages/ManagerStudentsPage';
import ManagerSchedulingPage from '../pages/ManagerSchedulingPage';
import ManagerPackagesPage from '../pages/ManagerPackagesPage';

const ManagerRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/teachers" element={<ManagerTeachersPage />} />
      <Route path="/students" element={<ManagerStudentsPage />} />
      <Route path="/scheduling" element={<ManagerSchedulingPage />} />
      <Route path="/packages" element={<ManagerPackagesPage />} />
      <Route path="/" element={<ManagerTeachersPage />} />
    </Routes>
  );
};

export default ManagerRoutes;