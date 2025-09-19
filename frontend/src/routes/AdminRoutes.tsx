import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminPage from '../pages/AdminPage';
import AdminDashboardPage from '../pages/AdminDashboardPage';
import AdminUsersPage from '../pages/AdminUsersPage';
import AdminManagersPage from '../pages/AdminManagersPage';
import AdminTeachersPage from '../pages/AdminTeachersPage';
import AdminStudentsPage from '../pages/AdminStudentsPage';
import AdminLessonsPage from '../pages/AdminLessonsPage';
import AdminReportsPage from '../pages/AdminReportsPage';
import AdminNotificationsPage from '../pages/AdminNotificationsPage';
import AdminProfilePage from '../pages/AdminProfilePage';
import AdminSettingsPage from '../pages/AdminSettingsPage';

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="" element={<AdminPage />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="managers" element={<AdminManagersPage />} />
        <Route path="teachers" element={<AdminTeachersPage />} />
        <Route path="students" element={<AdminStudentsPage />} />
        <Route path="lessons" element={<AdminLessonsPage />} />
        <Route path="reports" element={<AdminReportsPage />} />
        <Route path="notifications" element={<AdminNotificationsPage />} />
        <Route path="profile" element={<AdminProfilePage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;