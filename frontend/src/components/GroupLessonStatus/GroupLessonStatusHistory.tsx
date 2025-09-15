import React from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Divider,
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

export interface GroupLessonStatusHistoryItem {
  id: number;
  status: GroupLessonStatus;
  changedAt: string;
  changedBy: string;
  reason?: string;
}

export interface GroupLessonStatusHistoryProps {
  history: GroupLessonStatusHistoryItem[];
  lessonId: number;
}

export const GroupLessonStatusHistory: React.FC<GroupLessonStatusHistoryProps> = ({
  history,
  lessonId,
}) => {
  const getStatusIcon = (status: GroupLessonStatus) => {
    switch (status) {
      case GroupLessonStatus.SCHEDULED:
        return <ScheduleIcon color="info" />;
      case GroupLessonStatus.CONFIRMED:
        return <CheckCircleIcon color="primary" />;
      case GroupLessonStatus.IN_PROGRESS:
        return <PlayArrowIcon color="warning" />;
      case GroupLessonStatus.COMPLETED:
        return <CheckCircleIcon color="success" />;
      case GroupLessonStatus.CANCELLED:
        return <CancelIcon color="error" />;
      case GroupLessonStatus.POSTPONED:
        return <PauseIcon />;
      default:
        return <EventIcon />;
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (history.length === 0) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          История статусов группового урока
        </Typography>
        <Typography variant="body2" color="textSecondary">
          История изменений статуса пока отсутствует
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        История статусов группового урока
      </Typography>
      
      <List>
        {history.map((item, index) => (
          <React.Fragment key={item.id}>
            <ListItem>
              <ListItemIcon>
                {getStatusIcon(item.status)}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      label={LessonService.getGroupLessonStatusText(item.status)}
                      size="small"
                      color={LessonService.getGroupLessonStatusInfo(item.status).color as any}
                    />
                    <Typography variant="body2" color="textSecondary">
                      {formatDateTime(item.changedAt)}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2">
                      Изменено: {item.changedBy}
                    </Typography>
                    {item.reason && (
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                        Причина: {item.reason}
                      </Typography>
                    )}
                  </Box>
                }
              />
            </ListItem>
            {index < history.length - 1 && <Divider variant="inset" component="li" />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default GroupLessonStatusHistory;