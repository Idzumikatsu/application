import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  LinearProgress,
  Chip,
} from '@mui/material';
import { RootState } from '../store';
import { setLoading, setError } from '../store/userSlice';
import { LessonPackage } from '../types';

const StudentPackagesPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { loading, error } = useSelector((state: RootState) => state.users);
  const dispatch = useDispatch();
  
  const [studentPackages, setStudentPackages] = useState<LessonPackage[]>([]);

  const loadStudentData = useCallback(async () => {
    if (!user?.id) return;
    
    dispatch(setLoading(true));
    try {
      // В реальной реализации здесь будет вызов API для получения пакетов студента
      // Пока используем заглушку
      const mockPackages: LessonPackage[] = [
        {
          id: 1,
          studentId: user.id,
          totalLessons: 10,
          remainingLessons: 7,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 2,
          studentId: user.id,
          totalLessons: 20,
          remainingLessons: 0,
          createdAt: new Date(Date.now() - 30*24*60*60*1000).toISOString(), // 30 дней назад
          updatedAt: new Date(Date.now() - 10*24*60*60*1000).toISOString(), // 10 дней назад
        },
      ];
      
      setStudentPackages(mockPackages);
    } catch (err: any) {
      dispatch(setError(err.message || 'Ошибка загрузки данных'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [user?.id, dispatch]);

  useEffect(() => {
    if (user?.id) {
      loadStudentData();
    }
  }, [user?.id, loadStudentData]);


  const getPackageStatus = (pkg: LessonPackage) => {
    if (pkg.remainingLessons === 0) {
      return { text: 'Использован', color: 'default' };
    } else if (pkg.remainingLessons <= 3) {
      return { text: 'Заканчивается', color: 'error' };
    } else {
      return { text: 'Активен', color: 'success' };
    }
  };

  const getProgressPercentage = (pkg: LessonPackage) => {
    return ((pkg.totalLessons - pkg.remainingLessons) / pkg.totalLessons) * 100;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Мои пакеты уроков
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {studentPackages.map((pkg) => {
            const status = getPackageStatus(pkg);
            const progress = getProgressPercentage(pkg);
            
            return (
              <Grid item xs={12} sm={6} md={4} key={pkg.id}>
                <Paper sx={{ p: 2, height: '100%' }}>
                  <Typography variant="h6">
                    Пакет из {pkg.totalLessons} уроков
                  </Typography>
                  
                  <Box sx={{ mt: 2, mb: 2 }}>
                    <Typography variant="body1">
                      Использовано: {pkg.totalLessons - pkg.remainingLessons} из {pkg.totalLessons}
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={progress} 
                      sx={{ mt: 1 }} 
                    />
                  </Box>
                  
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    Осталось: {pkg.remainingLessons} уроков
                  </Typography>
                  
                  <Typography variant="body2" color="textSecondary">
                    Создан: {new Date(pkg.createdAt || '').toLocaleDateString('ru-RU')}
                  </Typography>
                  
                  <Chip 
                    label={status.text} 
                    color={status.color as any}
                    sx={{ mt: 1 }}
                  />
                  
                  {pkg.remainingLessons <= 3 && pkg.remainingLessons > 0 && (
                    <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                      ⚠️ Осталось мало уроков!
                    </Typography>
                  )}
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};

export default StudentPackagesPage;