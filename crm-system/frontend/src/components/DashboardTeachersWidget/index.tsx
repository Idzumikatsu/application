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
  Avatar,
  Rating,
} from '@mui/material';
import {
  School as SchoolIcon,
  Event as EventIcon,
  TrendingUp as TrendingUpIcon,
  Add as AddIcon,
  Group as GroupIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useNavigate } from 'react-router-dom';

interface TeacherSummary {
  id: number;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  totalStudents: number;
  totalLessons: number;
  completedLessons: number;
  rating: number;
  availableSlots: number;
  status: 'active' | 'inactive' | 'busy';
  nextLessonDate?: string;
}

const DashboardTeachersWidget: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState<TeacherSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadTeachers();
    }
  }, [user?.id]);

  const loadTeachers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call to fetch teachers
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Demo data - in real implementation, fetch from API
      const demoTeachers: TeacherSummary[] = [
        {
          id: 1,
          name: 'Смирнова Анна',
          email: 'smirnova@example.com',
          phone: '+7 (999) 123-45-67',
          specialization: 'Английский язык',
          totalStudents: 15,
          totalLessons: 120,
          completedLessons: 115,
          rating: 4.8,
          availableSlots: 8,
          status: 'active',
          nextLessonDate: '2025-09-10',
        },
        {
          id: 2,
          name: 'Кузнецов Дмитрий',
          email: 'kuznetsov@example.com',
          phone: '+7 (999) 234-56-78',
          specialization: 'Математика',
          totalStudents: 12,
          totalLessons: 95,
          completedLessons: 90,
          rating: 4.9,
          availableSlots: 5,
          status: 'active',
          nextLessonDate: '2025-09-10',
        },
        {
          id: 3,
          name: 'Петров Иван',
          email: 'petrov@example.com',
          phone: '+7 (999) 345-67-89',
          specialization: 'Физика',
          totalStudents: 8,
          totalLessons: 65,
          completedLessons: 60,
          rating: 4.7,
          availableSlots: 12,
          status: 'active',
          nextLessonDate: '2025-09-11',
        },
        {
          id: 4,
          name: 'Сидорова Ольга',
          email: 'sidorova@example.com',
          phone: '+7 (999) 456-78-90',
          specialization: 'Химия',
          totalStudents: 10,
          totalLessons: 80,
          completedLessons: 75,
          rating: 4.6,
          availableSlots: 3,
          status: 'busy',
          nextLessonDate: '2025-09-10',
        },
      ];

      setTeachers(demoTeachers);
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки информации о преподавателях');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: TeacherSummary['status']) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      case 'busy':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: TeacherSummary['status']) => {
    switch (status) {
      case 'active':
        return 'Доступен';
      case 'inactive':
        return 'Неактивен';
      case 'busy':
        return 'Занят';
      default:
        return 'Неизвестно';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Нет уроков';
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short'
    });
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
          <Typography color="error">{error}</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card elevation={3}>
      <CardHeader
        avatar={<SchoolIcon color="secondary" />}
        title="Преподаватели"
        subheader={`Активных преподавателей: ${teachers.length}`}
        action={
          <Button 
            size="small" 
            startIcon={<AddIcon />}
            onClick={() => navigate('/manager/teachers/create')}
          >
            Добавить
          </Button>
        }
      />
      
      <CardContent>
        <List disablePadding>
          {teachers.slice(0, 5).map((teacher, index) => (
            <ListItem 
              key={teacher.id}
              sx={{ 
                py: 1, 
                px: 0,
                borderBottom: index < Math.min(teachers.length, 5) - 1 ? '1px solid' : 'none',
                borderColor: 'divider'
              }}
            >
              <ListItemIcon sx={{ minWidth: 48 }}>
                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                  <SchoolIcon />
                </Avatar>
              </ListItemIcon>
              
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mr: 1 }}>
                      {teacher.name}
                    </Typography>
                    <Chip 
                      label={getStatusText(teacher.status)}
                      color={getStatusColor(teacher.status) as any}
                      size="small"
                    />
                  </Box>
                }
                secondary={
                  <Box sx={{ mt: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <Typography variant="caption" color="textSecondary" sx={{ mr: 2 }}>
                        {teacher.specialization}
                      </Typography>
                      <Rating
                        value={teacher.rating}
                        precision={0.1}
                        size="small"
                        readOnly
                        sx={{ mr: 1 }}
                      />
                      <Typography variant="caption" color="textSecondary">
                        {teacher.rating}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 0.5 }}>
                      <Chip 
                        label={`${teacher.totalStudents} студентов`}
                        color="primary"
                        size="small"
                        variant="outlined"
                        icon={<GroupIcon />}
                      />
                      
                      <Chip 
                        label={`${teacher.completedLessons} уроков`}
                        color="success"
                        size="small"
                        variant="outlined"
                        icon={<TrendingUpIcon />}
                      />
                      
                      <Chip 
                        label={`${teacher.availableSlots} слотов`}
                        color="info"
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                    
                    {teacher.nextLessonDate && (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <EventIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                        <Typography variant="caption" color="textSecondary">
                          Следующий урок: {formatDate(teacher.nextLessonDate)}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
        
        {teachers.length > 5 && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button 
              size="small" 
              onClick={() => navigate('/manager/teachers')}
            >
              Показать всех ({teachers.length})
            </Button>
          </Box>
        )}
        
        {teachers.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="body2" color="textSecondary">
              Нет активных преподавателей
            </Typography>
            <Button 
              size="small" 
              startIcon={<AddIcon />}
              onClick={() => navigate('/manager/teachers/create')}
              sx={{ mt: 1 }}
            >
              Добавить первого преподавателя
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardTeachersWidget;