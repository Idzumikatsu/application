import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Avatar,
} from '@mui/material';
import {
  Warning as WarningIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Assignment as AssignmentIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useNavigate } from 'react-router-dom';

interface StudentPackage {
  id: number;
  studentId: number;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  packageName: string;
  totalLessons: number;
  remainingLessons: number;
  expirationDate: string;
  status: 'active' | 'expired' | 'warning';
}

const DashboardPackageNotificationsWidget: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [packages, setPackages] = useState<StudentPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadExpiringPackages();
    }
  }, [user?.id]);

  const loadExpiringPackages = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call to fetch expiring packages
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Demo data - in real implementation, fetch from API
      const demoPackages: StudentPackage[] = [
        {
          id: 1,
          studentId: 101,
          studentName: 'Иванов Петр',
          studentEmail: 'ivanov@example.com',
          studentPhone: '+7 (999) 123-45-67',
          packageName: 'Стандартный пакет (20 уроков)',
          totalLessons: 20,
          remainingLessons: 2,
          expirationDate: '2025-09-15',
          status: 'warning',
        },
        {
          id: 2,
          studentId: 102,
          studentName: 'Смирнова Анна',
          studentEmail: 'smirnova@example.com',
          studentPhone: '+7 (999) 234-56-78',
          packageName: 'Премиум пакет (30 уроков)',
          totalLessons: 30,
          remainingLessons: 3,
          expirationDate: '2025-09-20',
          status: 'warning',
        },
        {
          id: 3,
          studentId: 103,
          studentName: 'Кузнецов Дмитрий',
          studentEmail: 'kuznetsov@example.com',
          studentPhone: '+7 (999) 345-67-89',
          packageName: 'Базовый пакет (10 уроков)',
          totalLessons: 10,
          remainingLessons: 1,
          expirationDate: '2025-09-12',
          status: 'warning',
        },
        {
          id: 4,
          studentId: 104,
          studentName: 'Петрова Мария',
          studentEmail: 'petrova@example.com',
          studentPhone: '+7 (999) 456-78-90',
          packageName: 'Стандартный пакет (20 уроков)',
          totalLessons: 20,
          remainingLessons: 5,
          expirationDate: '2025-09-25',
          status: 'active',
        },
      ];

      // Filter packages with ≤3 remaining lessons
      const expiringPackages = demoPackages.filter(pkg => pkg.remainingLessons <= 3);
      setPackages(expiringPackages);
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки информации о пакетах');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: StudentPackage['status']) => {
    switch (status) {
      case 'warning':
        return 'warning';
      case 'expired':
        return 'error';
      default:
        return 'success';
    }
  };

  const getStatusIcon = (remainingLessons: number) => {
    if (remainingLessons <= 1) {
      return <WarningIcon color="error" />;
    } else if (remainingLessons <= 3) {
      return <WarningIcon color="warning" />;
    }
    return <AssignmentIcon color="success" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleContactStudent = (student: StudentPackage) => {
    // In real implementation, this would open contact dialog
    console.log('Contact student:', student);
  };

  const handleRenewPackage = (student: StudentPackage) => {
    navigate(`/manager/packages/renew?studentId=${student.studentId}`);
  };

  if (loading) {
    return (
      <Card elevation={3}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card elevation={3}>
        <CardContent>
          <Alert severity="error">{error}</Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card elevation={3}>
      <CardHeader
        avatar={<WarningIcon color="warning" />}
        title="Уведомления о пакетах"
        subheader={`Студенты с заканчивающимися пакетами: ${packages.length}`}
        action={
          <Button 
            size="small" 
            startIcon={<AssignmentIcon />}
            onClick={() => navigate('/manager/packages')}
          >
            Все пакеты
          </Button>
        }
      />
      
      <CardContent>
        {packages.length === 0 ? (
          <Alert severity="success">
            <Typography variant="body2">
              Нет студентов с заканчивающимися пакетами уроков 🎉
            </Typography>
          </Alert>
        ) : (
          <>
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="body2">
                ⚠️ У следующих студентов осталось ≤3 занятий. Рекомендуется связаться для продления пакетов.
              </Typography>
            </Alert>
            
            <List disablePadding>
              {packages.map((pkg, index) => (
                <ListItem 
                  key={pkg.id}
                  sx={{ 
                    py: 1.5, 
                    px: 0,
                    borderBottom: index < packages.length - 1 ? '1px solid' : 'none',
                    borderColor: 'divider'
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 48 }}>
                    <Avatar sx={{ bgcolor: pkg.remainingLessons <= 1 ? 'error.main' : 'warning.main' }}>
                      {getStatusIcon(pkg.remainingLessons)}
                    </Avatar>
                  </ListItemIcon>
                  
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>
                          {pkg.studentName}
                        </Typography>
                        <Chip 
                          label={`${pkg.remainingLessons} из ${pkg.totalLessons}`}
                          color={getStatusColor(pkg.status)}
                          size="small"
                          icon={<TrendingDownIcon />}
                        />
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography variant="body2" color="textSecondary" sx={{ mr: 2 }}>
                            {pkg.packageName}
                          </Typography>
                          <Chip 
                            label={`до ${formatDate(pkg.expirationDate)}`}
                            color="info"
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                          <Button
                            size="small"
                            startIcon={<PhoneIcon />}
                            onClick={() => handleContactStudent(pkg)}
                            variant="outlined"
                          >
                            Позвонить
                          </Button>
                          
                          <Button
                            size="small"
                            startIcon={<EmailIcon />}
                            onClick={() => handleContactStudent(pkg)}
                            variant="outlined"
                          >
                            Написать
                          </Button>
                          
                          <Button
                            size="small"
                            startIcon={<AssignmentIcon />}
                            onClick={() => handleRenewPackage(pkg)}
                            variant="contained"
                            color="primary"
                          >
                            Продлить
                          </Button>
                        </Box>
                        
                        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PhoneIcon fontSize="small" color="action" />
                          <Typography variant="caption" color="textSecondary">
                            {pkg.studentPhone}
                          </Typography>
                          
                          <EmailIcon fontSize="small" color="action" sx={{ ml: 2 }} />
                          <Typography variant="caption" color="textSecondary">
                            {pkg.studentEmail}
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
            
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" color="textSecondary">
                Всего студентов с заканчивающимися пакетами: {packages.length}
              </Typography>
              
              <Button 
                variant="outlined" 
                size="small"
                onClick={loadExpiringPackages}
              >
                Обновить
              </Button>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardPackageNotificationsWidget;