import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  LinearProgress,
  Card,
  CardContent,
} from '@mui/material';
import {
  Event as EventIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
} from '@mui/icons-material';
import { GroupLessonStatus } from '../../types';
import LessonService from '../../services/lessonService';

export interface GroupLessonStatusStatsProps {
  stats: {
    total: number;
    scheduled: number;
    confirmed: number;
    inProgress: number;
    completed: number;
    cancelled: number;
    postponed: number;
  };
}

export const GroupLessonStatusStats: React.FC<GroupLessonStatusStatsProps> = ({ stats }) => {
  const getStatusIcon = (status: GroupLessonStatus) => {
    switch (status) {
      case GroupLessonStatus.SCHEDULED:
        return <ScheduleIcon />;
      case GroupLessonStatus.CONFIRMED:
        return <CheckCircleIcon />;
      case GroupLessonStatus.IN_PROGRESS:
        return <PlayArrowIcon />;
      case GroupLessonStatus.COMPLETED:
        return <CheckCircleIcon />;
      case GroupLessonStatus.CANCELLED:
        return <CancelIcon />;
      case GroupLessonStatus.POSTPONED:
        return <PauseIcon />;
      default:
        return <EventIcon />;
    }
  };

  const getPercentage = (count: number) => {
    return stats.total > 0 ? (count / stats.total) * 100 : 0;
  };

  const statusItems = [
    {
      status: GroupLessonStatus.SCHEDULED,
      count: stats.scheduled,
      label: 'Запланированные',
    },
    {
      status: GroupLessonStatus.CONFIRMED,
      count: stats.confirmed,
      label: 'Подтвержденные',
    },
    {
      status: GroupLessonStatus.IN_PROGRESS,
      count: stats.inProgress,
      label: 'В процессе',
    },
    {
      status: GroupLessonStatus.COMPLETED,
      count: stats.completed,
      label: 'Завершенные',
    },
    {
      status: GroupLessonStatus.CANCELLED,
      count: stats.cancelled,
      label: 'Отмененные',
    },
    {
      status: GroupLessonStatus.POSTPONED,
      count: stats.postponed,
      label: 'Перенесенные',
    },
  ];

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Статистика статусов групповых уроков
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Всего групповых уроков: {stats.total}
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {statusItems.map((item) => (
          <Grid item xs={12} md={6} lg={4} key={item.status}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {getStatusIcon(item.status)}
                  <Box sx={{ ml: 1 }}>
                    <Typography variant="subtitle2">
                      {item.label}
                    </Typography>
                    <Typography variant="h6">
                      {item.count}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Chip
                    label={LessonService.getGroupLessonStatusText(item.status)}
                    size="small"
                    color={LessonService.getGroupLessonStatusInfo(item.status).color as any}
                  />
                  <Typography variant="body2" color="textSecondary">
                    {getPercentage(item.count).toFixed(1)}%
                  </Typography>
                </Box>

                <LinearProgress
                  variant="determinate"
                  value={getPercentage(item.count)}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: LessonService.getGroupLessonStatusInfo(item.status).color === 'default' 
                        ? 'grey.500' 
                        : `${LessonService.getGroupLessonStatusInfo(item.status).color}.main`,
                    },
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {stats.total > 0 && (
        <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="body2" color="textSecondary">
            <strong>Эффективность:</strong>{' '}
            {((stats.completed / stats.total) * 100).toFixed(1)}% уроков завершено успешно
          </Typography>
          <Typography variant="body2" color="textSecondary">
            <strong>Коэффициент отмен:</strong>{' '}
            {((stats.cancelled / stats.total) * 100).toFixed(1)}% уроков отменено
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default GroupLessonStatusStats;