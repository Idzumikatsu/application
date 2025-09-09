import React from 'react';
import { Chip, Tooltip } from '@mui/material';
import { LessonStatus } from '../../types';
import lessonService from '../../services/lessonService';

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
  const statusText = lessonService.getLessonStatusText(status);
  const statusColor = lessonService.getLessonStatusColor(status);
  const statusIcon = showIcon ? lessonService.getLessonStatusIcon(status) : undefined;

  const chip = (
    <Chip
      label={statusText}
      color={getChipColor(status)}
      variant="filled"
      size={size}
      icon={statusIcon ? <span className="material-icons">{statusIcon}</span> : undefined}
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

export default LessonStatusBadge;