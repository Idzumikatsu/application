import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { LessonStatusTransitionService } from '../../services/lessonStatusTransitionService';
import { setLoading, setError } from '../../store/notificationSlice';
import { updateLesson } from '../../store/lessonSlice';
import { Box, Typography, Paper, Chip, Button } from '@mui/material';
import { PlayArrow, Stop } from '@mui/icons-material';

interface LessonStatusAutomationProps {
  lessonId?: number;
  showControls?: boolean;
}

const LessonStatusAutomation: React.FC<LessonStatusAutomationProps> = ({
  lessonId,
  showControls = false
}) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isRunning, setIsRunning] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [checkInterval, setCheckInterval] = useState<NodeJS.Timeout | null>(null);

  const rules = LessonStatusTransitionService.getTransitionRules();

  const startAutomation = useCallback(() => {
    if (isRunning) return;

    const interval = LessonStatusTransitionService.startPeriodicCheck(5);
    setCheckInterval(interval);
    setIsRunning(true);
    setLastCheck(new Date());
    
    dispatch(setLoading(false));
  }, [isRunning, dispatch]);

  const stopAutomation = useCallback(() => {
    if (checkInterval) {
      clearInterval(checkInterval);
      setCheckInterval(null);
    }
    setIsRunning(false);
    
    dispatch(setLoading(false));
  }, [checkInterval, dispatch]);

  const checkSingleLesson = useCallback(async () => {
    if (!lessonId) return;

    try {
      dispatch(setLoading(true));
      const lesson = await LessonStatusTransitionService.checkAndApplyTransitions({ id: lessonId } as any);
      
      if (lesson) {
        dispatch(updateLesson(lesson));
      }
      
      setLastCheck(new Date());
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setError('Ошибка при проверке статуса урока'));
      dispatch(setLoading(false));
    }
  }, [lessonId, dispatch]);

  useEffect(() => {
    // Автоматически запускаем проверку при монтировании компонента
    if (user?.role === 'ADMIN' || user?.role === 'MANAGER') {
      startAutomation();
    }

    return () => {
      stopAutomation();
    };
  }, [user, startAutomation, stopAutomation]);

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" component="h2">
          Автоматические переходы статусов
        </Typography>
        
        {showControls && (
          <Box>
            {!isRunning ? (
              <Button
                variant="contained"
                color="success"
                startIcon={<PlayArrow />}
                onClick={startAutomation}
                size="small"
              >
                Запустить
              </Button>
            ) : (
              <Button
                variant="contained"
                color="error"
                startIcon={<Stop />}
                onClick={stopAutomation}
                size="small"
              >
                Остановить
              </Button>
            )}
          </Box>
        )}
      </Box>

      <Box mb={2}>
        <Typography variant="subtitle2" gutterBottom>
          Статус: {isRunning ? 'Запущено' : 'Остановлено'}
        </Typography>
        {lastCheck && (
          <Typography variant="body2" color="textSecondary">
            Последняя проверка: {lastCheck.toLocaleString()}
          </Typography>
        )}
      </Box>

      <Box mb={2}>
        <Typography variant="subtitle2" gutterBottom>
          Правила переходов:
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={1}>
          {rules.map((rule, index) => (
            <Chip
              key={index}
              label={`${rule.from} → ${rule.to}`}
              size="small"
              variant="outlined"
              title={rule.description}
            />
          ))}
        </Box>
      </Box>

      {lessonId && (
        <Box>
          <Button
            variant="outlined"
            onClick={checkSingleLesson}
            size="small"
          >
            Проверить этот урок
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default LessonStatusAutomation;