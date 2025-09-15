import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Chip,
  LinearProgress,
  Divider,
  CircularProgress,
  Button,
  Alert,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  School as SchoolIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { setStudents, setLoading, setError } from '../../store/userSlice';
import UserService from '../../services/userService';
import { Student, LessonPackage } from '../../types';

const DashboardPackagesWidget: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { students, loading, error } = useSelector((state: RootState) => state.users);
  const [studentPackages, setStudentPackages] = useState<Array<{student: Student, packages: LessonPackage[]}>>([]);
  const [lowPackages, setLowPackages] = useState<LessonPackage[]>([]);

  useEffect(() => {
    if (user?.role === 'MANAGER' || user?.role === 'ADMIN') {
      loadStudentPackages();
    }
  }, [user?.id]);

  const loadStudentPackages = async () => {
    if (!user?.id) return;
    
    dispatch(setLoading(true));
    try {
      // Load all students
      const allStudents = await UserService.getAllStudents();
      dispatch(setStudents(allStudents));
      
      // For demo purposes, we'll simulate package data
      // In a real implementation, you would fetch actual package data
      const studentPackagesData = allStudents.slice(0, 5).map(student => ({
        student,
        packages: [
          {
            id: Math.floor(Math.random() * 1000),
            studentId: student.id,
            totalLessons: 10,
            remainingLessons: Math.floor(Math.random() * 4),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        ] as LessonPackage[]
      }));
      
      setStudentPackages(studentPackagesData);
      
      // Find packages with low remaining lessons
      const lowPackageList: LessonPackage[] = [];
      studentPackagesData.forEach(({student, packages}) => {
        packages.forEach(pkg => {
          if (pkg.remainingLessons <= 3 && pkg.remainingLessons > 0) {
            lowPackageList.push(pkg);
          }
        });
      });
      
      setLowPackages(lowPackageList);
    } catch (err: any) {
      dispatch(setError(err.message || 'Ошибка загрузки данных о пакетах'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const getProgressPercentage = (pkg: LessonPackage) => {
    return ((pkg.totalLessons - pkg.remainingLessons) / pkg.totalLessons) * 100;
  };

  const getStatusColor = (remaining: number) => {
    if (remaining === 0) {
      return 'default';
    } else if (remaining <= 3) {
      return 'error';
    } else {
      return 'success';
    }
  };

  const getStatusText = (remaining: number) => {
    if (remaining === 0) {
      return 'Использован';
    } else if (remaining <= 3) {
      return 'Заканчивается';
    } else {
      return 'Активен';
    }
  };

  if (user?.role !== 'MANAGER' && user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <Card elevation={3}>
      <CardHeader
        avatar={<AssignmentIcon />}
        title="Пакеты уроков студентов"
        subheader={`Студентов с заканчивающимися пакетами: ${lowPackages.length}`}
      />
      
      <CardContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : studentPackages.length === 0 ? (
          <Typography variant="body2" color="textSecondary" align="center" sx={{ py: 2 }}>
            Нет данных о пакетах уроков
          </Typography>
        ) : (
          <>
            <List disablePadding>
              {studentPackages.map(({student, packages}, index) => (
                <React.Fragment key={student.id}>
                  <ListItem alignItems="flex-start" sx={{ py: 1, px: 0 }}>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2">
                          {student.firstName} {student.lastName}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          {packages.map(pkg => (
                            <Box key={pkg.id} sx={{ mb: 1 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                <Typography variant="caption">
                                  {pkg.totalLessons - pkg.remainingLessons}/{pkg.totalLessons} уроков
                                </Typography>
                                <Chip 
                                  label={getStatusText(pkg.remainingLessons)} 
                                  color={getStatusColor(pkg.remainingLessons) as any}
                                  size="small"
                                />
                              </Box>
                              <LinearProgress 
                                variant="determinate" 
                                value={getProgressPercentage(pkg)} 
                                color={pkg.remainingLessons <= 3 ? "error" : "success"}
                              />
                              {pkg.remainingLessons <= 3 && pkg.remainingLessons > 0 && (
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                  <WarningIcon 
                                    color="error" 
                                    sx={{ fontSize: '0.875rem', mr: 0.5 }} 
                                  />
                                  <Typography variant="caption" color="error">
                                    Осталось {pkg.remainingLessons} уроков!
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          ))}
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < studentPackages.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            
            {lowPackages.length > 0 && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  У {lowPackages.length} студентов заканчиваются пакеты уроков
                </Typography>
              </Alert>
            )}
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button variant="outlined" size="small" startIcon={<SchoolIcon />}>
                Управление пакетами
              </Button>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardPackagesWidget;