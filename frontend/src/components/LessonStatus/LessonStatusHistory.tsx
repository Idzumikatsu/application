import React from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Box,
  Divider,
  Avatar,
} from '@mui/material';
import { Settings as SettingsIcon, Person as PersonIcon, ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { LessonStatusHistory as LessonStatusHistoryType } from '../../types';
import { LessonStatusBadge } from './';

interface LessonStatusHistoryProps {
  history: LessonStatusHistoryType[];
  title?: string;
  maxItems?: number;
}

const LessonStatusHistory: React.FC<LessonStatusHistoryProps> = ({
  history,
  title = 'История изменений статуса',
  maxItems = 10,
}) => {
  const displayHistory = maxItems ? history.slice(0, maxItems) : history;

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTimelineIcon = (automated: boolean) => {
    return automated ? <SettingsIcon fontSize="small" /> : <PersonIcon fontSize="small" />;
  };

  if (history.length === 0) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          История изменений статуса отсутствует
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      
      <List>
        {displayHistory.map((item, index) => (
          <React.Fragment key={item.id}>
            <ListItem alignItems="flex-start">
              <ListItemIcon>
                <Avatar
                  sx={{
                    bgcolor: item.automated ? 'secondary.main' : 'primary.main',
                    width: 32,
                    height: 32,
                  }}
                >
                  {getTimelineIcon(item.automated)}
                </Avatar>
              </ListItemIcon>
              
              <ListItemText
                primary={
                  <Box sx={{ mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <LessonStatusBadge status={item.oldStatus} size="small" showIcon={false} />
                      <ArrowForwardIcon sx={{ fontSize: '16px' }} />
                      <LessonStatusBadge status={item.newStatus} size="small" showIcon={false} />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary">
                      {formatDateTime(item.createdAt || '')}
                    </Typography>
                    
                    {item.changeReason && (
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        Причина: {item.changeReason}
                      </Typography>
                    )}
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        Изменено: {item.changedBy}
                      </Typography>
                      {item.automated && (
                        <Chip
                          label="Автоматически"
                          size="small"
                          color="secondary"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </Box>
                }
              />
            </ListItem>
            
            {index < displayHistory.length - 1 && (
              <Divider variant="inset" component="li" />
            )}
          </React.Fragment>
        ))}
      </List>

      {maxItems && history.length > maxItems && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
          Показано {maxItems} из {history.length} записей
        </Typography>
      )}
    </Paper>
  );
};

export default LessonStatusHistory;