import React from 'react';
import { Chip, Tooltip } from '@mui/material';
import {
  Event as EventIcon,
  PlayArrow as PlayArrowIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
  Help as HelpIcon
} from '@mui/icons-material';
import { LessonStatus } from '../../types';

interface LessonStatusBadgeProps {
  status: LessonStatus;
  size?: 'small' | 'medium';
  showIcon?: boolean;
  tooltip?: string;
}

const LessonStatusBadge: React.FC<LessonStatusBadgeProps> = ({
  status,
  size = 'medium',
  showIcon = true,
  tooltip,
}) => {
  const statusText = getStatusText(status);
  const StatusIconComponent = showIcon ? getStatusIconComponent(status) : undefined;

  const chip = (
    <Chip
      label={statusText}
      color={getChipColor(status)}
      variant="filled"
      size={size}
      icon={StatusIconComponent ? <StatusIconComponent /> : undefined}
      sx={{
        fontWeight: 'bold',
        minWidth: 100,
        ...getSizeStyles(size),
      }}
    />
  );

  return tooltip ? (
    <Tooltip title={tooltip} arrow>
      {chip}
    </Tooltip>
  ) : (
    chip
  );
};

const getChipColor = (status: LessonStatus): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
  switch (status) {
    case LessonStatus.SCHEDULED:
      return 'primary';
    case LessonStatus.CONDUCTED:
      return 'info';
    case LessonStatus.COMPLETED:
      return 'success';
    case LessonStatus.CANCELLED:
      return 'error';
    case LessonStatus.MISSED:
      return 'warning';
    default:
      return 'default';
  }
};

const getSizeStyles = (size: string) => {
  switch (size) {
    case 'small':
      return { fontSize: '0.75rem', padding: '4px 8px' };
    default:
      return { fontSize: '0.875rem', padding: '6px 12px' };
  }
};

const getStatusText = (status: LessonStatus): string => {
  switch (status) {
    case LessonStatus.SCHEDULED:
      return 'Запланирован';
    case LessonStatus.CONDUCTED:
      return 'Проведен';
    case LessonStatus.COMPLETED:
      return 'Завершен';
    case LessonStatus.CANCELLED:
      return 'Отменен';
    case LessonStatus.MISSED:
      return 'Пропущен';
    default:
      return 'Неизвестно';
  }
};

const getStatusIconComponent = (status: LessonStatus): React.ComponentType<any> => {
  switch (status) {
    case LessonStatus.SCHEDULED:
      return EventIcon;
    case LessonStatus.CONDUCTED:
      return PlayArrowIcon;
    case LessonStatus.COMPLETED:
      return CheckCircleIcon;
    case LessonStatus.CANCELLED:
      return CancelIcon;
    case LessonStatus.MISSED:
      return ScheduleIcon;
    default:
      return HelpIcon;
  }
};

export default LessonStatusBadge;