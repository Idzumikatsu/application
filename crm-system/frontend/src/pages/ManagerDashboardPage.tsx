import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  Chip,
  Alert,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Add as AddIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Event as EventIcon,
  Assignment as AssignmentIcon,
  Notifications as NotificationsIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  CalendarToday as CalendarTodayIcon,
  Group as GroupIcon,
} from '@mui/icons-material';
import { RootState } from '../store';
import { useNavigate } from 'react-router-dom';
import DashboardStatisticsWidget from '../components/DashboardStatisticsWidget';
import DashboardQuickActionsWidget from '../components/DashboardQuickActionsWidget';
import DashboardCalendarWidget from '../components/DashboardCalendarWidget';
import DashboardPackageNotificationsWidget from '../components/DashboardPackageNotificationsWidget';
import DashboardStudentsWidget from '../components/DashboardStudentsWidget';
import DashboardTeachersWidget from '../components/DashboardTeachersWidget';

interface ManagerStatistics {
  totalStudents: number;
  totalTeachers: number;
  lessonsToday: number;
  lessonsThisWeek: number;
  lessonsThisMonth: number;
  attendanceRate: number;
  cancellationRate: number;
}

const ManagerDashboardPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [statistics, setStatistics] = useState<ManagerStatistics>({
    totalStudents: 0,
    totalTeachers: 0,
    lessonsToday: 0,
    lessonsThisWeek: 0,
    lessonsThisMonth: 0,
    attendanceRate: 0,
    cancellationRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    loadManagerStatistics();
  }, []);

  const loadManagerStatistics = async () => {
    setLoading(true);
    try {
      // Simulate API call to fetch manager statistics
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo data - in real implementation, fetch from API
      setStatistics({
        totalStudents: 156,
        totalTeachers: 24,
        lessonsToday: 42,
        lessonsThisWeek: 218,
        lessonsThisMonth: 892,
        attendanceRate: 92.5,
        cancellationRate: 7.2,
      });
    } catch (error) {
      console.error('Error loading manager statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const quickActions = [
    {
      title: 'Добавить студента',
      description: 'Зарегистрировать нового студента',
      icon: <PersonIcon />,
      path: '/manager/students/create',
      color: 'success' as const,
    },
    {
      title: 'Добавить преподавателя',
      description: 'Зарегистрировать нового преподавателя',
      icon: <SchoolIcon />,
      path: '/manager/teachers/create',
      color: 'warning' as const,
    },
    {
      title: 'Назначить урок',
      description: 'Запланировать новый урок',
      icon: <EventIcon />,
      path: '/manager/scheduling/create',
      color: 'primary' as const,
    },
    {
      title: 'Управление пакетами',
      description: 'Создать или продлить пакет уроков',
      icon: <AssignmentIcon />,
      path: '/manager/packages',
      color: 'info' as const,
    },
    {
      title: 'Просмотр уведомлений',
      description: 'Посмотреть все уведомления',
      icon: <NotificationsIcon />,
      path: '/manager/notifications',
      color: 'secondary' as const,
    },
  ];

  const getTrendIcon = (value: number, comparison: number) => {
    return value > comparison ? <TrendingUpIcon /> : <TrendingDownIcon />;
  };

  const getTrendColor = (value: number, comparison: number) => {
    return value > comparison ? 'success' : 'error';
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ width: 56, height: 56, mr: 2, bgcolor: 'primary.main' }}>
              <Typography variant="h6">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </Typography>
            </Avatar>
            <Box>
              <Typography variant="h4" gutterBottom>
                Добро пожаловать, {user?.firstName} {user?.lastName}!
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Панель управления менеджера
              </Typography>
            </Box>
          </Box>
          
          <TextField
            placeholder="Поиск студентов или преподавателей..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <Button size="small" onClick={() => setSearchQuery('')}>
                    Очистить
                  </Button>
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 300 }}
          />
        </Box>

        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
          <Tab label="Обзор" />
          <Tab label="Студенты" />
          <Tab label="Преподаватели" />
          <Tab label="Расписание" />
        </Tabs>
      </Box>

      {/* Statistics Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PersonIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Студенты</Typography>
              </Box>
              <Typography variant="h4" color="primary" gutterBottom>
                {statistics.totalStudents}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {getTrendIcon(statistics.totalStudents, 150)}
                <Typography variant="body2" color="textSecondary" sx={{ ml: 0.5 }}>
                  +12 за неделю
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SchoolIcon color="secondary" sx={{ mr: 1 }} />
                <Typography variant="h6">Преподаватели</Typography>
              </Box>
              <Typography variant="h4" color="secondary" gutterBottom>
                {statistics.totalTeachers}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {getTrendIcon(statistics.totalTeachers, 22)}
                <Typography variant="body2" color="textSecondary" sx={{ ml: 0.5 }}>
                  +2 за месяц
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EventIcon color="info" sx={{ mr: 1 }} />
                <Typography variant="h6">Уроки сегодня</Typography>
              </Box>
              <Typography variant="h4" color="info" gutterBottom>
                {statistics.lessonsToday}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarTodayIcon fontSize="small" />
                <Typography variant="body2" color="textSecondary" sx={{ ml: 0.5 }}>
                  {new Date().toLocaleDateString('ru-RU')}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <GroupIcon color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6">Посещаемость</Typography>
              </Box>
              <Typography variant="h4" color="warning" gutterBottom>
                {statistics.attendanceRate}%
              </Typography>
              <Chip 
                label={`Отмены: ${statistics.cancellationRate}%`} 
                color="error" 
                size="small" 
                variant="outlined"
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <NotificationsIcon color="primary" sx={{ mr: 1 }} />
                Быстрый доступ
              </Typography>
              <Grid container spacing={2}>
                {quickActions.map((action, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={action.icon}
                      onClick={() => navigate(action.path)}
                      sx={{
                        height: 80,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                      }}
                    >
                      <Typography variant="body2" gutterBottom>
                        {action.title}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {action.description}
                      </Typography>
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* Left Column - Statistics and Notifications */}
        <Grid item xs={12} lg={8}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <DashboardStatisticsWidget />
            </Grid>
            
            <Grid item xs={12}>
              <DashboardPackageNotificationsWidget />
            </Grid>
            
            <Grid item xs={12}>
              <DashboardCalendarWidget />
            </Grid>
          </Grid>
        </Grid>

        {/* Right Column - Quick Actions and Students/Teachers */}
        <Grid item xs={12} lg={4}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <DashboardQuickActionsWidget />
            </Grid>
            
            <Grid item xs={12}>
              <DashboardStudentsWidget />
            </Grid>
            
            <Grid item xs={12}>
              <DashboardTeachersWidget />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Alert for new features */}
      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="body2">
          💡 Совет: Используйте поиск для быстрого доступа к студентам и преподавателям. 
          Новые функции дашборда помогут эффективнее управлять учебным процессом.
        </Typography>
      </Alert>
    </Container>
  );
};

export default ManagerDashboardPage;