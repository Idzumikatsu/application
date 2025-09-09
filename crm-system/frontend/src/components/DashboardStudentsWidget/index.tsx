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
} from '@mui/material';
import {
  Person as PersonIcon,
  School as SchoolIcon,
  Event as EventIcon,
  TrendingUp as TrendingUpIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useNavigate } from 'react-router-dom';

interface StudentSummary {
  id: number;
  name: string;
  email: string;
  phone: string;
  assignedTeacher: string;
  totalLessons: number;
  completedLessons: number;
  remainingLessons: number;
  nextLessonDate?: string;
  status: 'active' | 'inactive' | 'new';
}

const DashboardStudentsWidget: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadRecentStudents();
    }
  }, [user?.id]);

  const loadRecentStudents = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call to fetch recent students
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Demo data - in real implementation, fetch from API
      const demoStudents: StudentSummary[] = [
        {
          id: 1,
          name: 'Иванов Петр',
          email: 'ivanov@example.com',
          phone: '+7 (999) 123-45-67',
          assignedTeacher: 'Смирнова Анна',
          totalLessons: 20,
          completedLessons: 18,
          remainingLessons: 2,
          nextLessonDate: '2025-09-10',
          status: 'active',
        },
        {
          id: 2,
          name: 'Петрова Мария',
          email: 'petrova@example.com',
          phone: '+7 (999) 234-56-78',
          assignedTeacher: 'Кузнецов Дмитрий',
          totalLessons: 30,
          completedLessons: 25,
          remainingLessons: 5,
          nextLessonDate: '2025-09-11',
          status: 'active',
        },
        {
          id: 3,
          name: 'Сидоров Алексей',
          email: 'sidorov@example.com',
          phone: '+7 (999) 345-67-89',
          assignedTeacher: 'Смирнова Анна',
          totalLessons: 10,
          completedLessons: 8,
          remainingLessons: 2,
          nextLessonDate: '2025-09-12',
          status: 'active',
        },
        {
          id: 4,
          name: 'Козлова Елена',
          email: 'kozlova@example.com',
          phone: '+7 (999) 456-78-90',
          assignedTeacher: 'Кузнецов Дмитрий',
          totalLessons: 15,
          completedLessons: 12,
          remainingLessons: 3,
          nextLessonDate: '2025-09-13',
          status: 'active',
        },
      ];

      setStudents(demoStudents);
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки информации о студентах');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: StudentSummary['status']) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      case 'new':
        return 'info';
      default:
        return 'default';
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
        avatar={<PersonIcon color="primary" />}
        title="Студенты"
        subheader={`Активных студентов: ${students.length}`}
        action={
          <Button 
            size="small" 
            startIcon={<AddIcon />}
            onClick={() => navigate('/manager/students/create')}
          >
            Добавить
          </Button>
        }
      />
      
      <CardContent>
        <List disablePadding>
          {students.slice(0, 5).map((student, index) => (
            <ListItem 
              key={student.id}
              sx={{ 
                py: 1, 
                px: 0,
                borderBottom: index < Math.min(students.length, 5) - 1 ? '1px solid' : 'none',
                borderColor: 'divider'
              }}
            >
              <ListItemIcon sx={{ minWidth: 48 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <PersonIcon />
                </Avatar>
              </ListItemIcon>
              
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mr: 1 }}>
                      {student.name}
                    </Typography>
                    <Chip 
                      label={student.status === 'active' ? 'Активен' : 'Неактивен'}
                      color={getStatusColor(student.status) as any}
                      size="small"
                    />
                  </Box>
                }
                secondary={
                  <Box sx={{ mt: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <SchoolIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                      <Typography variant="caption" color="textSecondary">
                        Преподаватель: {student.assignedTeacher}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                      <Chip 
                        label={`${student.completedLessons}/${student.totalLessons}`}
                        color="success"
                        size="small"
                        variant="outlined"
                        icon={<TrendingUpIcon />}
                      />
                      
                      <Chip 
                        label={`Осталось: ${student.remainingLessons}`}
                        color="info"
                        size="small"
                        variant="outlined"
                      />
                      
                      {student.nextLessonDate && (
                        <Chip 
                          label={`Следующий: ${formatDate(student.nextLessonDate)}`}
                          color="primary"
                          size="small"
                          variant="outlined"
                          icon={<EventIcon />}
                        />
                      )}
                    </Box>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
        
        {students.length > 5 && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button 
              size="small" 
              onClick={() => navigate('/manager/students')}
            >
              Показать всех ({students.length})
            </Button>
          </Box>
        )}
        
        {students.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="body2" color="textSecondary">
              Нет активных студентов
            </Typography>
            <Button 
              size="small" 
              startIcon={<AddIcon />}
              onClick={() => navigate('/manager/students/create')}
              sx={{ mt: 1 }}
            >
              Добавить первого студента
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardStudentsWidget;