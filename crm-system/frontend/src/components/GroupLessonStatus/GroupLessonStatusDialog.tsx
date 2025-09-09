import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
  Typography,
} from '@mui/material';
import { GroupLessonStatus } from '../../types';
import LessonService from '../../services/lessonService';

export interface GroupLessonStatusDialogProps {
  open: boolean;
  onClose: () => void;
  onStatusChange: (newStatus: GroupLessonStatus, reason?: string) => Promise<void>;
  currentStatus: GroupLessonStatus;
  lessonId: number;
  lessonTopic: string;
}

export const GroupLessonStatusDialog: React.FC<GroupLessonStatusDialogProps> = ({
  open,
  onClose,
  onStatusChange,
  currentStatus,
  lessonId,
  lessonTopic,
}) => {
  const [newStatus, setNewStatus] = useState<GroupLessonStatus>(currentStatus);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async () => {
    setLoading(true);
    try {
      await onStatusChange(newStatus, reason);
      onClose();
    } catch (error) {
      console.error('Ошибка изменения статуса:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAvailableStatuses = (currentStatus: GroupLessonStatus): GroupLessonStatus[] => {
    const allowedTransitions: Record<GroupLessonStatus, GroupLessonStatus[]> = {
      [GroupLessonStatus.SCHEDULED]: [
        GroupLessonStatus.CONFIRMED,
        GroupLessonStatus.CANCELLED,
        GroupLessonStatus.POSTPONED,
      ],
      [GroupLessonStatus.CONFIRMED]: [
        GroupLessonStatus.IN_PROGRESS,
        GroupLessonStatus.CANCELLED,
        GroupLessonStatus.POSTPONED,
      ],
      [GroupLessonStatus.IN_PROGRESS]: [
        GroupLessonStatus.COMPLETED,
        GroupLessonStatus.CANCELLED,
      ],
      [GroupLessonStatus.COMPLETED]: [],
      [GroupLessonStatus.CANCELLED]: [
        GroupLessonStatus.SCHEDULED,
      ],
      [GroupLessonStatus.POSTPONED]: [
        GroupLessonStatus.SCHEDULED,
        GroupLessonStatus.CANCELLED,
      ],
    };

    return allowedTransitions[currentStatus] || [];
  };

  const availableStatuses = getAvailableStatuses(currentStatus);
  const requiresReason = newStatus === GroupLessonStatus.CANCELLED || newStatus === GroupLessonStatus.POSTPONED;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Изменить статус группового урока
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Урок: {lessonTopic}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Текущий статус: {LessonService.getGroupLessonStatusText(currentStatus)}
          </Typography>
        </Box>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Новый статус</InputLabel>
          <Select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value as GroupLessonStatus)}
            label="Новый статус"
          >
            {availableStatuses.map((status) => (
              <MenuItem key={status} value={status}>
                {LessonService.getGroupLessonStatusText(status)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {requiresReason && (
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Причина изменения статуса"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Опишите причину изменения статуса..."
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button
          onClick={handleStatusChange}
          variant="contained"
          disabled={loading || newStatus === currentStatus || (requiresReason && !reason.trim())}
        >
          {loading ? 'Изменение...' : 'Изменить статус'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GroupLessonStatusDialog;