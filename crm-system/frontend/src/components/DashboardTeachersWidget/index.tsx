import React, { useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Chip,
  Divider,
  CircularProgress,
  Button,
} from '@mui/material';
import {
  School as SchoolIcon,
  Event as EventIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { setTeachers, setLoading, setError } from '../../store/userSlice';
import UserService from '../../services/userService';
import { Teacher } from '../../types';

const DashboardTeachersWidget: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { teachers, loading, error } = useSelector((state: RootState) => state.users);

  useEffect(() => {
    if (user?.role === 'MANAGER' || user?.role === 'ADMIN') {
      loadTeachers();
    }
  }, [user?.id]);

  const loadTeachers = async () => {
    if (!user?.id) return;
    
    dispatch(setLoading(true));
    try {
      const data = await UserService.getAllTeachers();
      // Sort by name and take first 5
      const sortedData = data
        .sort((a, b) => 
          `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
        )
        .slice(0, 5);
      dispatch(setTeachers(sortedData));
    } catch (err: any) {
      dispatch(setError(err.message || 'Ошибка загрузки преподавателей'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Simulate teacher stats for demo purposes
  const getTeacherStats = (teacher: Teacher) => {
    return {
      scheduledLessons: Math.floor(Math.random() * 10) + 5,
      completedLessons: Math.floor(Math.random() * 8) + 3,
      availableSlots: Math.floor(Math.random() * 15) + 10,
    };
  };

  if (user?.role !== 'MANAGER' && user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <Card elevation={3}>
      <CardHeader
        avatar={<SchoolIcon />}
        title="Преподаватели"
        subheader={`Всего преподавателей: ${teachers.length}`}
      />
      
      <CardContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : teachers.length === 0 ? (
          <Typography variant="body2" color="textSecondary" align="center" sx={{ py: 2 }}>
            Нет преподавателей
          </Typography>
        ) : (
          <>
            <List disablePadding>
              {teachers.map((teacher, index) => {
                const stats = getTeacherStats(teacher);
                
                return (
                  <React.Fragment key={teacher.id}>
                    <ListItem alignItems="flex-start" sx={{ py: 1, px: 0 }}>
                      <ListItemAvatar>
                        <Avatar>
                          {teacher.firstName?.charAt(0)}
                          {teacher.lastName?.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle2">
                            {teacher.firstName} {teacher.lastName}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                              <Chip 
                                icon={<EventIcon fontSize="small" />} 
                                label={`${stats.scheduledLessons} занятий`} 
                                size="small" 
                                variant="outlined"
                              />
                              <Chip 
                                icon={<CheckCircleIcon fontSize="small" />} 
                                label={`${stats.completedLessons} завершено`} 
                                size="small" 
                                variant="outlined"
                                color="success"
                              />
                            </Box>
                            <Typography variant="caption" color="textSecondary">
                              {stats.availableSlots} доступных слотов
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < teachers.length - 1 && <Divider />}
                  </React.Fragment>
                );
              })}
            </List>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button variant="outlined" size="small">
                Все преподаватели
              </Button>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardTeachersWidget;