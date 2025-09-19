import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ManagerDashboardPage from '../pages/ManagerDashboardPage';
import ManagerTeachersPage from '../pages/ManagerTeachersPage';
import ManagerStudentsPage from '../pages/ManagerStudentsPage';
import ManagerSchedulingPage from '../pages/ManagerSchedulingPage';
import ManagerPackagesPage from '../pages/ManagerPackagesPage';
import ManagerNotificationsPage from '../pages/ManagerNotificationsPage';
import Users from '../pages/Users';

const ManagerRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="" element={<ManagerDashboardPage />} />
      <Route path="dashboard" element={<ManagerDashboardPage />} />
      <Route path="teachers" element={<ManagerTeachersPage />} />
      <Route path="students" element={<ManagerStudentsPage />} />
      <Route path="scheduling" element={<ManagerSchedulingPage />} />
      <Route path="packages" element={<ManagerPackagesPage />} />
      <Route path="notifications" element={<ManagerNotificationsPage />} />
      <Route path="users" element={<Users />} />
    </Routes>
  );
};

export default ManagerRoutes;