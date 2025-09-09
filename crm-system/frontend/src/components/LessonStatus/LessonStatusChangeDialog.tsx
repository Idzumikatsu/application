import React, { useState, useEffect } from 'react';
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
  FormControlLabel,
  Checkbox,
  Alert,
  Box,
  Typography,
} from '@mui/material';
import { LessonStatus, LessonStatusChangeRequest } from '../../types';
import lessonService from '../../services/lessonService';
import { LessonStatusBadge } from './';

interface LessonStatusChangeDialogProps {
  open: boolean;
  onClose: () => void;
  onStatusChange: (lessonId: number, statusChange: LessonStatusChangeRequest) => Promise<void>;
  lessonId: number;
  currentStatus: LessonStatus;
  userRole: string;
  studentId?: number;
}

const LessonStatusChangeDialog: React.FC<LessonStatusChangeDialogProps> = ({
  open,
  onClose,
  onStatusChange,
  lessonId,
  currentStatus,
  userRole,
  studentId,
}) => {
  const [newStatus, setNewStatus] = useState<LessonStatus>(currentStatus);
  const [reason, setReason] = useState('');
  const [deductPackage, setDeductPackage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const availableStatuses = (Object.keys(LessonStatus) as Array<keyof typeof LessonStatus>)
    .map(key => LessonStatus[key])
    .filter((status: LessonStatus) =>
      lessonService.canChangeStatus(currentStatus, status, userRole)
    );

  useEffect(() => {
    if (open) {
      setNewStatus(currentStatus);
      setReason('');
      setDeductPackage(false);
      setError('');
    }
  }, [open, currentStatus]);

  const handleSubmit = async () => {
    if (!lessonService.canChangeStatus(currentStatus, newStatus, userRole)) {
      setError('Невозможно изменить статус на выбранный');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const statusChange: LessonStatusChangeRequest = {
        newStatus,
        reason: reason.trim() || undefined,
        deductPackage,
      };

      await onStatusChange(lessonId, statusChange);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка при изменении статуса');
    } finally {
      setLoading(false);
    }
  };

  const getStatusChangeDescription = (from: LessonStatus, to: LessonStatus): string => {
    const descriptions: Record<string, string> = {
      'SCHEDULED->CONDUCTED': 'Урок будет отмечен как проведенный',
      'SCHEDULED->CANCELLED': 'Урок будет отменен',
      'SCHEDULED->MISSED': 'Урок будет отмечен как пропущен',
      'CONDUCTED->COMPLETED': 'Урок будет завершен',
      'CONDUCTED->CANCELLED': 'Урок будет отменен после проведения',
      'CANCELLED->SCHEDULED': 'Урок будет перепланирован',
      'MISSED->SCHEDULED': 'Урок будет перепланирован',
    };

    return descriptions[`${from}->${to}`] || 'Изменение статуса урока';
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Изменение статуса урока</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Текущий статус:
          </Typography>
          <LessonStatusBadge status={currentStatus} />
        </Box>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Новый статус</InputLabel>
          <Select
            value={newStatus}
            label="Новый статус"
            onChange={(e) => setNewStatus(e.target.value as LessonStatus)}
          >
            {availableStatuses.map((status: LessonStatus) => (
              <MenuItem key={status} value={status}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LessonStatusBadge status={status} size="small" showIcon={false} />
                  {lessonService.getLessonStatusText(status)}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {newStatus !== currentStatus && (
          <Alert severity="info" sx={{ mb: 2 }}>
            {getStatusChangeDescription(currentStatus, newStatus)}
          </Alert>
        )}

        {(newStatus === LessonStatus.CANCELLED || newStatus === LessonStatus.MISSED) && (
          <TextField
            fullWidth
            label="Причина"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            multiline
            rows={3}
            placeholder="Укажите причину отмены или пропуска урока..."
            sx={{ mb: 2 }}
          />
        )}

        {newStatus === LessonStatus.COMPLETED && studentId && (
          <FormControlLabel
            control={
              <Checkbox
                checked={deductPackage}
                onChange={(e) => setDeductPackage(e.target.checked)}
              />
            }
            label="Списать занятие из пакета студента"
          />
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Отмена
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading || newStatus === currentStatus}
          variant="contained"
        >
          {loading ? 'Сохранение...' : 'Изменить статус'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LessonStatusChangeDialog;