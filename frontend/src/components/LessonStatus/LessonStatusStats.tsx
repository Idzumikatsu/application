import React from 'react';
import {
  Paper,
  Typography,
  Grid,
  Box,
  Card,
  CardContent,
  LinearProgress,
  Chip,
} from '@mui/material';
import { LessonStatusStats as LessonStatusStatsType, LessonStatus } from '../../types';
import lessonService from '../../services/lessonService';
import { LessonStatusBadge } from './';

interface LessonStatusStatsProps {
  stats: LessonStatusStatsType;
  title?: string;
  showPercentages?: boolean;
  showProgressBars?: boolean;
}

const LessonStatusStats: React.FC<LessonStatusStatsProps> = ({
  stats,
  title = 'Статистика статусов уроков',
  showPercentages = true,
  showProgressBars = true,
}) => {
  const getPercentage = (count: number): number => {
    if (stats.total === 0) return 0;
    return Math.round((count / stats.total) * 100);
  };

  const statusConfigs = [
    { status: LessonStatus.SCHEDULED, count: stats.scheduled, label: 'Запланированные' },
    { status: LessonStatus.CONDUCTED, count: stats.conducted, label: 'Проведенные' },
    { status: LessonStatus.COMPLETED, count: stats.completed, label: 'Завершенные' },
    { status: LessonStatus.CANCELLED, count: stats.cancelled, label: 'Отмененные' },
    { status: LessonStatus.MISSED, count: stats.missed, label: 'Пропущенные' },
  ];

  const totalCount = stats.total;

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" color="primary" align="center">
          {totalCount}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          Всего уроков
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {statusConfigs.map(({ status, count, label }) => {
          const percentage = getPercentage(count);
          
          return (
            <Grid item xs={12} sm={6} md={4} key={status}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <LessonStatusBadge status={status} size="small" />
                    <Typography variant="h6" component="div">
                      {count}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {label}
                  </Typography>
                  
                  {showPercentages && totalCount > 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                      <Chip
                        label={`${percentage}%`}
                        size="small"
                        color={percentage > 0 ? 'primary' : 'default'}
                        variant={percentage > 0 ? 'filled' : 'outlined'}
                      />
                      <Typography variant="caption" color="text.secondary">
                        от общего числа
                      </Typography>
                    </Box>
                  )}
                  
                  {showProgressBars && totalCount > 0 && (
                    <Box sx={{ mt: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={percentage}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: 'grey.200',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: lessonService.getLessonStatusColor(status),
                          },
                        }}
                      />
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {totalCount === 0 && (
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
          Нет данных для отображения статистики
        </Typography>
      )}
    </Paper>
  );
};

export default LessonStatusStats;