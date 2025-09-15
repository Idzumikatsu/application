import React from 'react';
import { Chip, ChipProps } from '@mui/material';
import { GroupLessonStatus } from '../../types';
import LessonService from '../../services/lessonService';

export interface GroupLessonStatusBadgeProps {
  status: GroupLessonStatus;
  size?: 'small' | 'medium';
  onClick?: () => void;
  clickable?: boolean;
}

export const GroupLessonStatusBadge: React.FC<GroupLessonStatusBadgeProps> = ({
  status,
  size = 'medium',
  onClick,
  clickable = false,
}) => {
  const { color, text } = LessonService.getGroupLessonStatusInfo(status);

  const chipProps: ChipProps = {
    label: text,
    color: color as ChipProps['color'],
    size,
    onClick: clickable ? onClick : undefined,
    sx: {
      cursor: clickable ? 'pointer' : 'default',
      fontWeight: 'medium',
      minWidth: size === 'small' ? 80 : 100,
      '&:hover': clickable ? { opacity: 0.8 } : undefined,
    },
  };

  return <Chip {...chipProps} />;
};

export default GroupLessonStatusBadge;