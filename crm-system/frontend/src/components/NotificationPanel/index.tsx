import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Notification as NotificationType, NotificationStatus } from '../../types';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  IconButton,
  Badge,
  Drawer
} from '@mui/material';
import { Notifications, Close } from '@mui/icons-material';
import LessonStatusNotifications from './LessonStatusNotifications';
import LessonStatusNotificationSettings from './LessonStatusNotificationSettings';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`notification-tabpanel-${index}`}
      aria-labelledby={`notification-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
};

const NotificationPanel: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // Временные данные для демонстрации
  const demoNotifications: NotificationType[] = [
    {
      id: 1,
      recipientId: user?.id || 0,
      recipientType: 'STUDENT',
      notificationType: 'LESSON_COMPLETED',
      title: 'Статус урока изменен',
      message: 'Статус вашего урока от 2024-01-15 изменен с "Проведен" на "Завершен"',
      status: NotificationStatus.PENDING,
      priority: 1,
      relatedEntityId: 123,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as NotificationType,
    {
      id: 2,
      recipientId: user?.id || 0,
      recipientType: 'STUDENT',
      notificationType: 'LESSON_CANCELLED',
      title: 'Урок отменен',
      message: 'Ваш урок от 2024-01-16 был отменен. Причина: болезнь учителя',
      status: NotificationStatus.PENDING,
      priority: 2,
      relatedEntityId: 124,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      updatedAt: new Date(Date.now() - 3600000).toISOString()
    } as NotificationType
  ];

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <IconButton
        color="inherit"
        onClick={toggleDrawer}
        sx={{ position: 'relative' }}
      >
        <Badge badgeContent={demoNotifications.length} color="error">
          <Notifications />
        </Badge>
      </IconButton>

      <Drawer
        anchor="right"
        open={isOpen}
        onClose={toggleDrawer}
        PaperProps={{
          sx: {
            width: 400,
            maxWidth: '90vw',
            p: 2
          }
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" component="h2">
            Уведомления
          </Typography>
          <IconButton onClick={toggleDrawer} size="small">
            <Close />
          </IconButton>
        </Box>

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="notification tabs"
          variant="fullWidth"
        >
          <Tab label="Уведомления" />
          <Tab label="Настройки" />
        </Tabs>

        <TabPanel value={activeTab} index={0}>
          <LessonStatusNotifications notifications={demoNotifications} />
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <LessonStatusNotificationSettings />
        </TabPanel>
      </Drawer>
    </>
  );
};

export default NotificationPanel;