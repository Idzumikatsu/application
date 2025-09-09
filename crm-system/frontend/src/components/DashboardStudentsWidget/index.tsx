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
  People as PeopleIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { setStudents, setLoading, setError } from '../../store/userSlice';
import UserService from '../../services/userService';
import { Student } from '../../types';

const DashboardStudentsWidget: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { students, loading, error } = useSelector((state: RootState) => state.users);

  useEffect(() => {
    if (user?.role === 'MANAGER' || user?.role === 'ADMIN' || user?.role === 'TEACHER') {
      loadStudents();
    }
  }, [user?.id]);

  const loadStudents = async () => {
    if (!user?.id) return;
    
    dispatch(setLoading(true));
    try {
      let data: Student[] = [];
      
      if (user.role === 'TEACHER') {
        // For teachers, get their assigned students
        data = await UserService.getTeacherStudents(user.id);
      } else {
        // For managers and admins, get all students
        data = await UserService.getAllStudents();
      }
      
      // Sort by name and take first 5
      const sortedData = data
        .sort((a, b) => 
          `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
        )
        .slice(0, 5);
      dispatch(setStudents(sortedData));
    } catch (err: any) {
      dispatch(setError(err.message || 'Ошибка загрузки студентов'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Simulate student stats for demo purposes
  const getStudentStats = (student: Student) => {
    return {
      totalLessons: Math.floor(Math.random() * 20) + 10,
      completedLessons: Math.floor(Math.random() * 15) + 5,
      remainingLessons: Math.floor(Math.random() * 8) + 2,
    };
  };

  if (user?.role !== 'MANAGER' && user?.role !== 'ADMIN' && user?.role !== 'TEACHER') {
    return null;
  }

  return (
    <Card elevation={3}>
      <CardHeader
        avatar={<PeopleIcon />}
        title="Студенты"
        subheader={`Всего студентов: ${students.length}`}
      />
      
      <CardContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : students.length === 0 ? (
          <Typography variant="body2" color="textSecondary" align="center" sx={{ py: 2 }}>
            Нет студентов
          </Typography>
        ) : (
          <>
            <List disablePadding>
              {students.map((student, index) => {
                const stats = getStudentStats(student);
                
                return (
                  <React.Fragment key={student.id}>
                    <ListItem alignItems="flex-start" sx={{ py: 1, px: 0 }}>
                      <ListItemAvatar>
                        <Avatar>
                          {student.firstName?.charAt(0)}
                          {student.lastName?.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle2">
                            {student.firstName} {student.lastName}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                              <Chip 
                                icon={<SchoolIcon fontSize="small" />} 
                                label={`${stats.completedLessons}/${stats.totalLessons}`} 
                                size="small" 
                                variant="outlined"
                              />
                              <Chip 
                                icon={<AssignmentIcon fontSize="small" />} 
                                label={`${stats.remainingLessons} осталось`} 
                                size="small" 
                                variant="outlined"
                                color={stats.remainingLessons <= 3 ? "error" : "primary"}
                              />
                            </Box>
                            {student.telegramUsername && (
                              <Typography variant="caption" color="textSecondary">
                                @{student.telegramUsername}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < students.length - 1 && <Divider />}
                  </React.Fragment>
                );
              })}
            </List>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button variant="outlined" size="small">
                Все студенты
              </Button>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardStudentsWidget;